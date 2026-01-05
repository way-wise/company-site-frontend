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
      projectBudget: 0,
      hourlyRate: 0,
      paidAmount: 0,
      assignedMembers: [],
      projectStatus: "PENDING",
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
      
      form.reset({
        projectName: liveProject.projectName,
        clientName: liveProject.clientName,
        clientLocation: liveProject.clientLocation,
        projectType: liveProject.projectType,
        projectBudget: liveProject.projectBudget || 0,
        hourlyRate: liveProject.hourlyRate || 0,
        paidAmount: liveProject.paidAmount,
        assignedMembers: assignedMembersValue,
        projectStatus: liveProject.projectStatus,
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

      // Build update payload - handle paidAmount based on project type
      const updateData: Record<string, unknown> = {
        projectName: values.projectName || liveProject.projectName,
        clientName: values.clientName || liveProject.clientName,
        clientLocation: values.clientLocation || liveProject.clientLocation,
        projectType: currentProjectType,
        assignedMembers: assignedMembersString,
        projectStatus: values.projectStatus || liveProject.projectStatus,
        nextActions: values.nextActions || liveProject.nextActions || undefined,
      };

      // Add fields based on project type
      if (currentProjectType === "HOURLY") {
        // For HOURLY: include hourlyRate, exclude paidAmount completely
        if (values.hourlyRate !== undefined) {
          updateData.hourlyRate = values.hourlyRate;
        }
        // Explicitly do NOT include paidAmount for HOURLY projects
      } else {
        // For FIXED and other types: include projectBudget and paidAmount (required)
        if (values.projectBudget !== undefined) {
          updateData.projectBudget = values.projectBudget;
        }
        // paidAmount is required for FIXED projects
        updateData.paidAmount = typeof values.paidAmount === "number" ? values.paidAmount : (liveProject.paidAmount ?? 0);
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
                            // Clear the opposite field when switching types
                            if (value === "HOURLY") {
                              form.setValue("projectBudget", undefined);
                            } else {
                              form.setValue("hourlyRate", undefined);
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

                <div className={`grid gap-4 ${projectType === "HOURLY" ? "grid-cols-1" : "grid-cols-2"}`}>
                  {projectType === "HOURLY" ? (
                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
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
                  ) : (
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
                    </>
                  )}
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
