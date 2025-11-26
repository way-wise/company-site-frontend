"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateOrUpdateProjectNote,
  useProjectNote,
} from "@/hooks/useProjectNoteMutations";
import { Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ProjectNoteSectionProps {
  projectId: string;
}

export function ProjectNoteSection({ projectId }: ProjectNoteSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const { data: note, isLoading } = useProjectNote(projectId);
  const createOrUpdateMutation = useCreateOrUpdateProjectNote();

  useEffect(() => {
    if (note) {
      setContent(note.content || "");
    }
  }, [note]);

  const handleSave = async () => {
    try {
      await createOrUpdateMutation.mutateAsync({
        projectId,
        content,
      });
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleCancel = () => {
    setContent(note?.content || "");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Project notes and documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="text-gray-600 mt-4">Loading notes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Project notes and documentation</CardDescription>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your notes here..."
              className="min-h-[300px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={createOrUpdateMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={createOrUpdateMutation.isPending}
                isLoading={createOrUpdateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {note?.content ? (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {note.content}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No notes yet. Click Edit to add notes.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

