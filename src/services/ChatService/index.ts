"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  ChatMessage,
  Conversation,
  ConversationsQueryParams,
  CreateConversationData,
} from "@/types";

export const chatService = {
  // Get all conversations for current user
  getConversations: async (
    params: ConversationsQueryParams = {}
  ): Promise<
    ApiResponse<{
      meta: { page: number; limit: number; total: number };
      result: Conversation[];
    }>
  > => {
    const { page = 1, limit = 20, search, type, projectId } = params;
    let url = `/chat/conversations?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }
    if (projectId) {
      url += `&projectId=${encodeURIComponent(projectId)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single conversation by ID
  getConversationById: async (
    conversationId: string
  ): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.get(
      `/chat/conversations/${conversationId}`
    );
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (
    conversationId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<
    ApiResponse<{
      meta: { page: number; limit: number; total: number };
      result: ChatMessage[];
    }>
  > => {
    const { page = 1, limit = 50 } = params;
    const response = await apiClient.get(
      `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Create new conversation (DM or Group)
  createConversation: async (
    data: CreateConversationData
  ): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.post("/chat/conversations", data);
    return response.data;
  },

  // Add participants to a conversation
  addParticipants: async (
    conversationId: string,
    userProfileIds: string[]
  ): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.post(
      `/chat/conversations/${conversationId}/participants`,
      { userProfileIds }
    );
    return response.data;
  },

  // Remove participant from conversation
  removeParticipant: async (
    conversationId: string,
    userId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(
      `/chat/conversations/${conversationId}/participants/${userId}`
    );
    return response.data;
  },

  // Edit message
  editMessage: async (
    messageId: string,
    content: string
  ): Promise<ApiResponse<ChatMessage>> => {
    const response = await apiClient.patch(`/chat/messages/${messageId}`, {
      content,
    });
    return response.data;
  },

  // Delete message
  deleteMessage: async (
    messageId: string
  ): Promise<ApiResponse<ChatMessage>> => {
    const response = await apiClient.delete(`/chat/messages/${messageId}`);
    return response.data;
  },
};
