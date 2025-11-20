"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  useCreatePartner,
  useDeletePartner,
  usePartners,
  useTogglePartnerVisibility,
} from "@/hooks/usePartnerMutations";
import { Partner } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UpdatePartner from "./UpdatePartner";

// Validation schemas
const createPartnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  isShow: z.boolean().optional().default(true),
});

type CreatePartnerFormData = {
  name: string;
  image?: string;
  isShow?: boolean;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const PartnersTable = () => {
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addPartnerModalOpen, setAddPartnerModalOpen] = useState(false);
  const [updatePartnerModalOpen, setUpdatePartnerModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerId, setPartnerId] = useState<string | undefined>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Pagination and search states
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  // Get partners data using TanStack Query
  const {
    data: partnersData,
    isLoading,
  } = usePartners({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search: debouncedSearch,
  });

  // Mutations
  const createPartnerMutation = useCreatePartner();
  const deletePartnerMutation = useDeletePartner();
  const toggleVisibilityMutation = useTogglePartnerVisibility();

  // Add Partner Form
  const addPartnerForm = useForm<CreatePartnerFormData>({
    resolver: zodResolver(createPartnerSchema),
    defaultValues: {
      name: "",
      image: undefined,
      isShow: true,
    },
  });

  // Delete Form
  const deleteForm = useForm();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  // Handle Add Partner
  const handleAddPartner = async (values: CreatePartnerFormData) => {
    try {
      await createPartnerMutation.mutateAsync({
        partnerData: {
          name: values.name,
          image: values.image,
          isShow: values.isShow ?? true,
        },
        imageFile: imageFile || undefined,
      });
      setAddPartnerModalOpen(false);
      addPartnerForm.reset();
      setImageFile(null);
    } catch {
      // Error is handled by the mutation hook
    }
  };

  // Handle Partner Deletion
  const handleDeletePartner = async () => {
    if (!partnerId) return;

    try {
      await deletePartnerMutation.mutateAsync(partnerId);
      setDeleteModalOpen(false);
    } catch {
      // Error is handled by the mutation hook
    }
  };

  // Handle Toggle Visibility
  const handleToggleVisibility = async (partner: Partner) => {
    try {
      await toggleVisibilityMutation.mutateAsync({
        partnerId: partner.id,
        isShow: !partner.isShow,
      });
    } catch {
      // Error is handled by the mutation hook
    }
  };

  // Table columns
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Image",
      accessorKey: "image",
      cell: ({ row }: { row: { original: Partner } }) => {
        const image = row.original.image;
        return (
          <div className="flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={row.original.name}
                width={60}
                height={40}
                className="h-10 w-auto object-contain rounded"
              />
            ) : (
              <span className="text-muted-foreground">No image</span>
            )}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "isShow",
      cell: ({ row }: { row: { original: Partner } }) => {
        const partner = row.original;
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={partner.isShow}
              onCheckedChange={() => handleToggleVisibility(partner)}
              disabled={toggleVisibilityMutation.isPending}
            />
            <span className="text-sm text-muted-foreground">
              {partner.isShow ? "Visible" : "Hidden"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: Partner } }) =>
        formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Partner } }) => {
        const { id } = row.original;

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => {
                  setUpdatePartnerModalOpen(true);
                  setSelectedPartner(row.original);
                }}
              >
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setPartnerId(id);
                  setDeleteModalOpen(true);
                }}
              >
                <Trash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Partners</h1>
        <Button onClick={() => setAddPartnerModalOpen(true)}>
          <Plus />
          <span>Add Partner</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <Input
            type="search"
            placeholder="Search partners..."
            className="max-w-xs"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <DataTable
          data={partnersData?.data || []}
          columns={columns}
          isPending={isLoading}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          onPaginationChange={(newPagination) => {
            setPagination({
              pageIndex: newPagination.pageIndex,
              pageSize: newPagination.pageSize,
            });
          }}
        />
      </div>

      {/* Partner Creation Modal */}
      <Modal open={addPartnerModalOpen} onOpenChange={setAddPartnerModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Partner</ModalTitle>
          </ModalHeader>
          <Form {...addPartnerForm}>
            <form onSubmit={addPartnerForm.handleSubmit(handleAddPartner)}>
              <FormFieldset disabled={createPartnerMutation.isPending}>
                <FormField
                  control={addPartnerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Partner Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addPartnerForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={imageFile || field.value || null}
                          onChange={(file) => {
                            setImageFile(file);
                            if (file) {
                              // Create a preview URL for validation
                              const previewUrl = URL.createObjectURL(file);
                              field.onChange(previewUrl);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          accept="image/*"
                          maxSize={10 * 1024 * 1024}
                          label="Partner Logo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addPartnerForm.control}
                  name="isShow"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Show on public page</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setAddPartnerModalOpen(false);
                      addPartnerForm.reset();
                      setImageFile(null);
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createPartnerMutation.isPending}
                  >
                    Add Partner
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Delete Partner Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Partner</ModalTitle>
          </ModalHeader>
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(handleDeletePartner)}>
              <FormFieldset disabled={deletePartnerMutation.isPending}>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete the
                  partner and remove associated data.
                </p>
                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    isLoading={deletePartnerMutation.isPending}
                  >
                    Continue
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      <UpdatePartner
        isOpen={updatePartnerModalOpen}
        onClose={() => {
          setUpdatePartnerModalOpen(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
      />
    </>
  );
};

export default PartnersTable;

