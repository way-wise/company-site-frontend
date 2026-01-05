"use client";

import {
  UpdateLiveProjectFormData,
  updateLiveProjectSchema,
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateLiveProject } from "@/hooks/useLiveProjectMutations";
import { LiveProject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UpdateLiveProjectProps {
  isOpen: boolean;
  onClose: () => void;
  liveProject: LiveProject | null;
}

const UpdateLiveProject = ({
  isOpen,
  onClose,
  liveProject,
}: UpdateLiveProjectProps) => {
  const updateLiveProjectMutation = useUpdateLiveProject();

  const form = useForm<UpdateLiveProjectFormData>({
    resolver: zodResolver(updateLiveProjectSchema),
    defaultValues: {
      projectName: "",
      clientName: "",
      clientLocation: "",
      projectType: "FIXED",
      projectBudget: undefined,
      paidAmount: undefined,
      dueAmount: undefined,
      assignedMembers: [],
      projectStatus: "PENDING",
      deadline: undefined,
      progress: undefined,
      nextActions: "",
    },
  });

  // Watch project type to show/hide appropriate fields
  const projectType = form.watch("projectType");

  // Update form values when live project changes
  useEffect(() => {
    if (liveProject) {
      // Handle assignedMembers - convert to array if it's a string
      let assignedMembersValue: string[] = [];
      const assignedMembers = liveProject.assignedMembers as string[] | string | undefined;
      if (Array.isArray(assignedMembers)) {
        assignedMembersValue = assignedMembers;
      } else if (typeof assignedMembers === "string" && assignedMembers.trim()) {
        assignedMembersValue = assignedMembers
          .split(",")
          .map((m: string) => m.trim())
          .filter((m: string) => m.length > 0);
      }
      
      // Format deadline for date input (YYYY-MM-DD)
      const formatDateForInput = (dateString?: string | null) => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      form.reset({
        projectName: liveProject.projectName,
        clientName: liveProject.clientName,
        clientLocation: liveProject.clientLocation ?? "",
        projectType: liveProject.projectType,
        projectBudget: liveProject.projectBudget ?? undefined,
        paidAmount: liveProject.paidAmount ?? undefined,
        dueAmount: liveProject.dueAmount ?? undefined,
        assignedMembers: assignedMembersValue,
        projectStatus: liveProject.projectStatus,
        deadline: formatDateForInput(liveProject.deadline),
        progress: liveProject.progress ?? undefined,
        nextActions: liveProject.nextActions || "",
      });
    }
  }, [liveProject, form]);

  const handleSubmit = async (values: UpdateLiveProjectFormData) => {
    if (!liveProject?.id) return;

    try {
      // Convert assignedMembers to string (API expects comma-separated string)
      let assignedMembersString: string = "";
      const assignedMembersValue = values.assignedMembers as string[] | string | undefined;
      if (Array.isArray(assignedMembersValue)) {
        assignedMembersString = assignedMembersValue.join(", ");
      } else if (typeof assignedMembersValue === "string") {
        assignedMembersString = assignedMembersValue;
      }

      // Determine the project type (use form value if changed, otherwise use existing)
      const currentProjectType = values.projectType || liveProject.projectType;

      // Build update payload - handle fields based on project type
      const updateData: Record<string, unknown> = {
        projectName: values.projectName || liveProject.projectName,
        clientName: values.clientName || liveProject.clientName,
        clientLocation: values.clientLocation ? values.clientLocation : (liveProject.clientLocation ?? undefined),
        projectType: currentProjectType,
        assignedMembers: assignedMembersString,
        projectStatus: values.projectStatus || liveProject.projectStatus,
        nextActions: values.nextActions || liveProject.nextActions || undefined,
      };

      // Add optional fields
      if (values.deadline) {
        updateData.deadline = values.deadline;
      }
      if (values.progress !== undefined) {
        updateData.progress = values.progress;
      }

      // Add fields based on project type
      if (currentProjectType === "HOURLY") {
        // For HOURLY: exclude budget/paid/due amounts completely
        // No financial fields for HOURLY projects
      } else {
        // For FIXED and other types: include projectBudget, paidAmount, dueAmount
        if (values.projectBudget !== undefined) {
          updateData.projectBudget = values.projectBudget;
        }
        if (values.paidAmount !== undefined) {
          updateData.paidAmount = values.paidAmount;
        }
        if (values.dueAmount !== undefined) {
          updateData.dueAmount = values.dueAmount;
        }
      }

      await updateLiveProjectMutation.mutateAsync({
        liveProjectId: liveProject.id,
        liveProjectData: updateData as Partial<LiveProject>,
      });
      onClose();
    } catch (error: unknown) {
      // Parse validation errors and set them on form fields
      const apiError = error as {
        response?: {
          data?: {
            error?: Array<{
              code: string;
              path: string[];
              message: string;
            }>;
          };
        };
      };

      if (Array.isArray(apiError.response?.data?.error)) {
        const validationErrors = apiError.response.data.error;
        validationErrors.forEach((err) => {
          // Extract field name from path (e.g., ["body", "projectType"] -> "projectType")
          const fieldName = err.path[err.path.length - 1] as keyof UpdateLiveProjectFormData;
          
          // Format the error message to be more user-friendly
          let friendlyMessage = err.message;
          if (err.message.includes("expected one of")) {
            const match = err.message.match(/expected one of "([^"]+)"/);
            if (match) {
              const options = match[1].split("|").map(opt => opt.trim());
              friendlyMessage = `Please select one of: ${options.join(", ")}`;
            }
          }
          
          // Set error on the form field
          form.setError(fieldName, {
            type: "manual",
            message: friendlyMessage,
          });
        });
      }
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Live Project"
      isPending={updateLiveProjectMutation.isPending}
    >
      <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldset disabled={updateLiveProjectMutation.isPending}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Website Redesign Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
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
                          <Input placeholder="New York, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Clear budget/paid/due fields when switching to HOURLY
                            if (value === "HOURLY") {
                              form.setValue("projectBudget", undefined);
                              form.setValue("paidAmount", undefined);
                              form.setValue("dueAmount", undefined);
                              form.clearErrors("projectBudget");
                            }
                          }}
                          value={field.value}
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
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className={`grid gap-4 ${projectType === "HOURLY" ? "grid-cols-1" : "grid-cols-3"}`}>
                  {projectType !== "HOURLY" && (
                    <>
                      <FormField
                        control={form.control}
                        name="projectBudget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Budget</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="50000"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? undefined : parseFloat(value) || undefined);
                                }}
                                value={field.value ?? ""}
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
                                placeholder="0"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? undefined : parseFloat(value) || undefined);
                                }}
                                value={field.value ?? ""}
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
                                placeholder="0"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? undefined : parseFloat(value) || undefined);
                                }}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : parseInt(value) || undefined);
                            }}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="assignedMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Members</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Habib, Arif, Robin"
                          {...field}
                          value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                          onChange={(e) => {
                            const names = e.target.value
                              .split(",")
                              .map((name) => name.trim())
                              .filter((name) => name.length > 0);
                            field.onChange(names);
                          }}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Enter member names separated by commas
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nextActions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Actions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Review design mockups and provide feedback"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 py-5">
                <Button type="button" onClick={handleClose} variant="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={updateLiveProjectMutation.isPending}
                >
                  Update Live Project
                </Button>
              </div>
            </FormFieldset>
        </form>
      </Form>
    </Modal>
  );
};

export default UpdateLiveProject;
