"use client";

import { chatService } from "@/services/ChatService";
import { ConversationsQueryParams, CreateConversationData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => chatService.removeParticipant(conversationId, userId),
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
