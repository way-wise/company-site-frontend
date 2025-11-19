"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useUpdatePartner } from "@/hooks/usePartnerMutations";
import { Partner } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updatePartnerSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  image: z.string().optional(),
  isShow: z.boolean().optional(),
});

type UpdatePartnerFormData = z.infer<typeof updatePartnerSchema>;

interface UpdatePartnerProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
}

const UpdatePartner = ({ isOpen, onClose, partner }: UpdatePartnerProps) => {
  const updatePartnerMutation = useUpdatePartner();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<UpdatePartnerFormData>({
    resolver: zodResolver(updatePartnerSchema),
    defaultValues: {
      name: "",
      image: undefined,
      isShow: true,
    },
  });

  // Update form values when partner changes
  useEffect(() => {
    if (partner) {
      form.reset({
        name: partner.name,
        image: partner.image,
        isShow: partner.isShow,
      });
      setImageFile(null);
    }
  }, [partner, form]);

  const handleSubmit = async (values: UpdatePartnerFormData) => {
    if (!partner?.id) return;

    try {
      await updatePartnerMutation.mutateAsync({
        partnerId: partner.id,
        partnerData: {
          name: values.name,
          image: values.image,
          isShow: values.isShow,
        },
        imageFile: imageFile || undefined,
      });
      onClose();
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const handleClose = () => {
    form.reset();
    setImageFile(null);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Update Partner</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldset disabled={updatePartnerMutation.isPending}>
              <FormField
                control={form.control}
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
                control={form.control}
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
                            field.onChange(partner?.image || undefined);
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
                control={form.control}
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
                <Button type="button" onClick={handleClose} variant="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={updatePartnerMutation.isPending}
                >
                  Update Partner
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default UpdatePartner;

