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
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useAssignEmployeesToTask } from "@/hooks/useTaskMutations";
import { useUsers } from "@/hooks/useUserMutations";
import { Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const assignTaskSchema = z.object({
  userProfileIds: z.array(z.string()).min(1, "Select at least one employee"),
  roles: z.array(z.string()).optional(),
});

type AssignTaskFormData = z.infer<typeof assignTaskSchema>;

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function AssignTaskModal({
  isOpen,
  onClose,
  task,
}: AssignTaskModalProps) {
  const assignTaskMutation = useAssignEmployeesToTask();
  const { data: usersData } = useUsers({
    page: 1,
    limit: 100,
  });

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeRoles, setEmployeeRoles] = useState<Record<string, string>>(
    {}
  );

  const form = useForm<AssignTaskFormData>({
    resolver: zodResolver(assignTaskSchema),
    defaultValues: {
      userProfileIds: [],
      roles: [],
    },
  });

  useEffect(() => {
    if (task && isOpen) {
      // Pre-select currently assigned employees
      const assignedIds =
        task.assignments?.map((assignment) => assignment.userProfileId) || [];
      const roles: Record<string, string> = {};

      task.assignments?.forEach((assignment) => {
        if (assignment.role) {
          roles[assignment.userProfileId] = assignment.role;
        }
      });

      setSelectedEmployees(assignedIds);
      setEmployeeRoles(roles);
      form.setValue("userProfileIds", assignedIds);
      form.setValue(
        "roles",
        assignedIds.map((id) => roles[id] || "")
      );
    }
  }, [task, isOpen, form]);

  const handleEmployeeToggle = (userProfileId: string, checked: boolean) => {
    let newSelected;
    if (checked) {
      newSelected = [...selectedEmployees, userProfileId];
    } else {
      newSelected = selectedEmployees.filter((id) => id !== userProfileId);
      // Remove role when employee is deselected
      const newRoles = { ...employeeRoles };
      delete newRoles[userProfileId];
      setEmployeeRoles(newRoles);
    }
    setSelectedEmployees(newSelected);
    form.setValue("userProfileIds", newSelected);
    form.setValue(
      "roles",
      newSelected.map((id) => employeeRoles[id] || "")
    );
  };

  const handleRoleChange = (userProfileId: string, role: string) => {
    const newRoles = { ...employeeRoles, [userProfileId]: role };
    setEmployeeRoles(newRoles);
    form.setValue(
      "roles",
      selectedEmployees.map((id) => newRoles[id] || "")
    );
  };

  const handleSubmit = async (values: AssignTaskFormData) => {
    if (!task) return;

    try {
      await assignTaskMutation.mutateAsync({
        taskId: task.id,
        userProfileIds: values.userProfileIds,
        roles: values.roles,
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleSelectAll = () => {
    if (!usersData?.data) return;

    const allUserProfileIds = usersData.data.map((user) => user.id);
    setSelectedEmployees(allUserProfileIds);
    form.setValue("userProfileIds", allUserProfileIds);
    form.setValue(
      "roles",
      allUserProfileIds.map(() => "")
    );
  };

  const handleDeselectAll = () => {
    setSelectedEmployees([]);
    setEmployeeRoles({});
    form.setValue("userProfileIds", []);
    form.setValue("roles", []);
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-3xl">
        <ModalHeader>
          <ModalTitle>Assign Employees to {task?.title}</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldset disabled={assignTaskMutation.isPending}>
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
                  {usersData?.data?.map((user) => {
                    const isAssigned = task?.assignments?.some(
                      (assignment) => assignment.userProfileId === user.id
                    );
                    const isSelected = selectedEmployees.includes(user.id);
                    const currentRole = employeeRoles[user.id] || "";

                    return (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          id={user.id}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleEmployeeToggle(user.id, checked as boolean)
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
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Role (optional)"
                              value={currentRole}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                              className="w-32"
                            />
                          </div>
                        )}
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
                <Button type="submit" isLoading={assignTaskMutation.isPending}>
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
