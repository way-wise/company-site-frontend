"use client";

import { useSSE } from "@/context/SSEContext";
import {
  chatQueryKeys,
  useConversation,
  useMarkConversationAsRead,
  useMessages,
} from "@/hooks/useChatMutations";
import { ApiResponse, ChatMessage, Conversation } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import ConversationHeader from "./ConversationHeader";
import ConversationMediaGallery from "./ConversationMediaGallery";
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
  const { isConnected, connect, onEvent, offEvent } = useSSE();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const markAsReadMutation = useMarkConversationAsRead();
  const markedAsReadRef = useRef<string | null>(null);

  const { data: conversationData } = useConversation(conversationId);
  const conversation = conversationData?.data;

  const { data: messagesData, isLoading } = useMessages(conversationId);
  const messages = useMemo(
    () => messagesData?.data?.result || [],
    [messagesData?.data?.result]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (
      conversationId &&
      conversation &&
      markedAsReadRef.current !== conversationId &&
      !markAsReadMutation.isPending
    ) {
      markedAsReadRef.current = conversationId;
      markAsReadMutation.mutate(conversationId);
    }
  }, [conversationId, markAsReadMutation]);

  // Ensure SSE connection is active before registering event listeners
  useEffect(() => {
    if (!isConnected) {
      connect();
      return;
    }

    const handleNewMessage = (data: unknown) => {
      const message = data as ChatMessage;
      if (message.conversationId === conversationId) {
        // Directly update messages cache
        const messagesQueryKey = chatQueryKeys.messageList(conversationId, 1);
        const currentMessages = queryClient.getQueryData<
          ApiResponse<{
            meta: { page: number; limit: number; total: number };
            result: ChatMessage[];
          }>
        >(messagesQueryKey);

        if (currentMessages?.data) {
          // Check if message already exists by real ID
          const messageExists = currentMessages.data.result.some(
            (msg) => msg.id === message.id && !msg.id.startsWith("temp-")
          );

          if (!messageExists) {
            // Check if there's a temp message from optimistic update that should be replaced
            const hasTempMessage = currentMessages.data.result.some((msg) =>
              msg.id.startsWith("temp-")
            );

            if (hasTempMessage) {
              // Replace temp message with real message
              const filteredMessages = currentMessages.data.result.filter(
                (msg) => !msg.id.startsWith("temp-")
              );

              queryClient.setQueryData(messagesQueryKey, {
                ...currentMessages,
                data: {
                  ...currentMessages.data,
                  result: [...filteredMessages, message],
                  meta: {
                    ...currentMessages.data.meta,
                    total: filteredMessages.length + 1,
                  },
                },
              });
            } else {
              // No temp message, just add the new message
              queryClient.setQueryData(messagesQueryKey, {
                ...currentMessages,
                data: {
                  ...currentMessages.data,
                  result: [...currentMessages.data.result, message],
                  meta: {
                    ...currentMessages.data.meta,
                    total: currentMessages.data.meta.total + 1,
                  },
                },
              });
            }
          }
        } else {
          // If cache doesn't exist, invalidate to trigger fetch
          queryClient.invalidateQueries({
            queryKey: chatQueryKeys.messages(conversationId),
          });
        }

        // Update conversations list to reflect new last message
        queryClient.setQueryData(
          chatQueryKeys.conversations(),
          (
            old:
              | ApiResponse<{
                  meta: { page: number; limit: number; total: number };
                  result: Conversation[];
                }>
              | undefined
          ) => {
            if (!old?.data) {
              return old;
            }
            return {
              ...old,
              data: {
                ...old.data,
                result: old.data.result.map((conv) =>
                  conv.id === conversationId
                    ? {
                        ...conv,
                        lastMessage: message,
                        updatedAt: message.createdAt,
                      }
                    : conv
                ),
              },
            };
          }
        );
      }
    };

    const handleMessageUpdated = (data: unknown) => {
      const message = data as ChatMessage;
      if (message.conversationId === conversationId) {
        // Directly update the message in cache
        const messagesQueryKey = chatQueryKeys.messageList(conversationId, 1);
        const currentMessages = queryClient.getQueryData<
          ApiResponse<{
            meta: { page: number; limit: number; total: number };
            result: ChatMessage[];
          }>
        >(messagesQueryKey);

        if (currentMessages?.data) {
          queryClient.setQueryData(messagesQueryKey, {
            ...currentMessages,
            data: {
              ...currentMessages.data,
              result: currentMessages.data.result.map((msg) =>
                msg.id === message.id ? message : msg
              ),
            },
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: chatQueryKeys.messages(conversationId),
          });
        }
      }
    };

    const handleMessageDeleted = (data: unknown) => {
      const deletedData = data as { messageId: string; conversationId: string };
      if (deletedData.conversationId === conversationId) {
        // Directly remove the message from cache
        const messagesQueryKey = chatQueryKeys.messageList(conversationId, 1);
        const currentMessages = queryClient.getQueryData<
          ApiResponse<{
            meta: { page: number; limit: number; total: number };
            result: ChatMessage[];
          }>
        >(messagesQueryKey);

        if (currentMessages?.data) {
          queryClient.setQueryData(messagesQueryKey, {
            ...currentMessages,
            data: {
              ...currentMessages.data,
              result: currentMessages.data.result.filter(
                (msg) => msg.id !== deletedData.messageId
              ),
              meta: {
                ...currentMessages.data.meta,
                total: Math.max(0, currentMessages.data.meta.total - 1),
              },
            },
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: chatQueryKeys.messages(conversationId),
          });
        }
      }
    };

    const handleConversationUpdated = (data: unknown) => {
      const updateData = data as {
        conversationId: string;
        lastMessage?: ChatMessage;
        updatedAt: string;
      };
      if (updateData.conversationId === conversationId) {
        // Directly update conversation detail cache
        queryClient.setQueryData(
          chatQueryKeys.conversationDetail(conversationId),
          (old: ApiResponse<Conversation> | undefined) => {
            if (!old?.data) {
              return old;
            }
            return {
              ...old,
              data: {
                ...old.data,
                lastMessage: updateData.lastMessage || old.data.lastMessage,
                updatedAt: updateData.updatedAt,
              },
            };
          }
        );

        // Also update in conversations list
        queryClient.setQueryData(
          chatQueryKeys.conversations(),
          (
            old:
              | ApiResponse<{
                  meta: { page: number; limit: number; total: number };
                  result: Conversation[];
                }>
              | undefined
          ) => {
            if (!old?.data) {
              return old;
            }
            return {
              ...old,
              data: {
                ...old.data,
                result: old.data.result.map((conv) =>
                  conv.id === conversationId
                    ? {
                        ...conv,
                        lastMessage: updateData.lastMessage || conv.lastMessage,
                        updatedAt: updateData.updatedAt,
                      }
                    : conv
                ),
              },
            };
          }
        );
      }
    };

    onEvent("message:new", handleNewMessage);
    onEvent("message:updated", handleMessageUpdated);
    onEvent("message:deleted", handleMessageDeleted);
    onEvent("conversation:updated", handleConversationUpdated);

    return () => {
      offEvent("message:new", handleNewMessage);
      offEvent("message:updated", handleMessageUpdated);
      offEvent("message:deleted", handleMessageDeleted);
      offEvent("conversation:updated", handleConversationUpdated);
    };
  }, [isConnected, connect, conversationId, queryClient, onEvent, offEvent]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading conversation...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <ConversationHeader
          conversation={conversation}
          onOpenMedia={() => setShowMediaGallery(true)}
        />

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

        <MessageInput conversationId={conversationId} />
      </div>

      <ConversationMediaGallery
        conversationId={conversationId}
        open={showMediaGallery}
        onOpenChange={setShowMediaGallery}
      />
    </>
  );
}
