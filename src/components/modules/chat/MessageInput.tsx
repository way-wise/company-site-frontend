"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessageWithAttachments } from "@/hooks/useChatMutations";
import { Loader2, Paperclip, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface MessageInputProps {
  conversationId: string;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]);

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_ATTACHMENTS = 5;

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendMessageMutation = useSendMessageWithAttachments();

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const validFiles: File[] = [];

    files.forEach((file) => {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(
          `${file.name} exceeds the ${MAX_FILE_SIZE_MB}MB attachment limit.`
        );
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const nextFiles = [...selectedFiles];
    let additions = 0;
    let limitHit = false;

    validFiles.forEach((file) => {
      if (nextFiles.length >= MAX_ATTACHMENTS) {
        limitHit = true;
        return;
      }

      const isDuplicate = nextFiles.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified
      );

      if (!isDuplicate) {
        nextFiles.push(file);
        additions += 1;
      }
    });

    if (limitHit) {
      toast.error(`You can attach up to ${MAX_ATTACHMENTS} files per message.`);
    }

    if (additions === 0 && !limitHit) {
      toast.info("Selected files are already attached.");
    }

    setSelectedFiles(nextFiles);
    event.target.value = "";
  };

  const resetComposer = () => {
    setMessage("");
    setSelectedFiles([]);
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (sendMessageMutation.isPending) {
      return;
    }


    const trimmedMessage = message.trim();

    if (selectedFiles.length > 0) {
      sendMessageMutation.mutate(
        {
          conversationId,
          content: trimmedMessage || undefined,
          files: selectedFiles,
        },
        {
          onSuccess: () => {
            resetComposer();
          },
        }
      );
      return;
    }

    if (!trimmedMessage) {
      return;
    }

    // Send message via REST API
    sendMessageMutation.mutate(
      {
        conversationId,
        content: trimmedMessage,
        files: [],
      },
      {
        onSuccess: () => {
          resetComposer();
        },
        onError: (error) => {
          toast.error("Failed to send message");
          console.error("Error sending message:", error);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={handleAttachClick}
            disabled={sendMessageMutation.isPending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            ref={textareaRef}
            placeholder="Type a message... (Shift+Enter for new line)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="min-h-[40px] max-h-[120px] resize-none flex-1"
          />
          <Button
            type="button"
            onClick={handleSend}
            disabled={
              sendMessageMutation.isPending ||
              (selectedFiles.length === 0 && !message.trim())
            }
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center gap-2 rounded-md border border-border bg-muted/60 px-2 py-1 text-xs"
              >
                <Paperclip className="h-3 w-3 shrink-0" />
                <span className="max-w-[140px] truncate">{file.name}</span>
                <span className="text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="ml-1 text-muted-foreground transition hover:text-foreground"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Attach up to {MAX_ATTACHMENTS} files (images or PDFs, max{" "}
          {MAX_FILE_SIZE_MB}MB each).
        </p>
      </div>
    </div>
  );
}
