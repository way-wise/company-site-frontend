"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/context/SocketContext";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessageInputProps {
  conversationId: string;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { socket, isConnected } = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle typing indicator
  useEffect(() => {
    if (!socket || !isConnected) return;

    if (message.trim()) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing:start", { conversationId });
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("typing:stop", { conversationId });
      }, 2000);
    } else if (isTyping) {
      setIsTyping(false);
      socket.emit("typing:stop", { conversationId });
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, conversationId, socket, isConnected, isTyping]);

  const handleSend = () => {
    if (!socket || !isConnected) {
      alert("Not connected to chat server");
      return;
    }

    if (!message.trim()) return;

    // Send message via socket
    socket.emit("message:send", {
      conversationId,
      content: message.trim(),
    });

    // Clear input
    setMessage("");
    setIsTyping(false);
    socket.emit("typing:stop", { conversationId });

    // Focus back on textarea
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border p-4">
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          placeholder="Type a message... (Shift+Enter for new line)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="min-h-[40px] max-h-[120px] resize-none"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || !isConnected}
          size="icon"
          className="h-10 w-10 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {!isConnected && (
        <p className="text-xs text-destructive mt-2">
          Not connected to chat server
        </p>
      )}
    </div>
  );
}
