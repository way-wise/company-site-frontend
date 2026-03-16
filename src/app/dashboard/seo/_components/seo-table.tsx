"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CustomModal as Modal } from "@/components/ui/modal";
import { useSeoSettings, useDeleteSeo } from "@/hooks/useSeoHooks";
import { formatDate } from "@/lib/date-format";
import { SeoSetting } from "@/services/SeoService";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVertical, Plus, Trash, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SeoTable = () => {
  const router = useRouter();
  const deleteSeoMutation = useDeleteSeo();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [seoId, setSeoId] = useState<string | undefined>("");
  const [selectedSeo, setSelectedSeo] = useState<SeoSetting | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: seoData,
    isLoading,
    error,
  } = useSeoSettings({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    searchTerm: debouncedSearch || undefined,
  });

  const handleCreateSeo = () => {
    router.push("/dashboard/seo/create");
  };

  const handleEditSeo = (id: string) => {
    router.push(`/dashboard/seo/${id}/edit`);
  };

  const handleDeleteSeo = async () => {
    if (!seoId) return;

    try {
      await deleteSeoMutation.mutateAsync(seoId);
      setDeleteModalOpen(false);
      setSelectedSeo(null);
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const columns: ColumnDef<SeoSetting>[] = [
    {
      accessorKey: "pageName",
      header: "Page Name",
      cell: ({ row }) => {
        const pageName = row.getValue("pageName") as string;
        return (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{pageName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "pageSlug",
      header: "Page Slug",
      cell: ({ row }) => {
        const slug = row.getValue("pageSlug") as string;
        return (
          <code className="rounded bg-muted px-2 py-1 text-sm">{slug}</code>
        );
      },
    },
    {
      accessorKey: "metaTitle",
      header: "Meta Title",
      cell: ({ row }) => {
        const title = row.getValue("metaTitle") as string;
        return (
          <div className="max-w-[250px] truncate" title={title}>
            {title}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge
            className={
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as string;
        return <span className="text-sm">{formatDate(date)}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const seo = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => seo.id && handleEditSeo(seo.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSeo(seo);
                  setSeoId(seo.id);
                  setDeleteModalOpen(true);
                }}
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">SEO Management</h2>
            <p className="text-gray-600">
              Manage SEO settings for all pages
            </p>
          </div>
          <Button onClick={handleCreateSeo}>
            <Plus className="mr-2 h-4 w-4" />
            Add SEO Setting
          </Button>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Error loading SEO settings</p>
          <p className="text-sm">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO Management</h2>
          <p className="text-gray-600">
            Manage meta titles, descriptions, and other SEO settings for all pages
          </p>
        </div>
        <Button onClick={handleCreateSeo}>
          <Plus className="mr-2 h-4 w-4" />
          Add SEO Setting
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by page name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={seoData?.data || []}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: seoData?.meta?.total || 0,
        }}
        onPaginationChange={(newPagination) => {
          setPagination({
            pageIndex: newPagination.pageIndex,
            pageSize: newPagination.pageSize,
          });
        }}
        isPending={isLoading}
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete SEO Setting"
        isPending={false}
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete this SEO setting? This action cannot
            be undone.
          </p>
          {selectedSeo && (
            <div className="rounded bg-gray-50 p-3">
              <h4 className="font-medium">{selectedSeo.pageName}</h4>
              <p className="text-sm text-gray-600">/{selectedSeo.pageSlug}</p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSeo}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
