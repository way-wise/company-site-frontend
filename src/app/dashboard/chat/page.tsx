"use client";

import ChatWindow from "@/components/modules/chat/ChatWindow";
import ConversationList from "@/components/modules/chat/ConversationList";
import { useSSE } from "@/context/SSEContext";
import { useAuth } from "@/context/UserContext";
import {
  chatQueryKeys,
  useConversation,
  useConversations,
} from "@/hooks/useChatMutations";
import { Conversation } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { isConnected, connect, onEvent, offEvent } = useSSE();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const conversationIdFromQuery = searchParams.get("conversationId");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const { data: conversationsData, isLoading } = useConversations({
    page: 1,
    limit: 50,
  });

  const { data: conversationData } = useConversation(
    conversationIdFromQuery || ""
  );

  // Set selected conversation from query parameter
  useEffect(() => {
    if (conversationIdFromQuery && conversationData?.data) {
      setSelectedConversation(conversationData.data);
    } else if (conversationIdFromQuery && conversationsData?.data?.result) {
      // Try to find in the list if not loaded yet
      const found = conversationsData.data.result.find(
        (conv) => conv.id === conversationIdFromQuery
      );
      if (found) {
        setSelectedConversation(found);
      }
    }
  }, [conversationIdFromQuery, conversationData, conversationsData]);

  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      connect();
    }
  }, [isAuthenticated, isConnected, connect]);

  useEffect(() => {
    if (!isConnected) return;

    const handleConversationUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.conversations(),
      });
    };

    const handleConversationRemoved = (data: unknown) => {
      const removedData = data as { conversationId: string };
      if (selectedConversation?.id === removedData.conversationId) {
        setSelectedConversation(null);
      }
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.conversations(),
      });
    };

    onEvent("conversation:new", handleConversationUpdate);
    onEvent("conversation:updated", handleConversationUpdate);
    onEvent("conversation:removed", handleConversationRemoved);

    return () => {
      offEvent("conversation:new", handleConversationUpdate);
      offEvent("conversation:updated", handleConversationUpdate);
      offEvent("conversation:removed", handleConversationRemoved);
    };
  }, [isConnected, queryClient, selectedConversation, onEvent, offEvent]);

  return (
    <div className="flex h-[calc(100vh-7rem)] bg-background">
      {/* Sidebar - Conversation List */}
      <div className="w-80 border-r border-border flex flex-col">
        <ConversationList
          conversations={conversationsData?.data?.result || []}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          isLoading={isLoading}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            conversationId={selectedConversation.id}
            currentUserProfileId={user?.userProfile?.id || ""}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium">
                No conversation selected
              </h3>
              <p className="mt-2 text-sm">
                Choose a conversation from the list or start a new one
              </p>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${
              isConnected
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>
      )}
    </div>
  );
}
