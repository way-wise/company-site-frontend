"use client";

import { ImageOptionsDialog } from "@/components/ui/image-options-dialog";
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
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = React.useState("");
    const [editMode, setEditMode] = React.useState(false);
    const [originalImageHtml, setOriginalImageHtml] = React.useState("");
    const [initialAlignment, setInitialAlignment] = React.useState<
      "left" | "center" | "right"
    >("center");
    const [initialWidth, setInitialWidth] = React.useState("");
    const [initialHeight, setInitialHeight] = React.useState("");
    const editorApiRef = React.useRef<{
      replaceSelection: (text: string) => void;
    } | null>(null);
    const previewRef = React.useRef<HTMLDivElement>(null);

    // Helper function to escape special regex characters
    const escapeRegex = (str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    // Parse image HTML to extract current settings
    const parseImageHtml = (htmlString: string) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const img = doc.querySelector("img");
        const container = doc.querySelector("div");

        if (!img) {
          return null;
        }

        const src = img.getAttribute("src") || "";
        const imgStyle = img.getAttribute("style") || "";

        // Determine alignment
        let alignment: "left" | "center" | "right" = "center";
        if (container) {
          const containerStyle = container.getAttribute("style") || "";
          if (containerStyle.includes("text-align: center")) {
            alignment = "center";
          } else if (containerStyle.includes("float: left")) {
            alignment = "left";
          } else if (containerStyle.includes("float: right")) {
            alignment = "right";
          }
        } else if (imgStyle.includes("float: left")) {
          alignment = "left";
        } else if (imgStyle.includes("float: right")) {
          alignment = "right";
        }

        // Extract width and height with improved regex (supports decimals and case-insensitive)
        const widthMatch = imgStyle.match(/width:\s*(\d+(?:\.\d+)?)px/i);
        const heightMatch = imgStyle.match(/height:\s*(\d+(?:\.\d+)?)px/i);
        const width = widthMatch ? widthMatch[1] : "";
        const height = heightMatch ? heightMatch[1] : "";

        return { src, alignment, width, height };
      } catch (error) {
        return null;
      }
    };

    // Ensure component is mounted before rendering (avoid hydration issues)
    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Attach click handlers to images in preview for editing
    React.useEffect(() => {
      if (!mounted) return;

      const previewPane = document.querySelector(
        ".markdown-editor-wrapper .w-md-editor-preview"
      );
      if (!previewPane) return;

      const handleImageClick = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "IMG") {
          e.preventDefault();
          e.stopPropagation();

          // Get the parent element (might be a div wrapper)
          const parent = target.parentElement;
          let htmlToEdit = "";

          // Check if image is wrapped in a div
          if (parent && parent.tagName === "DIV") {
            htmlToEdit = parent.outerHTML;
          } else {
            htmlToEdit = target.outerHTML;
          }

          // Parse the image HTML to get the image URL
          const parsed = parseImageHtml(htmlToEdit);
          if (parsed) {
            // Find the actual markdown source HTML by searching for the image URL
            const imageUrl = parsed.src;
            const imageRegex = new RegExp(
              `<div[^>]*>\\s*<img[^>]*src="${escapeRegex(
                imageUrl
              )}"[^>]*>\\s*</div>|<img[^>]*src="${escapeRegex(
                imageUrl
              )}"[^>]*>`,
              "gi"
            );
            const match = value.match(imageRegex);
            const actualSourceHtml = match ? match[0] : htmlToEdit;

            setEditMode(true);
            setOriginalImageHtml(actualSourceHtml);
            setUploadedImageUrl(parsed.src);
            setInitialAlignment(parsed.alignment);
            setInitialWidth(parsed.width);
            setInitialHeight(parsed.height);
            setIsDialogOpen(true);
          }
        }
      };

      previewPane.addEventListener("click", handleImageClick);

      return () => {
        previewPane.removeEventListener("click", handleImageClick);
      };
    }, [mounted, value]);

    // Determine the current theme
    const currentTheme = theme === "system" ? systemTheme : theme;
    const colorMode = currentTheme === "dark" ? "dark" : "light";

    const handleChange = (value?: string) => {
      onChange(value || "");
    };

    const handleImageConfirm = (formattedHtml: string) => {
      if (editMode) {
        // Use regex replace instead of string replace for better matching
        const escaped = originalImageHtml.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        const regex = new RegExp(escaped, "g");
        const updatedContent = value.replace(regex, formattedHtml);

        if (updatedContent === value) {
          // Fallback: couldn't find exact match, try finding by URL
          const urlMatch = originalImageHtml.match(/src="([^"]*)"/);
          if (urlMatch) {
            const imageUrl = urlMatch[1];
            const imageRegex = new RegExp(
              `<div[^>]*>\\s*<img[^>]*src="${escapeRegex(
                imageUrl
              )}"[^>]*\\/?\\s*>\\s*</div>|<img[^>]*src="${escapeRegex(
                imageUrl
              )}"[^>]*\\/?>`,
              "gi"
            );
            const finalContent = value.replace(imageRegex, formattedHtml);
            onChange(finalContent);
          } else {
            onChange(updatedContent);
          }
        } else {
          onChange(updatedContent);
        }

        setEditMode(false);
        setOriginalImageHtml("");
      } else {
        // Insert new image at cursor
        if (editorApiRef.current) {
          editorApiRef.current.replaceSelection(formattedHtml);
        }
      }
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
        // Store the API reference for later use
        editorApiRef.current = api;

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
              toast.success("Image uploaded successfully!", {
                id: uploadToast,
              });
              // Open dialog with the uploaded image URL
              setUploadedImageUrl(imageUrl);
              setIsDialogOpen(true);
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
      <>
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

            /* Image edit overlay */
            .markdown-editor-wrapper .w-md-editor-preview img {
              cursor: pointer;
              transition: opacity 0.2s;
            }

            .markdown-editor-wrapper .w-md-editor-preview img:hover {
              opacity: 0.8;
            }

            .markdown-editor-wrapper .w-md-editor-preview div:has(> img) {
              position: relative;
              display: inline-block;
            }

            .markdown-editor-wrapper
              .w-md-editor-preview
              div:has(> img):hover::after {
              content: "✏️ Edit";
              position: absolute;
              top: 8px;
              right: 8px;
              background: rgba(0, 0, 0, 0.75);
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              pointer-events: none;
              z-index: 10;
              backdrop-filter: blur(4px);
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

            /* Task list (checkbox) styles */
            .markdown-editor-wrapper .w-md-editor-preview .task-list-item {
              list-style-type: none;
              position: relative;
              padding-left: 0;
              display: flex;
              align-items: flex-start;
            }

            .markdown-editor-wrapper
              .w-md-editor-preview
              .task-list-item
              input[type="checkbox"] {
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              width: 1.25rem;
              height: 1.25rem;
              border: 2px solid #d1d5db;
              border-radius: 0.25rem;
              margin-right: 0.5rem;
              margin-top: 0.125rem;
              cursor: pointer;
              flex-shrink: 0;
              position: relative;
              background-color: white;
              transition: all 0.2s;
            }

            .markdown-editor-wrapper
              .w-md-editor-preview
              .task-list-item
              input[type="checkbox"]:checked {
              background-color: #22c55e;
              border-color: #22c55e;
            }

            .markdown-editor-wrapper
              .w-md-editor-preview
              .task-list-item
              input[type="checkbox"]:checked::after {
              content: "✓";
              position: absolute;
              color: white;
              font-size: 1rem;
              font-weight: bold;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .markdown-editor-wrapper .w-md-editor-preview .contains-task-list {
              list-style-type: none;
              padding-left: 0;
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

        <ImageOptionsDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditMode(false);
            setOriginalImageHtml("");
          }}
          imageUrl={uploadedImageUrl}
          onConfirm={handleImageConfirm}
          initialAlignment={initialAlignment}
          initialWidth={initialWidth}
          initialHeight={initialHeight}
        />
      </>
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";

export { MarkdownEditor };
