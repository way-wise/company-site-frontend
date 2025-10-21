"use client";

import { createTaskSchema } from "@/components/modules/admin/projectValidation";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMilestones } from "@/hooks/useMilestoneMutations";
import { useProjects } from "@/hooks/useProjectMutations";
import { useCreateTask } from "@/hooks/useTaskMutations";
import { useUsers } from "@/hooks/useUserMutations";
import { Milestone, Project, TaskFormData, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  milestoneId?: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  milestoneId,
}: CreateTaskModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projectId || ""
  );
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    milestoneId || ""
  );
  const [projectSearch, setProjectSearch] = useState("");
  const [milestoneSearch, setMilestoneSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Debounced search states
  const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");
  const [debouncedMilestoneSearch, setDebouncedMilestoneSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");

  // Debounce search inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProjectSearch(projectSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [projectSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMilestoneSearch(milestoneSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [milestoneSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUserSearch(userSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch]);

  // Fetch data
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects({
    page: 1,
    limit: 50,
    search: debouncedProjectSearch,
  });

  const { data: milestonesData, isLoading: isMilestonesLoading } =
    useMilestones({
      page: 1,
      limit: 50,
      search: debouncedMilestoneSearch,
      projectId: selectedProjectId,
    });

  const { data: usersData, isLoading: isUsersLoading } = useUsers({
    page: 1,
    limit: 50,
    search: debouncedUserSearch,
  });

  const createTaskMutation = useCreateTask();

  const form = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      milestoneId: milestoneId || "",
      creatorId: "",
      status: "TODO" as const,
      priority: "MEDIUM" as const,
      progress: 0,
      estimatedHours: undefined,
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const initialMilestoneId = milestoneId || "";
      form.reset({
        title: "",
        description: "",
        milestoneId: initialMilestoneId,
        creatorId: undefined,
        status: "TODO",
        priority: "MEDIUM",
        progress: 0,
        estimatedHours: undefined,
      });
      setSelectedProjectId(projectId || "");
      setSelectedMilestoneId(initialMilestoneId);
      setProjectSearch("");
      setMilestoneSearch("");
      setUserSearch("");
    }
  }, [isOpen, form, projectId, milestoneId]);

  // Update milestoneId in form when selectedMilestoneId changes
  useEffect(() => {
    if (selectedMilestoneId) {
      form.setValue("milestoneId", selectedMilestoneId);
    }
  }, [selectedMilestoneId, form]);

  const handleSubmit = async (data: TaskFormData) => {
    console.log("Form data being submitted:", data);
    console.log("Form values:", form.getValues());
    console.log("Selected milestone ID:", selectedMilestoneId);

    // Ensure we have the required fields
    if (!data.title || !data.milestoneId) {
      console.error("Missing required fields:", {
        title: data.title,
        milestoneId: data.milestoneId,
      });
      return;
    }

    // Clean up the data - remove empty strings and convert to proper types
    const cleanedData = {
      ...data,
      creatorId:
        data.creatorId && data.creatorId.trim() !== ""
          ? data.creatorId
          : undefined,
      description:
        data.description && data.description.trim() !== ""
          ? data.description
          : undefined,
      estimatedHours:
        data.estimatedHours && data.estimatedHours > 0
          ? data.estimatedHours
          : undefined,
    };

    console.log("Cleaned data being sent:", cleanedData);

    try {
      await createTaskMutation.mutateAsync(cleanedData);
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProjectId(project.id);
    setSelectedMilestoneId(""); // Reset milestone when project changes
    form.setValue("milestoneId", "");
  };

  const handleMilestoneSelect = (milestone: Milestone) => {
    setSelectedMilestoneId(milestone.id);
    form.setValue("milestoneId", milestone.id);
  };

  const handleCreatorSelect = (user: User) => {
    form.setValue("creatorId", user.id);
  };

  const projects = projectsData?.data?.result || [];
  const milestones = milestonesData?.data?.result || [];
  const users = usersData?.data || [];

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Create New Task</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldset disabled={createTaskMutation.isPending}>
              <div className="space-y-4">
                {/* Project Selection */}
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <Combobox
                      options={projects.map((project) => ({
                        value: project.id,
                        label: project.name,
                        searchText: `${project.name} ${
                          project.description || ""
                        }`,
                      }))}
                      value={selectedProjectId}
                      onValueChange={(value) => {
                        const project = projects.find((p) => p.id === value);
                        if (project) handleProjectSelect(project);
                      }}
                      onSearchChange={setProjectSearch}
                      placeholder="Search and select project..."
                      isLoading={isProjectsLoading}
                    />
                  </FormControl>
                </FormItem>

                {/* Milestone Selection */}
                <FormField
                  control={form.control}
                  name="milestoneId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milestone</FormLabel>
                      <FormControl>
                        <Combobox
                          options={milestones.map((milestone) => ({
                            value: milestone.id,
                            label: milestone.name,
                            searchText: `${milestone.name} ${
                              milestone.description || ""
                            }`,
                          }))}
                          value={field.value || selectedMilestoneId}
                          onValueChange={(value) => {
                            const milestone = milestones.find(
                              (m) => m.id === value
                            );
                            if (milestone) {
                              handleMilestoneSelect(milestone);
                              field.onChange(value);
                            }
                          }}
                          onSearchChange={setMilestoneSearch}
                          placeholder="Search and select milestone..."
                          isLoading={isMilestonesLoading}
                          disabled={!selectedProjectId}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Task Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Task Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter task description..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Creator Selection */}
                <FormField
                  control={form.control}
                  name="creatorId"
                  render={() => (
                    <FormItem>
                      <FormLabel>Creator (Optional)</FormLabel>
                      <FormControl>
                        <Combobox
                          options={users.map((user) => ({
                            value: user.id,
                            label: user.name,
                            searchText: `${user.name} ${user.email}`,
                          }))}
                          value={form.watch("creatorId") || ""}
                          onValueChange={(value) => {
                            const user = users.find((u) => u.id === value);
                            if (user) {
                              handleCreatorSelect(user);
                            } else {
                              form.setValue("creatorId", undefined);
                            }
                          }}
                          onSearchChange={setUserSearch}
                          placeholder="Search and select creator..."
                          isLoading={isUsersLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status and Priority Row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                            <SelectItem value="REVIEW">Review</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="CRITICAL">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Progress and Estimated Hours Row */}
                <div className="grid grid-cols-2 gap-4">
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
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Hours</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 py-5">
                <Button type="button" onClick={onClose} variant="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={createTaskMutation.isPending}
                  disabled={!selectedMilestoneId}
                >
                  Create Task
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}
