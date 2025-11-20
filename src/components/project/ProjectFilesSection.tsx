"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useDeleteProjectFile,
  useProjectFiles,
  useUploadProjectFile,
} from "@/hooks/useProjectFileMutations";
import { ProjectFile } from "@/types";
import {
  Download,
  Eye,
  File,
  FileImage,
  FileText,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

interface ProjectFilesSectionProps {
  projectId: string;
}

const getFileIcon = (fileType: string, fileName: string) => {
  // Images
  if (fileType.startsWith("image/")) {
    return <FileImage className="h-8 w-8 text-blue-500" />;
  }

  // PDF
  if (fileType.includes("pdf") || fileName.toLowerCase().endsWith(".pdf")) {
    return <FileText className="h-8 w-8 text-red-500" />;
  }

  // Microsoft Word documents
  if (
    fileType.includes("wordprocessingml") ||
    fileType.includes("msword") ||
    fileName.toLowerCase().endsWith(".doc") ||
    fileName.toLowerCase().endsWith(".docx")
  ) {
    return <FileText className="h-8 w-8 text-blue-600" />;
  }

  // Microsoft Excel
  if (
    fileType.includes("spreadsheetml") ||
    fileType.includes("ms-excel") ||
    fileName.toLowerCase().endsWith(".xls") ||
    fileName.toLowerCase().endsWith(".xlsx")
  ) {
    return <FileText className="h-8 w-8 text-green-600" />;
  }

  // Microsoft PowerPoint
  if (
    fileType.includes("presentationml") ||
    fileType.includes("ms-powerpoint") ||
    fileName.toLowerCase().endsWith(".ppt") ||
    fileName.toLowerCase().endsWith(".pptx")
  ) {
    return <FileText className="h-8 w-8 text-orange-600" />;
  }

  // Archives
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("7z") ||
    fileName.toLowerCase().match(/\.(zip|rar|7z|tar|gz)$/)
  ) {
    return <File className="h-8 w-8 text-purple-500" />;
  }

  // Text files
  if (
    fileType.includes("text") ||
    fileType.includes("csv") ||
    fileName.toLowerCase().match(/\.(txt|csv|json|xml)$/)
  ) {
    return <FileText className="h-8 w-8 text-gray-600" />;
  }

  // Default
  return <File className="h-8 w-8 text-gray-500" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getFileTypeLabel = (fileType: string, fileName: string): string => {
  // Images
  if (fileType.startsWith("image/")) {
    return "Image";
  }

  // PDF
  if (fileType.includes("pdf") || fileName.toLowerCase().endsWith(".pdf")) {
    return "PDF";
  }

  // Microsoft Word
  if (
    fileType.includes("wordprocessingml") ||
    fileType.includes("msword") ||
    fileName.toLowerCase().endsWith(".doc") ||
    fileName.toLowerCase().endsWith(".docx")
  ) {
    return "Word";
  }

  // Microsoft Excel
  if (
    fileType.includes("spreadsheetml") ||
    fileType.includes("ms-excel") ||
    fileName.toLowerCase().endsWith(".xls") ||
    fileName.toLowerCase().endsWith(".xlsx")
  ) {
    return "Excel";
  }

  // Microsoft PowerPoint
  if (
    fileType.includes("presentationml") ||
    fileType.includes("ms-powerpoint") ||
    fileName.toLowerCase().endsWith(".ppt") ||
    fileName.toLowerCase().endsWith(".pptx")
  ) {
    return "PowerPoint";
  }

  // Archives
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("7z") ||
    fileName.toLowerCase().match(/\.(zip|rar|7z|tar|gz)$/)
  ) {
    return "Archive";
  }

  // Text files
  if (fileType.includes("text") || fileName.toLowerCase().endsWith(".txt")) {
    return "Text";
  }

  if (fileType.includes("csv") || fileName.toLowerCase().endsWith(".csv")) {
    return "CSV";
  }

  if (fileType.includes("json") || fileName.toLowerCase().endsWith(".json")) {
    return "JSON";
  }

  if (fileType.includes("xml") || fileName.toLowerCase().endsWith(".xml")) {
    return "XML";
  }

  // OpenDocument
  if (fileType.includes("opendocument")) {
    if (fileType.includes("text")) return "ODT";
    if (fileType.includes("spreadsheet")) return "ODS";
    if (fileType.includes("presentation")) return "ODP";
  }

  // Default
  const ext = fileName.split(".").pop()?.toUpperCase() || "File";
  return ext.length <= 4 ? ext : "File";
};

export function ProjectFilesSection({ projectId }: ProjectFilesSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: files, isLoading } = useProjectFiles(projectId);
  const uploadMutation = useUploadProjectFile();
  const deleteMutation = useDeleteProjectFile();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadMutation.mutateAsync({
        projectId,
        file: selectedFile,
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await deleteMutation.mutateAsync({ fileId, projectId });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDownload = (file: ProjectFile) => {
    if (file.fileUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = file.fileUrl;
      link.download = file.fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleView = (file: ProjectFile) => {
    if (file.fileUrl) {
      window.open(file.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files & Documents</CardTitle>
          <CardDescription>
            Project files, images, and documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="text-gray-600 mt-4">Loading files...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Files & Documents</CardTitle>
          <CardDescription>
            Project files, images, and documents
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          <Upload className="h-4 w-4 mr-2" />
          Select File
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.txt,.csv,.zip,.rar,.7z,.json,.xml"
            />

            {selectedFile && (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-gray-600 truncate">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(selectedFile.size)})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  isLoading={uploadMutation.isPending}
                  size="sm"
                >
                  Upload
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Files List */}
        {files && files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file: ProjectFile) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {file.fileType.startsWith("image/") && file.fileUrl ? (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden border">
                      <img
                        src={file.fileUrl}
                        alt={file.fileName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {file.fileType.startsWith("image/") && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          {getFileIcon(file.fileType, file.fileName)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      {getFileIcon(file.fileType, file.fileName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {file.fileName}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                        {getFileTypeLabel(file.fileType, file.fileName)}
                      </span>
                      <span>{formatFileSize(file.fileSize)}</span>
                      <span>
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                      {file.uploader && (
                        <span>Uploaded by {file.uploader.user.name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.fileType.startsWith("image/") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(file)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">DL</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <File className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No files uploaded yet.</p>
            <p className="text-sm mt-1">Select a file above to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
