"use client";

import {
  UpdateNewLiveProjectFormData,
  updateNewLiveProjectSchema,
} from "@/components/modules/admin/projectValidation";
import { Button } from "@/components/ui/button";
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
import { CustomModal as Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateNewLiveProject } from "@/hooks/useNewLiveProjectMutations";
import { NewLiveProject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UpdateNewLiveProjectProps {
  isOpen: boolean;
  onClose: () => void;
  project: NewLiveProject | null;
}

const UpdateNewLiveProject = ({
  isOpen,
  onClose,
  project,
}: UpdateNewLiveProjectProps) => {
  const updateProjectMutation = useUpdateNewLiveProject();

  const form = useForm<UpdateNewLiveProjectFormData>({
    resolver: zodResolver(updateNewLiveProjectSchema),
    mode: "onChange",
    defaultValues: {
      projectName: "",
      clientName: "",
      clientLocation: "",
      projectType: "FIXED",
      projectBudget: undefined,
      paidAmount: 0,
      dueAmount: undefined,
      weeklyLimit: undefined,
      hourlyRate: undefined,
      assignedMembers: [],
      projectStatus: "PENDING",
      committedDeadline: undefined,
      targetedDeadline: undefined,
      documents: undefined,
    },
  });

  // Watch project type to show/hide appropriate fields
  const projectType = form.watch("projectType");

  // Update form values when project changes
  useEffect(() => {
    if (project) {
      // Helper to ensure numeric values are numbers
      const ensureNumber = (value: unknown, defaultValue?: number): number | undefined => {
        if (value === null || value === undefined) {
          return defaultValue;
        }
        if (typeof value === "number") {
          return value;
        }
        if (typeof value === "string") {
          const num = parseFloat(value);
          return isNaN(num) ? defaultValue : num;
        }
        return defaultValue;
      };

      // Format deadline for datetime-local input
      const formatDateTimeForInput = (dateString?: string | null) => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      // Normalize targetedDeadline to match schema
      let normalizedTargetedDeadline: { backend?: string; frontend?: string; ui?: string } | undefined = undefined;
      if (project.targetedDeadline) {
        if (typeof project.targetedDeadline === 'object' && project.targetedDeadline !== null) {
          const deadline = project.targetedDeadline as Record<string, unknown>;
          normalizedTargetedDeadline = {
            backend: typeof deadline.backend === 'string' ? deadline.backend : undefined,
            frontend: typeof deadline.frontend === 'string' ? deadline.frontend : undefined,
            ui: typeof deadline.ui === 'string' ? deadline.ui : undefined,
          };
          // Remove if all properties are undefined
          if (!normalizedTargetedDeadline.backend && !normalizedTargetedDeadline.frontend && !normalizedTargetedDeadline.ui) {
            normalizedTargetedDeadline = undefined;
          }
        }
      }

      form.reset({
        projectName: project.projectName || "",
        clientName: project.clientName || "",
        clientLocation: project.clientLocation || "",
        projectType: project.projectType,
        projectBudget: ensureNumber(project.projectBudget),
        paidAmount: ensureNumber(project.paidAmount, 0),
        dueAmount: ensureNumber(project.dueAmount),
        weeklyLimit: ensureNumber(project.weeklyLimit),
        hourlyRate: ensureNumber(project.hourlyRate),
        assignedMembers: Array.isArray(project.assignedMembers)
          ? project.assignedMembers
          : [],
        projectStatus: project.projectStatus,
        committedDeadline: formatDateTimeForInput(project.committedDeadline),
        targetedDeadline: normalizedTargetedDeadline,
        documents: project.documents || undefined,
      });
    }
  }, [project, form]);

  const handleSubmit = async (data: UpdateNewLiveProjectFormData) => {
    console.log("handleSubmit called", { data, project });
    
    if (!project) {
      console.error("No project selected for update");
      return;
    }

    try {
      const payload: Partial<NewLiveProject> = {};

      // Helper to check if a number is valid
      const isValidNumber = (value: unknown): value is number => {
        return typeof value === "number" && !isNaN(value);
      };

      // Always include projectName (required field)
      if (data.projectName) {
        payload.projectName = data.projectName;
      }
      
      // Include optional fields if they have values
      if (data.clientName !== undefined) {
        payload.clientName = data.clientName || null;
      }
      
      if (data.clientLocation !== undefined) {
        payload.clientLocation = data.clientLocation || null;
      }
      
      if (data.projectType) {
        payload.projectType = data.projectType;
      }
      
      if (data.projectStatus) {
        payload.projectStatus = data.projectStatus;
      }
      
      if (data.assignedMembers !== undefined) {
        payload.assignedMembers = data.assignedMembers;
      }

      // Type-specific fields
      if (data.projectType === "FIXED") {
        if (isValidNumber(data.projectBudget)) {
          payload.projectBudget = data.projectBudget;
        }
        if (isValidNumber(data.paidAmount)) {
          payload.paidAmount = data.paidAmount;
        } else if (data.paidAmount !== undefined) {
          payload.paidAmount = 0;
        }
        if (isValidNumber(data.dueAmount)) {
          payload.dueAmount = data.dueAmount;
        }
      } else if (data.projectType === "HOURLY") {
        if (isValidNumber(data.weeklyLimit)) {
          payload.weeklyLimit = data.weeklyLimit;
        }
        if (isValidNumber(data.hourlyRate)) {
          payload.hourlyRate = data.hourlyRate;
        }
      }

      if (data.committedDeadline) {
        // Convert to ISO datetime string
        const deadlineDate = new Date(data.committedDeadline);
        if (!isNaN(deadlineDate.getTime())) {
          payload.committedDeadline = deadlineDate.toISOString();
        }
      }

      if (data.targetedDeadline) {
        payload.targetedDeadline = data.targetedDeadline;
      }

      if (data.documents && data.documents.length > 0) {
        payload.documents = data.documents;
      }

      await updateProjectMutation.mutateAsync({
        projectId: project.id,
        projectData: payload,
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
      // Error is already handled by the mutation hook which shows toast
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update New Live Project">
      <Form {...form}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Form submit event", {
              formState: form.formState,
              errors: form.formState.errors,
              isValid: form.formState.isValid,
            });
            form.handleSubmit(
              (data) => {
                console.log("Validation passed, submitting", data);
                handleSubmit(data);
              },
              (errors) => {
                console.error("Validation failed:", errors);
                // Show first error
                const firstError = Object.values(errors)[0];
                if (firstError?.message) {
                  console.error("First error:", firstError.message);
                }
              }
            )();
          }} 
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter project name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter client name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter client location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Clear related fields when type changes
                    if (value === "FIXED") {
                      form.setValue("weeklyLimit", undefined);
                    } else {
                      form.setValue("projectBudget", undefined);
                      form.setValue("paidAmount", 0);
                      form.setValue("dueAmount", undefined);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIXED">Fixed</SelectItem>
                    <SelectItem value="HOURLY">Hourly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCEL">Cancel</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {projectType === "FIXED" && (
            <FormFieldset>
              <FormField
                control={form.control}
                name="projectBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseFloat(value));
                        }}
                        placeholder="Enter project budget"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paidAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : parseFloat(value));
                        }}
                        placeholder="Enter paid amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseFloat(value));
                        }}
                        placeholder="Enter due amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldset>
          )}

          {projectType === "HOURLY" && (
            <>
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseFloat(value));
                        }}
                        placeholder="Enter hourly rate"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weeklyLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Limit (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseFloat(value));
                        }}
                        placeholder="Enter weekly limit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="assignedMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Members</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const members = value
                        .split(",")
                        .map((m) => m.trim())
                        .filter((m) => m.length > 0);
                      field.onChange(members);
                    }}
                    placeholder="Enter member names (comma-separated)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="committedDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Committed Deadline</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? new Date(value).toISOString() : undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateProjectMutation.isPending}
            >
              {updateProjectMutation.isPending ? "Updating..." : "Update Project"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default UpdateNewLiveProject;
