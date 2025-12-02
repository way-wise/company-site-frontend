"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  placeholder = "Enter image URL or paste image link",
  className,
}: ImageUploadProps) => {
  const [urlInput, setUrlInput] = useState(value);
  const [isEditing, setIsEditing] = useState(!value);

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

  return (
    <div className={cn("space-y-2", className)}>
      {isEditing || !value ? (
        <div className="space-y-2">
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
        </div>
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

