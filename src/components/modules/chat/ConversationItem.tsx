"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/UserContext";
import { Conversation } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Users } from "lucide-react";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const { user } = useAuth();

  // Get conversation display name
  const getConversationName = () => {
    if (conversation.name) return conversation.name;

    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants.find(
        (p) => p.userProfileId !== user?.userProfile?.id
      );
      return otherParticipant?.userProfile.user.name || "Unknown User";
    }

    if (conversation.type === "PROJECT" && conversation.project) {
      return conversation.project.name;
    }

    return "Group Chat";
  };

  // Get avatar for the conversation
  const getAvatar = () => {
    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants.find(
        (p) => p.userProfileId !== user?.userProfile?.id
      );
      return {
        image: otherParticipant?.userProfile.profilePhoto,
        fallback: otherParticipant?.userProfile.user.name.charAt(0) || "U",
      };
    }

    return {
      image: undefined,
      fallback: conversation.name?.charAt(0) || "G",
    };
  };

  const avatar = getAvatar();
  const displayName = getConversationName();

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar.image} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {avatar.fallback}
            </AvatarFallback>
          </Avatar>
          {conversation.type === "GROUP" && (
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
              <Users className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          {conversation.type === "PROJECT" && (
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
              <MessageCircle className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-medium truncate">{displayName}</h3>
            {conversation.lastMessage && (
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(
                  new Date(conversation.lastMessage.createdAt),
                  {
                    addSuffix: false,
                  }
                )}
              </span>
            )}
          </div>

          {conversation.lastMessage && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {conversation.lastMessage.isDeleted
                ? "Message deleted"
                : conversation.lastMessage.content}
            </p>
          )}

          {conversation.type !== "DIRECT" && (
            <p className="text-xs text-muted-foreground mt-1">
              {conversation.participants.length} members
            </p>
          )}
        </div>

        {/* Unread badge */}
        {(conversation.unreadCount ?? 0) > 0 && (
          <div className="shrink-0">
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {conversation.unreadCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
