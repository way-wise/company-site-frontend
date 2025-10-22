"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateConversation } from "@/hooks/useChatMutations";
import apiClient from "@/lib/axios";
import { ConversationType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface CreateConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateConversationModal({
  open,
  onOpenChange,
}: CreateConversationModalProps) {
  const [type, setType] = useState<ConversationType>("DIRECT");
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState("");

  const createConversationMutation = useCreateConversation();

  // Fetch users for participant selection
  const { data: usersData } = useQuery({
    queryKey: ["users", "all"],
    queryFn: async () => {
      const response = await apiClient.get("/user?limit=100");
      return response.data;
    },
    enabled: open,
  });

  // Fetch projects for project chat selection
  const { data: projectsData } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => {
      const response = await apiClient.get("/projects?limit=100");
      return response.data;
    },
    enabled: open && type === "PROJECT",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "DIRECT" && selectedUsers.length !== 1) {
      alert("Please select exactly one user for direct message");
      return;
    }

    if (type === "GROUP" && selectedUsers.length === 0) {
      alert("Please select at least one user for group chat");
      return;
    }

    if (type === "PROJECT" && !selectedProject) {
      alert("Please select a project");
      return;
    }

    // Get userProfileIds from selected users
    const participantIds = selectedUsers
      .map((userId) => {
        const user = usersData?.data?.result?.find(
          (u: { id: string; userProfile?: { id: string } }) => u.id === userId
        );
        return user?.userProfile?.id;
      })
      .filter(Boolean);

    createConversationMutation.mutate(
      {
        type,
        name: type === "GROUP" ? name : undefined,
        projectId: type === "PROJECT" ? selectedProject : undefined,
        participantIds,
      },
      {
        onSuccess: () => {
          // Reset form
          setType("DIRECT");
          setName("");
          setSelectedUsers([]);
          setSelectedProject("");
          onOpenChange(false);
        },
      }
    );
  };

  const toggleUser = (userId: string) => {
    if (type === "DIRECT") {
      setSelectedUsers([userId]);
    } else {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Conversation Type */}
          <div className="space-y-2">
            <Label>Conversation Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as ConversationType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIRECT">Direct Message</SelectItem>
                <SelectItem value="GROUP">Group Chat</SelectItem>
                <SelectItem value="PROJECT">Project Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Group Name (only for GROUP type) */}
          {type === "GROUP" && (
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>
          )}

          {/* Project Selection (only for PROJECT type) */}
          {type === "PROJECT" && (
            <div className="space-y-2">
              <Label>Select Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent>
                  {projectsData?.data?.result?.map(
                    (project: { id: string; name: string }) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* User Selection (for DIRECT and GROUP) */}
          {type !== "PROJECT" && (
            <div className="space-y-2">
              <Label>
                {type === "DIRECT" ? "Select User" : "Select Users"}
              </Label>
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {usersData?.data?.result?.map(
                  (user: { id: string; name: string }) => (
                    <div
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`p-2 cursor-pointer hover:bg-accent transition-colors ${
                        selectedUsers.includes(user.id) ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type={type === "DIRECT" ? "radio" : "checkbox"}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => {}}
                          className="pointer-events-none"
                        />
                        <span className="text-sm">{user.name}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createConversationMutation.isPending}
            >
              {createConversationMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
