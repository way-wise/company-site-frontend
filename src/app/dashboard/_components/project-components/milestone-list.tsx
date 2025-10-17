"use client";

import {
  CreateMilestoneFormData,
  createMilestoneSchema,
} from "@/components/modules/admin/projectValidation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateMilestone,
  useMilestones,
} from "@/hooks/useMilestoneMutations";
import {
  formatStatusText,
  getMilestoneStatusColor,
  getTaskStatusColor,
} from "@/lib/status-utils";
import { Milestone, Task } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Plus,
  Settings,
  Target,
  Trash,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface MilestoneListProps {
  projectId: string;
}

export default function MilestoneList({ projectId }: MilestoneListProps) {
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(
    new Set()
  );
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );

  const { data: milestonesData, isLoading } = useMilestones({
    page: 1,
    limit: 100,
    projectId: projectId,
  });

  const milestones = milestonesData?.data?.result || [];

  // Form for creating milestones
  const addMilestoneForm = useForm<CreateMilestoneFormData>({
    resolver: zodResolver(createMilestoneSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "PENDING",
      projectId: projectId,
    },
  });

  const createMilestoneMutation = useCreateMilestone();

  const handleCreateMilestone = async (data: CreateMilestoneFormData) => {
    try {
      await createMilestoneMutation.mutateAsync(data);
      setAddMilestoneOpen(false);
      addMilestoneForm.reset();
    } catch (error) {
      console.error("Error creating milestone:", error);
    }
  };

  const toggleMilestoneExpansion = (milestoneId: string) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(milestoneId)) {
      newExpanded.delete(milestoneId);
    } else {
      newExpanded.add(milestoneId);
    }
    setExpandedMilestones(newExpanded);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading milestones...</div>
        </div>
      </Card>
    );
  }

  const getMilestoneStats = (milestone: Milestone) => {
    const totalTasks = milestone._count?.Task || 0;
    const totalEmployees = milestone._count?.employeeMilestones || 0;
    const totalServices = milestone._count?.serviceMilestones || 0;

    return {
      totalTasks,
      totalEmployees,
      totalServices,
    };
  };

  const getMilestoneProgress = (milestone: Milestone) => {
    const tasks = milestone.Task || [];
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(
      (task) => task.status === "DONE"
    ).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getTaskStatusBadge = (status: string) => {
    const colors = getTaskStatusColor(status);
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors}`}
      >
        {formatStatusText(status)}
      </span>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Project Milestones ({(milestones as any)?.length || 0})
        </h2>
        <Button onClick={() => setAddMilestoneOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Milestone
        </Button>
      </div>

      {(milestones as any)?.length > 0 ? (
        <div className="space-y-4">
          {(milestones as any)?.map((milestone: any) => {
            const stats = getMilestoneStats(milestone);
            const statusColors = getMilestoneStatusColor(milestone.status);
            const progress = getMilestoneProgress(milestone);
            const isExpanded = expandedMilestones.has(milestone.id);
            const tasks = milestone.Task || [];

            return (
              <Card
                key={milestone.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">
                            {milestone.name}
                          </h3>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {milestone.description}
                            </p>
                          )}
                        </div>
                        <Badge className={statusColors}>
                          {formatStatusText(milestone.status)}
                        </Badge>
                      </div>

                      {/* Progress Indicator */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{stats.totalTasks} tasks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{stats.totalEmployees} employees</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Settings className="h-4 w-4" />
                          <span>{stats.totalServices} services</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(milestone.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Team Members */}
                      {milestone.employeeMilestones &&
                        milestone.employeeMilestones.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Team:</span>
                            <div className="flex -space-x-1">
                              {milestone.employeeMilestones
                                .slice(0, 5)
                                .map((em: any, index: number) => (
                                  <Avatar
                                    key={index}
                                    className="h-6 w-6 border-2 border-white"
                                  >
                                    <div className="bg-primary text-primary-foreground text-xs font-medium">
                                      {em.userProfile?.user?.name
                                        ?.charAt(0)
                                        .toUpperCase() || "?"}
                                    </div>
                                  </Avatar>
                                ))}
                              {milestone.employeeMilestones.length > 5 && (
                                <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                  <span className="text-xs text-gray-600">
                                    +{milestone.employeeMilestones.length - 5}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Services */}
                      {milestone.serviceMilestones &&
                        milestone.serviceMilestones.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              Services:
                            </span>
                            <div className="flex gap-1">
                              {milestone.serviceMilestones
                                .slice(0, 3)
                                .map((sm: any, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {sm.service?.name || "Unknown Service"}
                                  </Badge>
                                ))}
                              {milestone.serviceMilestones.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{milestone.serviceMilestones.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMilestoneExpansion(milestone.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-1" />
                        )}
                        {isExpanded ? "Hide" : "Show"} Tasks
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedMilestone(milestone)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Expandable Task List */}
                  {isExpanded && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <CheckSquare className="h-4 w-4" />
                          Tasks ({tasks.length})
                        </h4>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Task
                        </Button>
                      </div>

                      {tasks.length > 0 ? (
                        <div className="space-y-2">
                          {tasks.map((task: Task) => (
                            <div
                              key={task.id}
                              className="p-3 bg-gray-50 rounded-lg border"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-sm">
                                  {task.title}
                                </h5>
                                <div className="flex gap-2">
                                  {getTaskStatusBadge(task.status)}
                                </div>
                              </div>

                              {task.description && (
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                  <span>Progress: {task.progress}%</span>
                                  {task.estimatedHours && (
                                    <span>Est: {task.estimatedHours}h</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(
                                    task.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <CheckSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">
                            No tasks in this milestone yet
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No milestones yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first milestone for this project.
          </p>
          <Button onClick={() => setAddMilestoneOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Create First Milestone
          </Button>
        </div>
      )}

      {/* Add Milestone Modal */}
      <Modal open={addMilestoneOpen} onOpenChange={setAddMilestoneOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Milestone</ModalTitle>
          </ModalHeader>
          <Form {...addMilestoneForm}>
            <form
              onSubmit={addMilestoneForm.handleSubmit(handleCreateMilestone)}
            >
              <FormFieldset disabled={createMilestoneMutation.isPending}>
                <FormField
                  control={addMilestoneForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milestone Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Milestone Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Project Context Display */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Project
                  </div>
                  <div className="text-sm text-gray-900">
                    {projectId
                      ? `Project ID: ${projectId}`
                      : "No project selected"}
                  </div>
                </div>

                <FormField
                  control={addMilestoneForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Milestone Description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addMilestoneForm.control}
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
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            In Progress
                          </SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddMilestoneOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMilestoneMutation.isPending}
                  >
                    {createMilestoneMutation.isPending
                      ? "Creating..."
                      : "Create Milestone"}
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    </Card>
  );
}
