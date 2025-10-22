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
  const [showParticipants, setShowParticipants] = useState(false);

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
              {conversation.type !== "DIRECT" && (
                <p className="text-xs text-muted-foreground">
                  {conversation.participants.length} members
                </p>
              )}
              {conversation.type === "PROJECT" && conversation.project && (
                <p className="text-xs text-muted-foreground">Project Chat</p>
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
                    <DropdownMenuItem className="text-destructive">
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
