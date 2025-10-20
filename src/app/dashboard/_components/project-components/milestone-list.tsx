"use client";

import {
  CreateMilestoneFormData,
  createMilestoneSchema,
} from "@/components/modules/admin/projectValidation";
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
  useDeleteMilestone,
  useMilestones,
} from "@/hooks/useMilestoneMutations";
import { useDeleteTask, useUpdateTask } from "@/hooks/useTaskMutations";
import { formatStatusText, getMilestoneStatusColor } from "@/lib/status-utils";
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
  MoreVertical,
  Plus,
  Settings,
  Target,
  Trash,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AssignEmployeeModal from "../milestone-components/assign-employee-modal";
import AssignServiceModal from "../milestone-components/assign-service-modal";
import MilestoneDetailModal from "../milestone-components/milestone-detail-modal";
import UpdateMilestone from "../milestone-components/UpdateMilestone";
import CreateTaskModal from "../task-components/create-task-modal";
import TaskDetailsModal from "../task-components/task-details-modal";
import UpdateTask from "../task-components/UpdateTask";

interface MilestoneListProps {
  projectId: string;
  name: string;
}

export default function MilestoneList({ projectId, name }: MilestoneListProps) {
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(
    new Set()
  );
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedMilestoneForTask, setSelectedMilestoneForTask] = useState<
    string | null
  >(null);

  // Milestone action modals
  const [viewMilestoneModalOpen, setViewMilestoneModalOpen] = useState(false);
  const [editMilestoneModalOpen, setEditMilestoneModalOpen] = useState(false);
  const [assignEmployeeModalOpen, setAssignEmployeeModalOpen] = useState(false);
  const [assignServiceModalOpen, setAssignServiceModalOpen] = useState(false);
  const [deleteMilestoneModalOpen, setDeleteMilestoneModalOpen] =
    useState(false);

  // Task action modals
  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [viewTaskModalOpen, setViewTaskModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
  const deleteMilestoneMutation = useDeleteMilestone();
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

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

  const handleOpenCreateTaskModal = (milestoneId: string) => {
    setSelectedMilestoneForTask(milestoneId);
    setCreateTaskModalOpen(true);
  };

  const handleCloseCreateTaskModal = () => {
    setCreateTaskModalOpen(false);
    setSelectedMilestoneForTask(null);
  };

  const handleDeleteMilestone = async () => {
    if (!selectedMilestone) return;

    try {
      await deleteMilestoneMutation.mutateAsync(selectedMilestone.id);
      setDeleteMilestoneModalOpen(false);
      setSelectedMilestone(null);
    } catch (error) {
      console.error("Failed to delete milestone:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await deleteTaskMutation.mutateAsync(selectedTask.id);
      setDeleteTaskModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleTaskStatusChange = async (
    task: Task,
    newStatus: "TODO" | "IN_PROGRESS" | "REVIEW" | "BLOCKED" | "DONE"
  ) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        taskData: { status: newStatus },
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };
  console.log("Milestones data");
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

    // Calculate progress based on individual task progress percentages
    const totalProgress = tasks.reduce((sum, task) => {
      // Use the task's progress field if available, otherwise calculate based on status
      if (task.progress !== undefined && task.progress !== null) {
        return sum + task.progress;
      }

      // Fallback to status-based progress
      switch (task.status) {
        case "DONE":
          return sum + 100;
        case "REVIEW":
          return sum + 90;
        case "IN_PROGRESS":
          return sum + 50;
        case "BLOCKED":
          return sum + 25;
        case "TODO":
        default:
          return sum + 0;
      }
    }, 0);

    return Math.round(totalProgress / tasks.length);
  };

  const getProgressBreakdown = (milestone: Milestone) => {
    const tasks = milestone.Task || [];
    return {
      total: tasks.length,
      done: tasks.filter((task) => task.status === "DONE").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      blocked: tasks.filter((task) => task.status === "BLOCKED").length,
      review: tasks.filter((task) => task.status === "REVIEW").length,
      todo: tasks.filter((task) => task.status === "TODO").length,
    };
  };

  return (
    <div className="space-y-6 ">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Project Milestones
              </h2>
              <p className="text-blue-600 font-medium">
                {(milestones as any)?.length || 0} milestones • Track your
                project progress
              </p>
            </div>
          </div>
          <Button
            onClick={() => setAddMilestoneOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Milestone
          </Button>
        </div>
      </div>

      {(milestones as any)?.length > 0 ? (
        <div className="grid gap-8">
          {(milestones as any)?.map((milestone: any) => {
            const stats = getMilestoneStats(milestone);
            const statusColors = getMilestoneStatusColor(milestone.status);
            const progress = getMilestoneProgress(milestone);
            const isExpanded = expandedMilestones.has(milestone.id);
            const tasks = milestone.Task || [];

            return (
              <div
                key={milestone.id}
                className={`bg-white  rounded-xl border-2 shadow-lg transition-all duration-200 overflow-hidden ${
                  milestone.status === "COMPLETED"
                    ? "border-green-200 hover:border-green-300"
                    : milestone.status === "IN_PROGRESS"
                    ? "border-blue-200 hover:border-blue-300"
                    : milestone.status === "PENDING"
                    ? "border-yellow-200 hover:border-yellow-300"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Milestone Header */}
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1">
                        Milestone {milestones.indexOf(milestone) + 1}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-lg ${
                            milestone.status === "COMPLETED"
                              ? "bg-green-100"
                              : milestone.status === "IN_PROGRESS"
                              ? "bg-blue-100"
                              : milestone.status === "PENDING"
                              ? "bg-yellow-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <Target
                            className={`h-4 w-4 ${
                              milestone.status === "COMPLETED"
                                ? "text-green-600"
                                : milestone.status === "IN_PROGRESS"
                                ? "text-blue-600"
                                : milestone.status === "PENDING"
                                ? "text-yellow-600"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {milestone.name}
                          </h3>
                        </div>
                      </div>
                      {milestone.description && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {milestone.description}
                        </p>
                      )}
                    </div>

                    {/* View and Actions Buttons - Top Right */}
                    <div className="flex items-center gap-2 ml-4">
                      <Badge
                        className={`${statusColors} font-medium px-3 py-2 text-xs capitalize hover:bg-${statusColors}/80`}
                      >
                        {formatStatusText(milestone.status)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMilestone(milestone);
                          setViewMilestoneModalOpen(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMilestone(milestone);
                              setEditMilestoneModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Milestone
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMilestone(milestone);
                              setAssignEmployeeModalOpen(true);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Assign Team
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMilestone(milestone);
                              setAssignServiceModalOpen(true);
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Assign Services
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMilestone(milestone);
                              setDeleteMilestoneModalOpen(true);
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-700 text-sm">
                        Progress
                      </span>
                      <span className="font-bold text-gray-900">
                        {progress}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getProgressBreakdown(milestone).done}/
                      {getProgressBreakdown(milestone).total} tasks
                    </div>
                  </div>

                  <div className="relative mb-3">
                    <Progress
                      value={progress}
                      className={`h-2 transition-all duration-300 ease-out ${
                        progress === 100
                          ? "[&>div]:bg-green-500"
                          : progress >= 75
                          ? "[&>div]:bg-blue-500"
                          : progress >= 50
                          ? "[&>div]:bg-yellow-500"
                          : progress >= 25
                          ? "[&>div]:bg-orange-500"
                          : "[&>div]:bg-red-500"
                      }`}
                    />
                  </div>

                  {/* Team & Services Section */}
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span>{stats.totalTasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>{stats.totalEmployees} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4 text-purple-500" />
                      <span>{stats.totalServices} services</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>
                        {new Date(milestone.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Team Members & Services */}
                  {(milestone.employeeMilestones?.length > 0 ||
                    milestone.serviceMilestones?.length > 0) && (
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {milestone.employeeMilestones &&
                        milestone.employeeMilestones.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-gray-700">
                              Team:
                            </span>
                            <div className="flex items-center gap-1">
                              {milestone.employeeMilestones
                                .slice(0, 3)
                                .map((em: any, index: number) => (
                                  <span
                                    key={index}
                                    className="text-green-600 font-medium"
                                  >
                                    {em.userProfile?.user?.name || "Unknown"}
                                    {index <
                                      milestone.employeeMilestones.slice(0, 3)
                                        .length -
                                        1 && ", "}
                                  </span>
                                ))}
                              {milestone.employeeMilestones.length > 3 && (
                                <span className="text-gray-500">
                                  +{milestone.employeeMilestones.length - 3}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {milestone.serviceMilestones &&
                        milestone.serviceMilestones.length > 0 && (
                          <div className="flex items-center gap-2 flex-1">
                            <Settings className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-gray-700">
                              Services:
                            </span>
                            <div className="flex items-center gap-1">
                              {milestone.serviceMilestones
                                .slice(0, 3)
                                .map((sm: any, index: number) => (
                                  <span
                                    key={index}
                                    className="text-purple-600 font-medium"
                                  >
                                    {sm.service?.name || "Unknown"}
                                    {index <
                                      milestone.serviceMilestones.slice(0, 3)
                                        .length -
                                        1 && ", "}
                                  </span>
                                ))}
                              {milestone.serviceMilestones.length > 3 && (
                                <span className="text-gray-500">
                                  +{milestone.serviceMilestones.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Toggle Tasks Button */}
                      <div className=" flex items-center gap-2 px-4  ">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleOpenCreateTaskModal(milestone.id)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleMilestoneExpansion(milestone.id)}
                          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          {isExpanded
                            ? "Hide Tasks"
                            : `Show ${tasks.length} Tasks`}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expandable Task List */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t">
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between mb-4"></div>

                      {tasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {tasks.map((task: Task) => (
                            <div
                              key={task.id}
                              className={`rounded-lg border-2 hover:shadow-md transition-all duration-200 overflow-hidden ${
                                task.progress === 100
                                  ? "bg-green-50 border-green-200 hover:border-green-300"
                                  : task.progress >= 75
                                  ? "bg-blue-50 border-blue-200 hover:border-blue-300"
                                  : task.progress >= 50
                                  ? "bg-yellow-50 border-yellow-200 hover:border-yellow-300"
                                  : task.progress >= 25
                                  ? "bg-orange-50 border-orange-200 hover:border-orange-300"
                                  : "bg-red-50 border-red-200 hover:border-red-300"
                              }`}
                            >
                              {/* Single Section with Progress-based Background */}
                              <div className="p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div
                                        className={`p-1 rounded-md ${
                                          task.status === "DONE"
                                            ? "bg-green-100"
                                            : task.status === "IN_PROGRESS"
                                            ? "bg-blue-100"
                                            : task.status === "REVIEW"
                                            ? "bg-yellow-100"
                                            : task.status === "BLOCKED"
                                            ? "bg-red-100"
                                            : "bg-gray-100"
                                        }`}
                                      >
                                        <CheckSquare
                                          className={`h-3 w-3 ${
                                            task.status === "DONE"
                                              ? "text-green-600"
                                              : task.status === "IN_PROGRESS"
                                              ? "text-blue-600"
                                              : task.status === "REVIEW"
                                              ? "text-yellow-600"
                                              : task.status === "BLOCKED"
                                              ? "text-red-600"
                                              : "text-gray-600"
                                          }`}
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-semibold text-gray-900 text-sm mb-0.5">
                                          {task.title}
                                        </h5>
                                        <div className="flex items-center gap-1">
                                          <span
                                            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                              task.status === "DONE"
                                                ? "bg-green-100 text-green-700"
                                                : task.status === "IN_PROGRESS"
                                                ? "bg-blue-100 text-blue-700"
                                                : task.status === "REVIEW"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : task.status === "BLOCKED"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                          >
                                            {formatStatusText(task.status)}
                                          </span>
                                          <span
                                            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                              task.priority === "CRITICAL"
                                                ? "bg-red-100 text-red-700"
                                                : task.priority === "HIGH"
                                                ? "bg-orange-100 text-orange-700"
                                                : task.priority === "MEDIUM"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                          >
                                            {task.priority}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions Dropdown */}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-white/50"
                                      >
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-44"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedTask(task);
                                          setViewTaskModalOpen(true);
                                        }}
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedTask(task);
                                          setEditTaskModalOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Task
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedTask(task);
                                          setDeleteTaskModalOpen(true);
                                        }}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                {/* Description */}
                                {task.description && (
                                  <p className="text-xs text-gray-600 mb-2 line-clamp-1 leading-relaxed">
                                    {task.description}
                                  </p>
                                )}

                                {/* Progress Bar */}
                                <div className="mb-2">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="font-medium text-gray-700">
                                      Progress
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {task.progress}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-white/60 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                        task.progress === 100
                                          ? "bg-green-500"
                                          : task.progress >= 75
                                          ? "bg-blue-500"
                                          : task.progress >= 50
                                          ? "bg-yellow-500"
                                          : task.progress >= 25
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{ width: `${task.progress}%` }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Task Info */}
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-3 text-gray-600">
                                    {task.estimatedHours && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span className="font-medium">
                                          {task.estimatedHours}h
                                        </span>
                                      </div>
                                    )}
                                    {task.assignments &&
                                      task.assignments.length > 0 && (
                                        <div className="flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          <span className="font-medium">
                                            {task.assignments.length} assigned
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(
                                      task.createdAt
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                          <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No tasks yet
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Start building your milestone by adding tasks
                          </p>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleOpenCreateTaskModal(milestone.id)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Task
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Target className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No milestones yet
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Milestones help you break down your project into manageable
              phases. Create your first milestone to start tracking progress.
            </p>
            <Button
              onClick={() => setAddMilestoneOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Milestone
            </Button>
          </div>
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
                  <div className="text-sm text-gray-900">
                    {projectId
                      ? `Project Name: ${name}`
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

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={handleCloseCreateTaskModal}
        projectId={projectId}
        milestoneId={selectedMilestoneForTask || undefined}
      />

      {/* Milestone Action Modals */}
      <MilestoneDetailModal
        isOpen={viewMilestoneModalOpen}
        onClose={() => {
          setViewMilestoneModalOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />

      <UpdateMilestone
        isOpen={editMilestoneModalOpen}
        onClose={() => {
          setEditMilestoneModalOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />

      <AssignEmployeeModal
        isOpen={assignEmployeeModalOpen}
        onClose={() => {
          setAssignEmployeeModalOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />

      <AssignServiceModal
        isOpen={assignServiceModalOpen}
        onClose={() => {
          setAssignServiceModalOpen(false);
          setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />

      {/* Delete Milestone Modal */}
      <Modal
        open={deleteMilestoneModalOpen}
        onOpenChange={setDeleteMilestoneModalOpen}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Milestone</ModalTitle>
          </ModalHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this milestone? This action cannot
              be undone. All tasks in this milestone will also be deleted.
            </p>
            {selectedMilestone && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">
                  {selectedMilestone.name}
                </h4>
                {selectedMilestone.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {selectedMilestone.description}
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  <span>Tasks: {selectedMilestone._count?.Task || 0}</span>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteMilestoneModalOpen(false)}
                disabled={deleteMilestoneMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteMilestone}
                isLoading={deleteMilestoneMutation.isPending}
              >
                Delete Milestone
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Delete Task Modal */}
      <Modal open={deleteTaskModalOpen} onOpenChange={setDeleteTaskModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Task</ModalTitle>
          </ModalHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            {selectedTask && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">{selectedTask.title}</h4>
                {selectedTask.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {selectedTask.description}
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  <span>Status: {formatStatusText(selectedTask.status)}</span>
                  <span className="ml-4">
                    Progress: {selectedTask.progress}%
                  </span>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteTaskModalOpen(false)}
                disabled={deleteTaskMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteTask}
                isLoading={deleteTaskMutation.isPending}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Task Action Modals */}
      <TaskDetailsModal
        task={selectedTask}
        open={viewTaskModalOpen}
        onOpenChange={(open) => {
          setViewTaskModalOpen(open);
          if (!open) setSelectedTask(null);
        }}
      />

      <UpdateTask
        isOpen={editTaskModalOpen}
        onClose={() => {
          setEditTaskModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}
