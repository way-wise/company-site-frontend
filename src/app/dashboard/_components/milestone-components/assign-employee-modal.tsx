"use client";

import { Avatar } from "@/components/ui/avatar";
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
import { useAssignEmployeesToMilestone } from "@/hooks/useMilestoneMutations";
import { useUsers } from "@/hooks/useUserMutations";
import { Milestone } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const assignEmployeeSchema = z.object({
  userProfileIds: z.array(z.string()).min(1, "Select at least one employee"),
});

type AssignEmployeeFormData = z.infer<typeof assignEmployeeSchema>;

interface AssignEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
}

export default function AssignEmployeeModal({
  isOpen,
  onClose,
  milestone,
}: AssignEmployeeModalProps) {
  const assignEmployeeMutation = useAssignEmployeesToMilestone();
  const { data: usersData } = useUsers({
    page: 1,
    limit: 100,
  });

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const form = useForm<AssignEmployeeFormData>({
    resolver: zodResolver(assignEmployeeSchema),
    defaultValues: {
      userProfileIds: [],
    },
  });

  useEffect(() => {
    if (milestone && isOpen) {
      // Pre-select currently assigned employees
      const assignedIds =
        milestone.employeeMilestones?.map((em) => em.userProfileId) || [];
      setSelectedEmployees(assignedIds);
      form.setValue("userProfileIds", assignedIds);
    }
  }, [milestone, isOpen, form]);

  const handleEmployeeToggle = (userProfileId: string, checked: boolean) => {
    let newSelected;
    if (checked) {
      newSelected = [...selectedEmployees, userProfileId];
    } else {
      newSelected = selectedEmployees.filter((id) => id !== userProfileId);
    }
    setSelectedEmployees(newSelected);
    form.setValue("userProfileIds", newSelected);
  };

  const handleSubmit = async (values: AssignEmployeeFormData) => {
    if (!milestone) return;

    try {
      await assignEmployeeMutation.mutateAsync({
        milestoneId: milestone.id,
        userProfileIds: values.userProfileIds,
      });
      onClose();
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const handleSelectAll = () => {
    if (!usersData?.data) return;

    const allUserProfileIds = usersData.data
      .filter((user) => user.userProfile?.id)
      .map((user) => user.userProfile!.id);
    setSelectedEmployees(allUserProfileIds);
    form.setValue("userProfileIds", allUserProfileIds);
  };

  const handleDeselectAll = () => {
    setSelectedEmployees([]);
    form.setValue("userProfileIds", []);
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Assign Employees to {milestone?.name}</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldset disabled={assignEmployeeMutation.isPending}>
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
                  {usersData?.data
                    ?.filter((user) => user.userProfile?.id)
                    .map((user) => {
                      const userProfileId = user.userProfile!.id;
                      const isAssigned = milestone?.employeeMilestones?.some(
                        (em) => em.userProfileId === userProfileId
                      );
                      const isSelected =
                        selectedEmployees.includes(userProfileId);

                      return (
                        <div
                          key={user.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            id={user.id}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleEmployeeToggle(
                                userProfileId,
                                checked as boolean
                              )
                            }
                          />
                          <Avatar className="h-8 w-8">
                            <div className="bg-primary text-primary-foreground text-xs font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
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
                  name="userProfileIds"
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
                  isLoading={assignEmployeeMutation.isPending}
                >
                  Assign Employees
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}
