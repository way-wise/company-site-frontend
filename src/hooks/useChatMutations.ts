"use client";

import { chatService } from "@/services/ChatService";
import { ApiResponse, ChatMessage, ConversationsQueryParams, CreateConversationData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/UserContext";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const chatQueryKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatQueryKeys.all, "conversations"] as const,
  conversation: (params: ConversationsQueryParams) =>
    [...chatQueryKeys.conversations(), params] as const,
  conversationDetail: (id: string) =>
    [...chatQueryKeys.conversations(), "detail", id] as const,
  messages: (conversationId: string) =>
    [...chatQueryKeys.all, "messages", conversationId] as const,
  messageList: (conversationId: string, page: number) =>
    [...chatQueryKeys.messages(conversationId), page] as const,
  media: (conversationId: string) =>
    [...chatQueryKeys.all, "media", conversationId] as const,
};

// Get all conversations
export const useConversations = (params: ConversationsQueryParams = {}) => {
  return useQuery({
    queryKey: chatQueryKeys.conversation(params),
    queryFn: () => chatService.getConversations(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

// Get single conversation
export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: chatQueryKeys.conversationDetail(conversationId),
    queryFn: () => chatService.getConversationById(conversationId),
    enabled: !!conversationId,
    staleTime: 30 * 1000,
  });
};

// Get messages for a conversation
export const useMessages = (
  conversationId: string,
  page: number = 1,
  limit: number = 50
) => {
  return useQuery({
    queryKey: chatQueryKeys.messageList(conversationId, page),
    queryFn: () => chatService.getMessages(conversationId, { page, limit }),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });
};

// Get media attachments for a conversation
export const useConversationMedia = (conversationId: string) => {
  return useQuery({
    queryKey: chatQueryKeys.media(conversationId),
    queryFn: () => chatService.getConversationMedia(conversationId),
    enabled: !!conversationId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Send message with attachments (uploads via REST)
export const useSendMessageWithAttachments = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
      files,
    }: {
      conversationId: string;
      content?: string;
      files: File[];
    }) => chatService.sendMessage(conversationId, { content, files }),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: chatQueryKeys.messages(variables.conversationId),
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<
        ApiResponse<{
          meta: { page: number; limit: number; total: number };
          result: ChatMessage[];
        }>
      >(chatQueryKeys.messageList(variables.conversationId, 1));

      // Create optimistic message
      if (user?.userProfile) {
        const optimisticMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          conversationId: variables.conversationId,
          senderId: user.userProfile.id,
          content: variables.content || "",
          attachments: variables.files.length > 0 ? variables.files.map((file, index) => ({
            id: `temp-attachment-${Date.now()}-${index}`,
            key: `temp/${file.name}`,
            url: URL.createObjectURL(file),
            name: file.name,
            mimeType: file.type,
            size: file.size,
            type: file.type.startsWith("image/") ? "image" : "document",
            uploadedAt: new Date().toISOString(),
          })) : null,
          isEdited: false,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sender: {
            id: user.userProfile.id,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            profilePhoto: user.userProfile.profilePhoto,
          },
        };

        // Optimistically update messages cache
        if (previousMessages?.data) {
          queryClient.setQueryData(
            chatQueryKeys.messageList(variables.conversationId, 1),
            {
              ...previousMessages,
              data: {
                ...previousMessages.data,
                result: [...previousMessages.data.result, optimisticMessage],
                meta: {
                  ...previousMessages.data.meta,
                  total: previousMessages.data.meta.total + 1,
                },
              },
            }
          );
        }
      }

      return { previousMessages };
    },
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        // Replace optimistic message with real message
        const currentMessages = queryClient.getQueryData<
          ApiResponse<{
            meta: { page: number; limit: number; total: number };
            result: ChatMessage[];
          }>
        >(chatQueryKeys.messageList(variables.conversationId, 1));

        if (currentMessages?.data) {
          // Remove temporary message and add real one
          const filteredMessages = currentMessages.data.result.filter(
            (msg) => !msg.id.startsWith("temp-")
          );
          
          queryClient.setQueryData(
            chatQueryKeys.messageList(variables.conversationId, 1),
            {
              ...currentMessages,
              data: {
                ...currentMessages.data,
                result: [...filteredMessages, response.data],
              },
            }
          );
        }

        // Invalidate media if files were sent
        if (variables.files.length > 0) {
          queryClient.invalidateQueries({
            queryKey: chatQueryKeys.media(variables.conversationId),
          });
        }

        // Invalidate conversations to update last message
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversations(),
        });
      } else {
        toast.error(response.message || "Failed to send message");
      }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatQueryKeys.messageList(variables.conversationId, 1),
          context.previousMessages
        );
      }

      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to send message";
      toast.error(errorMessage);
    },
  });
};

// Create conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationData) =>
      chatService.createConversation(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Conversation created successfully");
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversations(),
        });
      } else {
        toast.error(response.message || "Failed to create conversation");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create conversation";
      toast.error(errorMessage);
    },
  });
};

// Add participants
export const useAddParticipants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      userProfileIds,
    }: {
      conversationId: string;
      userProfileIds: string[];
    }) => chatService.addParticipants(conversationId, userProfileIds),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success("Participants added successfully");
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversationDetail(variables.conversationId),
        });
      } else {
        toast.error(response.message || "Failed to add participants");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to add participants";
      toast.error(errorMessage);
    },
  });
};

// Remove participant
export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      userProfileId,
    }: {
      conversationId: string;
      userProfileId: string;
    }) => chatService.removeParticipant(conversationId, userProfileId),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success("Participant removed successfully");
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversationDetail(variables.conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversations(),
        });
      } else {
        toast.error(response.message || "Failed to remove participant");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to remove participant";
      toast.error(errorMessage);
    },
  });
};

// Edit message
export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => chatService.editMessage(messageId, content),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Message edited successfully");
        // Invalidate messages for the conversation
        if (response.data) {
          queryClient.invalidateQueries({
            queryKey: chatQueryKeys.messages(response.data.conversationId),
          });
        }
      } else {
        toast.error(response.message || "Failed to edit message");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to edit message";
      toast.error(errorMessage);
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => chatService.deleteMessage(messageId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Message deleted successfully");
        // Invalidate messages for the conversation
        if (response.data) {
          queryClient.invalidateQueries({
            queryKey: chatQueryKeys.messages(response.data.conversationId),
          });
        }
      } else {
        toast.error(response.message || "Failed to delete message");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete message";
      toast.error(errorMessage);
    },
  });
};

// Mark conversation as read
export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      chatService.markConversationAsRead(conversationId),
    onSuccess: (response, conversationId) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversations(),
        });
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.conversationDetail(conversationId),
        });
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to mark conversation as read";
      console.error(errorMessage);
    },
  });
};
