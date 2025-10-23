"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddParticipants } from "@/hooks/useChatMutations";
import apiClient from "@/lib/axios";
import { ConversationParticipant } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface AddParticipantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  existingParticipants: ConversationParticipant[];
}

export default function AddParticipantsModal({
  open,
  onOpenChange,
  conversationId,
  existingParticipants,
}: AddParticipantsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const addParticipantsMutation = useAddParticipants();

  // Client-side only rendering to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch users for participant selection
  const { data: usersData } = useQuery({
    queryKey: ["users", "all"],
    queryFn: async () => {
      const response = await apiClient.get("/user/all-users?limit=100");
      return response.data;
    },
    enabled: open,
  });

  // Get existing participant user profile IDs
  const existingUserProfileIds = existingParticipants.map(
    (p) => p.userProfileId
  );

  // Filter available users (exclude existing participants)
  const availableUsers =
    usersData?.data?.result?.filter(
      (user: { userProfile?: { id: string } }) =>
        user.userProfile &&
        !existingUserProfileIds.includes(user.userProfile.id)
    ) || [];

  // Filter users based on search query
  const filteredUsers = availableUsers.filter((user: { name: string }) =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      alert("Please select at least one user to add");
      return;
    }

    // Get userProfileIds from selected users
    const userProfileIds = selectedUsers
      .map((userId) => {
        const user = usersData?.data?.result?.find(
          (u: { id: string; userProfile?: { id: string } }) => u.id === userId
        );
        return user?.userProfile?.id;
      })
      .filter(Boolean) as string[];

    if (userProfileIds.length === 0) {
      alert("No valid participants selected. Please try again.");
      return;
    }

    addParticipantsMutation.mutate(
      {
        conversationId,
        userProfileIds,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            onOpenChange(false);
            setSelectedUsers([]);
            setUserSearchQuery("");
          }
        },
      }
    );
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      setUserSearchQuery("");
    }
  }, [open]);

  // Don't render until mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Participants</DialogTitle>
            <DialogDescription>
              Select users to add to this conversation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* User Search */}
            <div className="space-y-2">
              <Label>Select Users to Add</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* User List */}
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {availableUsers.length === 0
                    ? "No users available to add"
                    : "No users found"}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map(
                    (user: {
                      id: string;
                      name: string;
                      email: string;
                      userProfile?: {
                        id: string;
                        profilePhoto?: string;
                      };
                    }) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer"
                        onClick={() => handleToggleUser(user.id)}
                      >
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleToggleUser(user.id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.userProfile?.profilePhoto} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {selectedUsers.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedUsers.length} user(s) selected
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addParticipantsMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                selectedUsers.length === 0 || addParticipantsMutation.isPending
              }
            >
              {addParticipantsMutation.isPending
                ? "Adding..."
                : `Add ${selectedUsers.length} User(s)`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
