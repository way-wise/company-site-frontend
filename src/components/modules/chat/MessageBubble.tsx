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
import { ChatAttachment, ChatMessage } from "@/types";
import { format } from "date-fns";
import { Download, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  currentUserProfileId: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
};

export default function MessageBubble({
  message,
  isOwnMessage,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();

  const attachments = useMemo(() => {
    if (!Array.isArray(message.attachments) || message.isDeleted) {
      return [] as ChatAttachment[];
    }

    const typedAttachments = message.attachments as ChatAttachment[];
    return typedAttachments.filter(
      (attachment) =>
        attachment !== null &&
        typeof attachment === "object" &&
        typeof attachment.url === "string"
    );
  }, [message.attachments, message.isDeleted]);

  const imageAttachments = attachments.filter(
    (attachment) => attachment.type === "image"
  );
  const documentAttachments = attachments.filter(
    (attachment) => attachment.type === "document"
  );
  const hasImageAttachments = imageAttachments.length > 0;
  const hasDocumentAttachments = documentAttachments.length > 0;
  const hasMessageContent =
    typeof message.content === "string" &&
    message.content.trim().length > 0;

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
            <div className="flex flex-col gap-2">
              {hasImageAttachments && (
                <div className="grid grid-cols-2 gap-2">
                  {imageAttachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "block overflow-hidden rounded-md border border-border bg-background/40",
                        {
                          "border-primary/40": isOwnMessage
                        }
                      )}
                      aria-label={`View ${attachment.name}`}
                    >
                      <Image
                        src={attachment.url}
                        alt={attachment.name}
                        width={320}
                        height={180}
                        unoptimized
                        className="h-32 w-full object-cover"
                        sizes="(min-width: 768px) 200px, 50vw"
                      />
                    </a>
                  ))}
                </div>
              )}

              {hasDocumentAttachments && (
                <div className="flex flex-col gap-2">
                  {documentAttachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2 text-xs transition hover:bg-background/80",
                        {
                          "border-primary/40 bg-primary-foreground/20 hover:bg-primary-foreground/30":
                            isOwnMessage
                        }
                      )}
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm">
                          {attachment.name}
                        </p>
                        <p className="text-muted-foreground text-[11px] uppercase">
                          {attachment.mimeType} - {formatFileSize(attachment.size)}
                        </p>
                      </div>
                      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              )}

              {hasMessageContent && (
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
