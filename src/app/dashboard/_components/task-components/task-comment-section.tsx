"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAddTaskComment, useTask } from "@/hooks/useTaskMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const addCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type AddCommentFormData = z.infer<typeof addCommentSchema>;

interface TaskCommentSectionProps {
  taskId: string;
}

export default function TaskCommentSection({
  taskId,
}: TaskCommentSectionProps) {
  const { data: taskData, refetch } = useTask(taskId);
  const addCommentMutation = useAddTaskComment();
  const [isAddingComment, setIsAddingComment] = useState(false);

  const task = taskData?.data;

  const form = useForm<AddCommentFormData>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleAddComment = async (values: AddCommentFormData) => {
    try {
      await addCommentMutation.mutateAsync({
        taskId,
        content: values.content,
      });
      form.reset();
      setIsAddingComment(false);
      refetch();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-4">
        {task?.comments && task.comments.length > 0 ? (
          task.comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <div className="bg-primary text-primary-foreground text-xs font-medium">
                    {comment.userProfile?.user?.name?.charAt(0).toUpperCase() ||
                      "?"}
                  </div>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.userProfile?.user?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {isAddingComment ? (
        <Card className="p-4">
          <form
            onSubmit={form.handleSubmit(handleAddComment)}
            className="space-y-4"
          >
            <Textarea
              placeholder="Write a comment..."
              className="min-h-[100px]"
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-600">
                {form.formState.errors.content.message}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingComment(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={addCommentMutation.isPending}
              >
                <Send className="h-4 w-4 mr-1" />
                {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsAddingComment(true)}
          className="w-full"
        >
          Add a comment
        </Button>
      )}
    </div>
  );
}
