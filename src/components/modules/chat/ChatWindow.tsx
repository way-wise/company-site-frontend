"use client";

import { useSocket } from "@/context/SocketContext";
import {
  chatQueryKeys,
  useConversation,
  useMessages,
} from "@/hooks/useChatMutations";
import { ChatMessage, Conversation } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import ConversationHeader from "./ConversationHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
  conversationId: string;
  currentUserProfileId: string;
}

export default function ChatWindow({
  conversationId,
  currentUserProfileId,
}: ChatWindowProps) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation data (will auto-update when participants change)
  const { data: conversationData } = useConversation(conversationId);
  const conversation = conversationData?.data;

  const { data: messagesData, isLoading } = useMessages(conversationId);
  const messages = useMemo(
    () => messagesData?.data?.result || [],
    [messagesData?.data?.result]
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join conversation room
    socket.emit("conversation:join", { conversationId });

    // Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.messages(conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversations(),
        });
      }
    };

    const handleMessageUpdated = (message: ChatMessage) => {
      if (message.conversationId === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.messages(conversationId),
        });
      }
    };

    // Listen for message deletion
    const handleMessageDeleted = (data: {
      messageId: string;
      conversationId: string;
    }) => {
      if (data.conversationId === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.messages(conversationId),
        });
      }
    };

    // Listen for conversation updates (participant changes, etc.)
    const handleConversationUpdated = (data: Conversation) => {
      if (data.id === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversationDetail(conversationId),
        });
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:updated", handleMessageUpdated);
    socket.on("message:deleted", handleMessageDeleted);
    socket.on("conversation:updated", handleConversationUpdated);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:updated", handleMessageUpdated);
      socket.off("message:deleted", handleMessageDeleted);
      socket.off("conversation:updated", handleConversationUpdated);

      // Leave conversation room
      socket.emit("conversation:leave", { conversationId });
    };
  }, [socket, isConnected, conversationId, queryClient]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (socket && isConnected && messages.length > 0) {
      socket.emit("message:read", { conversationId });
    }
  }, [socket, isConnected, conversationId, messages]);

  // Show loading state if conversation is not loaded yet
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ConversationHeader conversation={conversation} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUserProfileId}
              currentUserProfileId={currentUserProfileId}
            />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput conversationId={conversationId} />
    </div>
  );
}
