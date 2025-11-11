"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConversationMedia } from "@/hooks/useChatMutations";
import { ConversationMediaItem } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import { Loader2, Paperclip } from "lucide-react";

interface ConversationMediaGalleryProps {
  conversationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const formatUploadedDate = (timestamp: string) => {
  try {
    return format(new Date(timestamp), "MMM d, yyyy");
  } catch {
    return timestamp;
  }
};

const renderImageGrid = (items: ConversationMediaItem[]) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
    {items.map((item) => (
      <a
        key={item.id}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-border/80 bg-background/60 p-2 transition hover:border-primary/60 hover:shadow-sm"
      >
        <div className="overflow-hidden rounded-md border border-border/50">
          <Image
            src={item.url}
            alt={item.name}
            width={400}
            height={240}
            unoptimized
            className="h-36 w-full object-cover"
            sizes="(min-width: 1024px) 200px, (min-width: 768px) 33vw, 50vw"
          />
        </div>
        <div className="mt-2 space-y-1 text-xs">
          <p className="truncate font-medium">{item.name}</p>
          <p className="text-muted-foreground">
            {formatFileSize(item.size)} - {formatUploadedDate(item.uploadedAt)}
          </p>
        </div>
      </a>
    ))}
  </div>
);

const renderDocumentList = (items: ConversationMediaItem[]) => (
  <div className="space-y-2">
    {items.map((item) => (
      <a
        key={item.id}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-md border border-border bg-muted/60 px-3 py-2 text-sm transition hover:bg-muted"
      >
        <Paperclip className="h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            {item.mimeType} - {formatFileSize(item.size)} -{" "}
            {formatUploadedDate(item.uploadedAt)}
          </p>
        </div>
      </a>
    ))}
  </div>
);

export default function ConversationMediaGallery({
  conversationId,
  open,
  onOpenChange,
}: ConversationMediaGalleryProps) {
  const { data, isLoading } = useConversationMedia(conversationId);
  const mediaItems = (data?.data ?? []) as ConversationMediaItem[];
  const images = mediaItems.filter((item) => item.type === "image");
  const documents = mediaItems.filter((item) => item.type === "document");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Conversation Media</DialogTitle>
          <DialogDescription>
            Browse files shared in this conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-muted-foreground">
              <Paperclip className="mb-3 h-6 w-6" />
              <p>No files have been shared yet.</p>
            </div>
          ) : (
            <div className="space-y-6 pb-2">
              {images.length > 0 && (
                <section>
                  <h4 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                    Images
                  </h4>
                  {renderImageGrid(images)}
                </section>
              )}

              {documents.length > 0 && (
                <section>
                  <h4 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                    Documents
                  </h4>
                  {renderDocumentList(documents)}
                </section>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

