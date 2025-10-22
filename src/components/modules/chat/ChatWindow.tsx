"use client";

import { useSocket } from "@/context/SocketContext";
import { chatQueryKeys, useMessages } from "@/hooks/useChatMutations";
import { ChatMessage, Conversation } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

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

    // Listen for typing indicators
    const handleTyping = (data: {
      conversationId: string;
      userProfileId: string;
      isTyping: boolean;
    }) => {
      if (
        data.conversationId === conversation.id &&
        data.userProfileId !== currentUserProfileId
      ) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userProfileId);
          } else {
            newSet.delete(data.userProfileId);
          }
          return newSet;
        });
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:updated", handleMessageUpdated);
    socket.on("message:deleted", handleMessageDeleted);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:updated", handleMessageUpdated);
      socket.off("message:deleted", handleMessageDeleted);
      socket.off("typing", handleTyping);

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

  const getTypingIndicatorText = () => {
    if (typingUsers.size === 0) return null;

    const typingParticipants = conversation.participants.filter((p) =>
      typingUsers.has(p.userProfileId)
    );

    if (typingParticipants.length === 1) {
      return `${typingParticipants[0].userProfile.user.name} is typing...`;
    } else if (typingParticipants.length === 2) {
      return `${typingParticipants[0].userProfile.user.name} and ${typingParticipants[1].userProfile.user.name} are typing...`;
    } else if (typingParticipants.length > 2) {
      return "Several people are typing...";
    }

    return null;
  };

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

        {/* Typing Indicator */}
        {getTypingIndicatorText() && (
          <div className="text-sm text-muted-foreground italic px-4">
            {getTypingIndicatorText()}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput conversationId={conversation.id} />
    </div>
  );
}
