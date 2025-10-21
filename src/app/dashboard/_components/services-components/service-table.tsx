"use client";

import {
  CreateServiceFormData,
  createServiceSchema,
} from "@/components/modules/admin/serviceValidation";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateService,
  useDeleteService,
  useServices,
} from "@/hooks/useServiceMutations";
import { Service } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UpdateService from "./UpdateService";

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const ServiceTable = () => {
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [updateServiceModalOpen, setUpdateServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceId, setServiceId] = useState<string | undefined>("");

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

  // Get services data using TanStack Query
  const {
    data: servicesData,
    isLoading,
    // error,
    // isError,
    // refetch,
  } = useServices({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search: debouncedSearch,
  });

  // Add Service Form
  const addServiceForm = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
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

  // Custom hooks for mutations
  const createServiceMutation = useCreateService();
  const deleteServiceMutation = useDeleteService();

  // Handle Add Service
  const handleAddService = async (values: CreateServiceFormData) => {
    try {
      await createServiceMutation.mutateAsync(values);
      setAddServiceModalOpen(false);
      addServiceForm.reset();
    } catch {
      // Error is handled by the mutation hook
    }
  };

  // Handle Service Deletion
  const handleDeleteService = async () => {
    if (!serviceId) return;

    try {
      await deleteServiceMutation.mutateAsync(serviceId);
      setDeleteModalOpen(false);
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
      header: "Description",
      accessorKey: "description",
      cell: ({ row }: { row: { original: Service } }) => {
        const description = row.original.description;
        return description && description.length > 50
          ? `${description.substring(0, 50)}...`
          : description || "-";
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: Service } }) =>
        formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Service } }) => {
        const { id } = row.original;

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => {
                  setUpdateServiceModalOpen(true);
                  setSelectedService(row.original);
                }}
              >
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setServiceId(id);
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
        <h1 className="text-2xl font-medium">Services</h1>
        <Button onClick={() => setAddServiceModalOpen(true)}>
          <Plus />
          <span>Add Service</span>
        </Button>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4 pb-6">
          <Input
            type="search"
            placeholder="Search services..."
            className="max-w-xs"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <DataTable
          data={servicesData?.data || []}
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

      {/* Service Creation Modal */}
      <Modal open={addServiceModalOpen} onOpenChange={setAddServiceModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Service</ModalTitle>
          </ModalHeader>
          <Form {...addServiceForm}>
            <form onSubmit={addServiceForm.handleSubmit(handleAddService)}>
              <FormFieldset disabled={createServiceMutation.isPending}>
                <FormField
                  control={addServiceForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Service Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addServiceForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Service Description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 py-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setAddServiceModalOpen(false);
                      addServiceForm.reset();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createServiceMutation.isPending}
                  >
                    Add Service
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      {/* Delete Service Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Service</ModalTitle>
          </ModalHeader>
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(handleDeleteService)}>
              <FormFieldset disabled={deleteServiceMutation.isPending}>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete the
                  service and remove associated data.
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
                    isLoading={deleteServiceMutation.isPending}
                  >
                    Continue
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>

      <UpdateService
        isOpen={updateServiceModalOpen}
        onClose={() => {
          setUpdateServiceModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />
    </>
  );
};

export default ServiceTable;
