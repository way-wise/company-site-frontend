"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormFieldset,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useAssignServicesToMilestone } from "@/hooks/useMilestoneMutations";
import { useServices } from "@/hooks/useServiceMutations";
import { Milestone } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const assignServiceSchema = z.object({
  serviceIds: z.array(z.string()).min(1, "Select at least one service"),
});

type AssignServiceFormData = z.infer<typeof assignServiceSchema>;

interface AssignServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
}

export default function AssignServiceModal({
  isOpen,
  onClose,
  milestone,
}: AssignServiceModalProps) {
  const assignServiceMutation = useAssignServicesToMilestone();
  const { data: servicesData } = useServices({
    page: 1,
    limit: 100,
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const form = useForm<AssignServiceFormData>({
    resolver: zodResolver(assignServiceSchema),
    defaultValues: {
      serviceIds: [],
    },
  });

  useEffect(() => {
    if (milestone && isOpen) {
      // Pre-select currently assigned services
      const assignedIds =
        milestone.serviceMilestones?.map((sm) => sm.serviceId) || [];
      setSelectedServices(assignedIds);
      form.setValue("serviceIds", assignedIds);
    }
  }, [milestone, isOpen, form]);

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    let newSelected;
    if (checked) {
      newSelected = [...selectedServices, serviceId];
    } else {
      newSelected = selectedServices.filter((id) => id !== serviceId);
    }
    setSelectedServices(newSelected);
    form.setValue("serviceIds", newSelected);
  };

  const handleSubmit = async (values: AssignServiceFormData) => {
    if (!milestone) return;

    try {
      await assignServiceMutation.mutateAsync({
        milestoneId: milestone.id,
        serviceIds: values.serviceIds,
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleSelectAll = () => {
    if (!servicesData?.data) return;

    const allServiceIds = servicesData.data.map((service) => service.id);
    setSelectedServices(allServiceIds);
    form.setValue("serviceIds", allServiceIds);
  };

  const handleDeselectAll = () => {
    setSelectedServices([]);
    form.setValue("serviceIds", []);
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Assign Services to {milestone?.name}</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldset disabled={assignServiceMutation.isPending}>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </Button>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {servicesData?.data?.map((service) => {
                    const isAssigned = milestone?.serviceMilestones?.some(
                      (sm) => sm.serviceId === service.id
                    );
                    const isSelected = selectedServices.includes(service.id);

                    return (
                      <div
                        key={service.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          id={service.id}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleServiceToggle(service.id, checked as boolean)
                          }
                        />
                        <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name}
                              className="h-6 w-6 object-cover rounded"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-500">
                              {service.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{service.name}</div>
                          {service.description && (
                            <div className="text-sm text-gray-500">
                              {service.description.length > 60
                                ? `${service.description.substring(0, 60)}...`
                                : service.description}
                            </div>
                          )}
                        </div>
                        {isAssigned && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Currently Assigned
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <FormField
                  control={form.control}
                  name="serviceIds"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 py-5">
                <Button type="button" onClick={onClose} variant="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={assignServiceMutation.isPending}
                >
                  Assign Services
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}
