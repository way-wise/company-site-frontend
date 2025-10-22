"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDeleteMessage, useEditMessage } from "@/hooks/useChatMutations";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";
import { format } from "date-fns";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  currentUserProfileId: string;
}

export default function MessageBubble({
  message,
  isOwnMessage,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      editMessageMutation.mutate(
        { messageId: message.id, content: editContent },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(message.id);
    }
  };

  if (isEditing) {
    return (
      <div className={cn("flex gap-3", isOwnMessage && "flex-row-reverse")}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.profilePhoto} />
          <AvatarFallback>{message.sender.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 max-w-md">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            autoFocus
            className="mb-1"
          />
          <div className="flex gap-2 text-xs">
            <button onClick={handleEdit} className="text-primary">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3 group", isOwnMessage && "flex-row-reverse")}>
      {/* Avatar */}
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender.profilePhoto} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {message.sender.user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-1", isOwnMessage && "items-end")}>
        {/* Sender Name & Time */}
        <div
          className={cn(
            "flex items-baseline gap-2 text-xs",
            isOwnMessage && "flex-row-reverse"
          )}
        >
          <span className="font-medium">{message.sender.user.name}</span>
          <span className="text-muted-foreground">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
          {message.isEdited && !message.isDeleted && (
            <span className="text-muted-foreground italic">(edited)</span>
          )}
        </div>

        {/* Message Bubble */}
        <div className="flex items-start gap-2">
          {isOwnMessage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div
            className={cn(
              "rounded-lg px-4 py-2 max-w-md break-words",
              isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted",
              message.isDeleted && "italic opacity-70"
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
