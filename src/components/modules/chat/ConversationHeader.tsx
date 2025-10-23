"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/UserContext";
import { useRemoveParticipant } from "@/hooks/useChatMutations";
import { Conversation } from "@/types";
import { MoreVertical, Users } from "lucide-react";
import { useState } from "react";
import ParticipantList from "./ParticipantList";

interface ConversationHeaderProps {
  conversation: Conversation;
}

export default function ConversationHeader({
  conversation,
}: ConversationHeaderProps) {
  const { user } = useAuth();
  const { isUserOnline } = useSocket();
  const removeParticipantMutation = useRemoveParticipant();
  const [showParticipants, setShowParticipants] = useState(false);

  const currentUserParticipant = conversation.participants.find(
    (p) => p.userProfileId === user?.userProfile?.id
  );

  const isOnlyAdmin = () => {
    const adminCount = conversation.participants.filter(
      (p) => p.isAdmin
    ).length;
    return currentUserParticipant?.isAdmin && adminCount === 1;
  };

  const handleLeaveConversation = () => {
    if (isOnlyAdmin()) {
      alert(
        "You cannot leave as you are the only admin. Please assign another admin first."
      );
      return;
    }
    if (confirm("Are you sure you want to leave this conversation?")) {
      removeParticipantMutation.mutate({
        conversationId: conversation.id,
        userProfileId: user?.userProfile?.id || "",
      });
    }
  };

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

  // Get status text to display below conversation name
  const getStatusText = () => {
    // For DIRECT chats - show online/offline status
    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants.find(
        (p) => p.userProfileId !== user?.userProfile?.id
      );

      if (!otherParticipant) return null;

      // Check online status
      const isOnline = isUserOnline(otherParticipant.userProfileId);
      return { text: isOnline ? "online" : "offline", isOnline };
    }

    // For GROUP/PROJECT chats - show member count
    return {
      text: `${conversation.participants.length} members`,
      isOnline: false,
    };
  };

  const statusInfo = getStatusText();

  return (
    <>
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar.image} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {avatar.fallback}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div>
              <h3 className="font-semibold">{displayName}</h3>
              {statusInfo && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  {/* Show online/offline indicator dot for DIRECT chats */}
                  {conversation.type === "DIRECT" && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        statusInfo.text === "online"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                  )}
                  <span>{statusInfo.text}</span>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {conversation.type !== "DIRECT" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowParticipants(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Members
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowParticipants(true)}>
                  View Members
                </DropdownMenuItem>
                {conversation.type !== "DIRECT" &&
                  conversation.type !== "PROJECT" && (
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={handleLeaveConversation}
                      disabled={removeParticipantMutation.isPending}
                    >
                      Leave Conversation
                    </DropdownMenuItem>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Participant List Modal */}
      <ParticipantList
        conversation={conversation}
        open={showParticipants}
        onOpenChange={setShowParticipants}
      />
    </>
  );
}
