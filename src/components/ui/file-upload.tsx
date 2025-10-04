"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface FileUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  label?: string;
  placeholder?: string;
  error?: string;
}

export const FileUpload = ({
  value,
  onChange,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  label,
  placeholder = "Click to select an image",
  error,
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        alert(
          `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
        );
        return;
      }

      onChange(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle existing image URL
  const imageUrl = typeof value === "string" ? value : preview;

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          "border-muted-foreground/25 hover:border-primary/50",
          error && "border-destructive"
        )}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {imageUrl ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <Image
                src={imageUrl}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Click to change image
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              Max size: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
