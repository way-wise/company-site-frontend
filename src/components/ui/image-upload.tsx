"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ImageUpload = ({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Enter image URL or upload a file",
  className,
}: ImageUploadProps) => {
  const [urlInput, setUrlInput] = useState(value);
  const [isEditing, setIsEditing] = useState(!value);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with external value changes
  useEffect(() => {
    setUrlInput(value);
    setIsEditing(!value);
  }, [value]);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setIsEditing(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    setIsEditing(true);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText && (pastedText.startsWith("http://") || pastedText.startsWith("https://"))) {
      setUrlInput(pastedText);
      setTimeout(() => {
        onChange(pastedText);
        setIsEditing(false);
      }, 100);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.post("/blogs/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success && response.data.data?.url) {
        onChange(response.data.data.url);
        setUrlInput(response.data.data.url);
        setIsEditing(false);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(response.data.message || "Failed to upload image");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload image";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {isEditing || !value ? (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">Enter URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-2">
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={disabled || isUploading}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                variant="outline"
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Supports JPEG, PNG, GIF, WebP (max 5MB)
              </p>
            </div>
            {value && (
              <div className="relative inline-block">
                <Image
                  src={value}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                  onError={() => setIsEditing(true)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="url" className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={disabled || !urlInput.trim()}
                size="sm"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {value && (
              <div className="relative inline-block">
                <Image
                  src={value}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                  onError={() => setIsEditing(true)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-2">
          <div className="relative inline-block">
            <Image
              src={value}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg object-cover"
              onError={() => setIsEditing(true)}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setUrlInput(value);
              setIsEditing(true);
            }}
            disabled={disabled}
          >
            Change Image
          </Button>
        </div>
      )}
    </div>
  );
};
