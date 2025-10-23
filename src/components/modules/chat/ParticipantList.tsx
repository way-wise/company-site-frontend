"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/UserContext";
import { useRemoveParticipant } from "@/hooks/useChatMutations";
import { Conversation } from "@/types";
import { Crown, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";
import AddParticipantsModal from "./AddParticipantsModal";

interface ParticipantListProps {
  conversation: Conversation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ParticipantList({
  conversation,
  open,
  onOpenChange,
}: ParticipantListProps) {
  const { user } = useAuth();
  const removeParticipantMutation = useRemoveParticipant();
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Client-side only rendering to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUserParticipant = conversation.participants.find(
    (p) => p.userProfileId === user?.userProfile?.id
  );

  const isAdmin = currentUserParticipant?.isAdmin || false;

  const handleRemoveParticipant = (userProfileId: string) => {
    if (confirm("Are you sure you want to remove this participant?")) {
      removeParticipantMutation.mutate({
        conversationId: conversation.id,
        userProfileId: userProfileId,
      });
    }
  };

  const handleAddParticipantsClick = () => {
    onOpenChange(false); // Close participant list dialog
    setShowAddModal(true); // Open add participants modal
  };

  // Don't render until mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Participants ({conversation.participants.length})
            </DialogTitle>
            <DialogDescription>
              View and manage conversation participants
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {conversation.participants.map((participant) => {
              const isCurrentUser =
                participant.userProfileId === user?.userProfile?.id;
              const canRemove =
                isAdmin && !isCurrentUser && conversation.type !== "DIRECT";

              return (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={participant.userProfile.profilePhoto} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {participant.userProfile.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {participant.userProfile.user.name}
                          {isCurrentUser && " (You)"}
                        </p>
                        {participant.isAdmin && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {participant.userProfile.user.email}
                      </p>
                    </div>
                  </div>

                  {canRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveParticipant(participant.userProfileId)
                      }
                      disabled={removeParticipantMutation.isPending}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {conversation.type === "GROUP" && isAdmin && (
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddParticipantsClick}
              >
                Add Participants
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Participants Modal - Render outside parent Dialog to avoid nesting */}
      <AddParticipantsModal
        open={showAddModal}
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) {
            // When add modal closes, reopen participant list
            onOpenChange(true);
          }
        }}
        conversationId={conversation.id}
        existingParticipants={conversation.participants}
      />
    </>
  );
}
