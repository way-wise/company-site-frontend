"use client";

import { cn } from "@/lib/utils";
import MDEditor, { ICommand } from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import * as React from "react";

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

    // Custom commands to remove unwanted toolbar items if needed
    const commands: ICommand[] = [];

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
            // Remove fullscreen command
            if (command.name === "fullscreen") {
              return false;
            }
            return command;
          }}
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
          
          [data-color-mode="dark"] .markdown-editor-wrapper .w-md-editor-toolbar {
            background-color: hsl(var(--muted));
          }
          
          [data-color-mode="dark"] .markdown-editor-wrapper .w-md-editor-content,
          [data-color-mode="dark"] .markdown-editor-wrapper .w-md-editor-preview {
            background-color: hsl(var(--background));
          }
        `}</style>
      </div>
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";

export { MarkdownEditor };


