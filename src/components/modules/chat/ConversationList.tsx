"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Conversation } from "@/types";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import ConversationItem from "./ConversationItem";
import CreateConversationModal from "./CreateConversationModal";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading?: boolean;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  isLoading,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();

    // Search in conversation name
    if (conv.name?.toLowerCase().includes(searchLower)) return true;

    // Search in participant names
    return conv.participants.some((p) =>
      p.userProfile.user.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation?.id === conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Conversation Modal */}
      <CreateConversationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
