"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/UserContext";
import { useRemoveParticipant } from "@/hooks/useChatMutations";
import { Conversation } from "@/types";
import { Image as ImageIcon, MoreVertical, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ParticipantList from "./ParticipantList";

interface ConversationHeaderProps {
  conversation: Conversation;
  onOpenMedia: () => void;
}

export default function ConversationHeader({
  conversation,
  onOpenMedia,
}: ConversationHeaderProps) {
  const { user } = useAuth();
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
      toast.warning(
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
    // For GROUP/PROJECT chats - show member count
    if (conversation.type !== "DIRECT") {
      return {
        text: `${conversation.participants.length} members`,
      };
    }

    // For DIRECT chats - no status shown (online/offline removed)
    return null;
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
                <p className="text-xs text-muted-foreground">
                  {statusInfo.text}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenMedia}
              aria-label="View shared media"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
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
