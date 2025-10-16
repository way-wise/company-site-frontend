"use client";

import {
  UpdateServiceFormData,
  updateServiceSchema,
} from "@/components/modules/admin/serviceValidation";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
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
import { useUpdateService } from "@/hooks/useServiceMutations";
import { Service } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UpdateServiceProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const UpdateService = ({ isOpen, onClose, service }: UpdateServiceProps) => {
  const updateServiceMutation = useUpdateService();

  const form = useForm<UpdateServiceFormData>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
    },
  });

  // Update form values when service changes
  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        image: service.image || "",
        description: service.description || "",
      });
    }
  }, [service, form]);

  const handleSubmit = async (values: UpdateServiceFormData) => {
    if (!service?.id) return;

    try {
      await updateServiceMutation.mutateAsync({
        serviceId: service.id,
        serviceData: values as Partial<Service & { image?: File | string }>,
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Update Service</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldset disabled={updateServiceMutation.isPending}>
              <FormField
                control={form.control}
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
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Service Image"
                        placeholder="Drag & drop an image here, or click to select"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
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
                <Button type="button" onClick={handleClose} variant="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={updateServiceMutation.isPending}
                >
                  Update Service
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default UpdateService;
