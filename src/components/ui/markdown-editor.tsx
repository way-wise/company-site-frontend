"use client";

import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import MDEditor, { ICommand } from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import * as React from "react";
import { toast } from "sonner";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  height?: number;
}

const MarkdownEditor = React.forwardRef<HTMLDivElement, MarkdownEditorProps>(
  (
    {
      value,
      onChange,
      placeholder = "Enter markdown content...",
      disabled = false,
      className,
      height = 400,
    },
    ref
  ) => {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Ensure component is mounted before rendering (avoid hydration issues)
    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Determine the current theme
    const currentTheme = theme === "system" ? systemTheme : theme;
    const colorMode = currentTheme === "dark" ? "dark" : "light";

    const handleChange = (value?: string) => {
      onChange(value || "");
    };

    // Custom image upload command
    const imageUploadCommand: ICommand = {
      name: "upload-image",
      keyCommand: "upload-image",
      buttonProps: { "aria-label": "Upload image" },
      icon: (
        <svg width="12" height="12" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
          />
        </svg>
      ),
      execute: (state, api) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;

          // Validate file type
          const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
          ];
          if (!allowedTypes.includes(file.type)) {
            toast.error(
              "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
            );
            return;
          }

          // Validate file size (max 5MB)
          const maxSize = 5 * 1024 * 1024;
          if (file.size > maxSize) {
            toast.error("File size must be less than 5MB.");
            return;
          }

          const uploadToast = toast.loading("Uploading image...");

          try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await apiClient.post(
              "/blogs/upload-image",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (response.data.success && response.data.data?.url) {
              const imageUrl = response.data.data.url;
              const imageMarkdown = `![image](${imageUrl})`;
              api.replaceSelection(imageMarkdown);
              toast.success("Image uploaded successfully!", {
                id: uploadToast,
              });
            } else {
              toast.error(response.data.message || "Failed to upload image", {
                id: uploadToast,
              });
            }
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to upload image";
            toast.error(errorMessage, { id: uploadToast });
          }
        };

        input.click();
      },
    };

    if (!mounted) {
      // Render a placeholder with similar dimensions during SSR
      return (
        <div
          ref={ref}
          className={cn(
            "border-input rounded-md border bg-transparent",
            className
          )}
          style={{ height: `${height}px` }}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn("markdown-editor-wrapper", className)}
        data-color-mode={colorMode}
      >
        <MDEditor
          value={value}
          onChange={handleChange}
          preview="live"
          height={height}
          textareaProps={{
            placeholder,
            disabled,
          }}
          previewOptions={{
            rehypePlugins: [],
          }}
          commandsFilter={(command) => {
            // Remove fullscreen and default image command
            if (command.name === "fullscreen" || command.name === "image") {
              return false;
            }
            return command;
          }}
          extraCommands={[imageUploadCommand]}
          className={cn(
            "!border-input !rounded-md !shadow-xs",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <style jsx global>{`
          .markdown-editor-wrapper .w-md-editor {
            background-color: transparent;
          }

          .markdown-editor-wrapper .w-md-editor-toolbar {
            background-color: hsl(var(--muted));
            border-bottom: 1px solid hsl(var(--border));
          }

          .markdown-editor-wrapper .w-md-editor-content {
            background-color: hsl(var(--background));
          }

          .markdown-editor-wrapper .w-md-editor-text,
          .markdown-editor-wrapper .w-md-editor-text-pre {
            color: hsl(var(--foreground));
          }

          .markdown-editor-wrapper .w-md-editor-preview {
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
          }

          /* List styles */
          .markdown-editor-wrapper .w-md-editor-preview ul {
            list-style-type: disc;
            padding-left: 2rem;
            margin: 1rem 0;
          }

          .markdown-editor-wrapper .w-md-editor-preview ol {
            list-style-type: decimal;
            padding-left: 2rem;
            margin: 1rem 0;
          }

          .markdown-editor-wrapper .w-md-editor-preview li {
            margin: 0.5rem 0;
          }

          .markdown-editor-wrapper .w-md-editor-preview ul ul,
          .markdown-editor-wrapper .w-md-editor-preview ol ul {
            list-style-type: circle;
          }

          .markdown-editor-wrapper .w-md-editor-preview ul ul ul,
          .markdown-editor-wrapper .w-md-editor-preview ol ul ul {
            list-style-type: square;
          }

          .markdown-editor-wrapper .w-md-editor-toolbar button {
            color: hsl(var(--foreground));
          }

          .markdown-editor-wrapper .w-md-editor-toolbar button:hover {
            background-color: hsl(var(--accent));
          }

          .markdown-editor-wrapper .w-md-editor-toolbar button.active {
            background-color: hsl(var(--accent));
          }

          /* Focus styles */
          .markdown-editor-wrapper .w-md-editor:focus-within {
            outline: none;
            border-color: hsl(var(--ring));
            box-shadow: 0 0 0 3px hsl(var(--ring) / 0.5);
          }

          /* Dark mode specific adjustments */
          [data-color-mode="dark"] .markdown-editor-wrapper .w-md-editor {
            background-color: transparent;
          }

          [data-color-mode="dark"]
            .markdown-editor-wrapper
            .w-md-editor-toolbar {
            background-color: hsl(var(--muted));
          }

          [data-color-mode="dark"]
            .markdown-editor-wrapper
            .w-md-editor-content,
          [data-color-mode="dark"]
            .markdown-editor-wrapper
            .w-md-editor-preview {
            background-color: hsl(var(--background));
          }
        `}</style>
      </div>
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";

export { MarkdownEditor };
