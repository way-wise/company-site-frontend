"use client";

import { useSocket } from "@/context/SocketContext";
import { chatQueryKeys, useMessages } from "@/hooks/useChatMutations";
import { ChatMessage, Conversation } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import ConversationHeader from "./ConversationHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
  conversation: Conversation;
  currentUserProfileId: string;
}

export default function ChatWindow({
  conversation,
  currentUserProfileId,
}: ChatWindowProps) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messagesData, isLoading } = useMessages(conversation.id);
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
    socket.emit("conversation:join", { conversationId: conversation.id });

    // Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId === conversation.id) {
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.messages(conversation.id),
        });
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversations(),
        });
      }
    };

    // Listen for message updates
    const handleMessageUpdated = (message: ChatMessage) => {
      if (message.conversationId === conversation.id) {
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.messages(conversation.id),
        });
      }
    };

    // Listen for message deletion
    const handleMessageDeleted = (data: {
      messageId: string;
      conversationId: string;
    }) => {
      if (data.conversationId === conversation.id) {
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.messages(conversation.id),
        });
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:updated", handleMessageUpdated);
    socket.on("message:deleted", handleMessageDeleted);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:updated", handleMessageUpdated);
      socket.off("message:deleted", handleMessageDeleted);

      // Leave conversation room
      socket.emit("conversation:leave", { conversationId: conversation.id });
    };
  }, [socket, isConnected, conversation.id, queryClient, currentUserProfileId]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (socket && isConnected && messages.length > 0) {
      socket.emit("message:read", { conversationId: conversation.id });
    }
  }, [socket, isConnected, conversation.id, messages]);

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
      <MessageInput conversationId={conversation.id} />
    </div>
  );
}
