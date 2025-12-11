"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import * as React from "react";

interface ImageOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onConfirm: (formattedHtml: string) => void;
  initialAlignment?: Alignment;
  initialWidth?: string;
  initialHeight?: string;
}

type Alignment = "left" | "center" | "right";

export function ImageOptionsDialog({
  isOpen,
  onClose,
  imageUrl,
  onConfirm,
  initialAlignment = "center",
  initialWidth = "",
  initialHeight = "",
}: ImageOptionsDialogProps) {
  const [alignment, setAlignment] = React.useState<Alignment>(initialAlignment);
  const [width, setWidth] = React.useState<string>(initialWidth);
  const [height, setHeight] = React.useState<string>(initialHeight);

  // Reset form when dialog opens with new values
  React.useEffect(() => {
    if (isOpen) {
      setAlignment(initialAlignment);
      setWidth(initialWidth);
      setHeight(initialHeight);
    }
  }, [isOpen, initialAlignment, initialWidth, initialHeight]);

  const handleConfirm = () => {
    let formattedHtml = "";

    // Build style string
    const widthStyle = width ? `width: ${width}px;` : "";
    const heightStyle = height ? `height: ${height}px;` : "";
    const imgStyle = `${widthStyle} ${heightStyle}`.trim();

    // Always wrap images in a div for consistent edit overlay support
    if (alignment === "center") {
      formattedHtml = `<div style="text-align: center;"><img src="${imageUrl}" alt="image" style="${imgStyle}" /></div>`;
    } else {
      // Wrap float images in an inline-block div to support ::after pseudo-elements
      formattedHtml = `<div style="display: inline-block; float: ${alignment}; margin: 10px;"><img src="${imageUrl}" alt="image" style="${imgStyle}" /></div>`;
    }

    onConfirm(formattedHtml);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setAlignment("center");
    setWidth("");
    setHeight("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Image Options</DialogTitle>
          <DialogDescription>
            Configure the alignment and dimensions for your image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Image Preview */}
          <div className="flex justify-center rounded-lg border bg-muted/50 p-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-[200px] max-w-full object-contain"
            />
          </div>

          {/* Alignment Options */}
          <div className="space-y-3">
            <Label className="text-base">Alignment</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["left", "center", "right"] as Alignment[]).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => setAlignment(align)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-sm font-medium transition-all",
                    alignment === align
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  {align === "left" && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
                      <rect
                        x="2"
                        y="3"
                        width="8"
                        height="2"
                        fill="currentColor"
                      />
                      <rect
                        x="2"
                        y="7"
                        width="10"
                        height="2"
                        fill="currentColor"
                      />
                      <rect
                        x="2"
                        y="11"
                        width="6"
                        height="2"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {align === "center" && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
                      <rect
                        x="4"
                        y="3"
                        width="8"
                        height="2"
                        fill="currentColor"
                      />
                      <rect
                        x="3"
                        y="7"
                        width="10"
                        height="2"
                        fill="currentColor"
                      />
                      <rect
                        x="5"
                        y="11"
                        width="6"
                        height="2"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {align === "right" && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
                      <rect
                        x="6"
                        y="3"
                        width="8"
                        height="2"
                        fill="currentColor"
                      />
                      <rect
                        x="4"
                        y="7"
                        width="10"
                        height="2"
                        fill="currentColor"
                      />
                      <rect
                        x="8"
                        y="11"
                        width="6"
                        height="2"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  <span className="capitalize">{align}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                placeholder="Auto"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Auto"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Insert Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
