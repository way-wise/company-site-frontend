"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CustomModal as Modal } from "@/components/ui/modal";
import { NewLiveProject, NewHourLog } from "@/types";
import { 
  useHourLogs, 
  useAddHourLog, 
  useUpdateHourLog,
  useDeleteHourLog,
  useUpdateNewLiveProject,
  newLiveProjectQueryKeys 
} from "@/hooks/useNewLiveProjectMutations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface TimesheetModalProps {
  project: NewLiveProject | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdate?: () => Promise<void>;
}

// Helper to get week dates (Monday to Sunday)
const getWeekDates = (date: Date): Date[] => {
  const startOfWeek = new Date(date);
  const dayOfWeek = date.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(date.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDates.push(day);
  }
  return weekDates;
};

// Helper to format date range
const formatWeekRange = (dates: Date[]): string => {
  if (dates.length === 0) return "";
  const start = dates[0];
  const end = dates[dates.length - 1];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[start.getMonth()]} ${start.getDate()} - ${monthNames[end.getMonth()]} ${end.getDate()}`;
};

// Helper to get day name
const getDayName = (date: Date): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

// Helper to check if date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Calculate hours for a specific date range
const calculateHoursForRange = (
  hourLogs: NewHourLog[],
  startDate: Date,
  endDate: Date
): number => {
  return hourLogs
    .filter((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate >= startDate && logDate < endDate;
    })
    .reduce((sum, log) => sum + Number(log.submittedHours), 0);
};

// Format hours to display
const formatHours = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}:00 hrs`;
  return `${h}:${m.toString().padStart(2, "0")} hrs`;
};

// Get all weeks in a month
const getWeeksInMonth = (year: number, month: number): { start: Date; end: Date; weekNum: number }[] => {
  const weeks: { start: Date; end: Date; weekNum: number }[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Find the Monday of the first week
  const currentDate = new Date(firstDay);
  const dayOfWeek = currentDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  currentDate.setDate(currentDate.getDate() - daysToMonday);
  
  let weekNum = 1;
  while (currentDate <= lastDay || weeks.length === 0) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    weeks.push({ start: weekStart, end: weekEnd, weekNum });
    weekNum++;
    currentDate.setDate(currentDate.getDate() + 7);
    
    if (weeks.length > 6) break; // Safety limit
  }
  
  return weeks;
};

// Get month name
const getMonthName = (month: number): string => {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  return monthNames[month];
};

export const TimesheetModal: React.FC<TimesheetModalProps> = ({
  project,
  isOpen,
  onClose,
  onProjectUpdate,
}) => {
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number }>(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  // Time entry form states
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [entryDate, setEntryDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [entryHours, setEntryHours] = useState<string>("");

  // Edit time entry states
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryHours, setEditingEntryHours] = useState<string>("");
  const [editingEntryDate, setEditingEntryDate] = useState<string>("");

  // Payment management states
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [paidHoursInput, setPaidHoursInput] = useState<string>("");
  const [localPaidHours, setLocalPaidHours] = useState<number | null>(null);
  
  // Reset local paid hours when project changes or modal opens
  React.useEffect(() => {
    if (project && isOpen) {
      setLocalPaidHours(Number(project.paidHours || 0));
    }
  }, [project?.id, isOpen]);
  
  // Use local paid hours if set, otherwise use project's paid hours
  const currentPaidHours = localPaidHours !== null ? localPaidHours : Number(project?.paidHours || 0);

  // Mutations and query client
  const queryClient = useQueryClient();
  const addHourLog = useAddHourLog();
  const updateHourLog = useUpdateHourLog();
  const deleteHourLog = useDeleteHourLog();
  const updateProject = useUpdateNewLiveProject();

  // Fetch hour logs for the project
  const { data: hourLogsData, isLoading, refetch: refetchHourLogs } = useHourLogs(
    isOpen && project ? project.id : ""
  );
  const hourLogs = hourLogsData?.data || [];

  // Handle adding time entry
  const handleAddTimeEntry = async () => {
    if (!project || !entryHours.trim() || !entryDate) {
      toast.error("Please enter date and hours");
      return;
    }

    const hours = parseFloat(entryHours);
    if (isNaN(hours) || hours <= 0) {
      toast.error("Please enter valid hours");
      return;
    }

    try {
      await addHourLog.mutateAsync({
        projectId: project.id,
        date: new Date(entryDate).toISOString(),
        submittedHours: hours,
      });
      setEntryHours("");
      setShowAddEntry(false);
      await refetchHourLogs();
      toast.success("Time entry added successfully");
    } catch (error) {
      console.error("Error adding time entry:", error);
    }
  };

  // Handle starting edit of time entry
  const handleStartEditEntry = (log: NewHourLog) => {
    setEditingEntryId(log.id);
    setEditingEntryHours(log.submittedHours.toString());
    setEditingEntryDate(new Date(log.date).toISOString().split("T")[0]);
  };

  // Handle canceling edit of time entry
  const handleCancelEditEntry = () => {
    setEditingEntryId(null);
    setEditingEntryHours("");
    setEditingEntryDate("");
  };

  // Handle updating time entry
  const handleUpdateTimeEntry = async (logId: string) => {
    if (!project || !editingEntryHours.trim() || !editingEntryDate) {
      toast.error("Please enter date and hours");
      return;
    }

    const hours = parseFloat(editingEntryHours);
    if (isNaN(hours) || hours <= 0) {
      toast.error("Please enter valid hours");
      return;
    }

    try {
      await updateHourLog.mutateAsync({
        projectId: project.id,
        hourLogId: logId,
        date: new Date(editingEntryDate).toISOString(),
        submittedHours: hours,
      });
      setEditingEntryId(null);
      setEditingEntryHours("");
      setEditingEntryDate("");
      await refetchHourLogs();
    } catch (error) {
      console.error("Error updating time entry:", error);
    }
  };

  // Handle deleting time entry
  const handleDeleteTimeEntry = async (logId: string) => {
    if (!project) return;

    if (!confirm("Are you sure you want to delete this time entry?")) {
      return;
    }

    try {
      await deleteHourLog.mutateAsync({
        projectId: project.id,
        hourLogId: logId,
      });
      await refetchHourLogs();
    } catch (error) {
      console.error("Error deleting time entry:", error);
    }
  };

  // Handle updating paid hours
  const handleUpdatePaidHours = async () => {
    if (!project || !paidHoursInput.trim()) {
      toast.error("Please enter paid hours");
      return;
    }

    const hours = parseFloat(paidHoursInput);
    if (isNaN(hours) || hours < 0) {
      toast.error("Please enter valid hours");
      return;
    }

    try {
      console.log("Updating paid hours:", { projectId: project.id, paidHours: hours });
      
      const result = await updateProject.mutateAsync({
        projectId: project.id,
        projectData: { paidHours: hours },
      });
      
      console.log("Update result:", result);
      
      // Check if the update was actually successful
      if (!result.success) {
        console.error("Update failed:", result);
        toast.error(result.message || "Failed to update paid hours");
        return;
      }
      
      // Verify the returned data has the updated paidHours
      if (result.data) {
        console.log("Updated project paidHours:", result.data.paidHours);
      }
      
      // Update local state immediately so UI reflects the change
      setLocalPaidHours(hours);
      setShowEditPayment(false);
      setPaidHoursInput("");
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: newLiveProjectQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: newLiveProjectQueryKeys.detail(project.id) });
      // Call parent callback to refresh project data
      if (onProjectUpdate) {
        await onProjectUpdate();
      }
    } catch (error: unknown) {
      console.error("Error updating paid hours:", error);
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      console.error("Error details:", apiError?.response?.data || apiError?.message);
      toast.error(apiError?.response?.data?.message || "Failed to update paid hours");
    }
  };

  // Get current week dates
  const weekDates = useMemo(() => getWeekDates(selectedWeekStart), [selectedWeekStart]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!hourLogs.length) {
      return {
        last24Hours: 0,
        thisWeek: 0,
        lastWeek: 0,
        sinceStart: 0,
        weeklyLimit: project?.weeklyLimit || 0,
      };
    }

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Last 24 hours
    const yesterday = new Date(now);
    yesterday.setHours(now.getHours() - 24, now.getMinutes(), 0, 0);
    const last24Hours = hourLogs
      .filter((log) => new Date(log.date) >= yesterday)
      .reduce((sum, log) => sum + Number(log.submittedHours), 0);

    // This week (Monday to Sunday)
    const thisWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    thisWeekStart.setDate(today.getDate() - daysToMonday);
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 7);
    const thisWeek = calculateHoursForRange(hourLogs, thisWeekStart, thisWeekEnd);

    // Last week
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeek = calculateHoursForRange(hourLogs, lastWeekStart, thisWeekStart);

    // Since start (total)
    const sinceStart = hourLogs.reduce((sum, log) => sum + Number(log.submittedHours), 0);

    return {
      last24Hours,
      thisWeek,
      lastWeek,
      sinceStart,
      weeklyLimit: project?.weeklyLimit || 0,
    };
  }, [hourLogs, project?.weeklyLimit]);

  // Calculate hours per day for the selected week (including individual entries)
  const dailyHours = useMemo(() => {
    return weekDates.map((date) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setDate(date.getDate() + 1);
      endOfDay.setHours(0, 0, 0, 0);

      const hours = calculateHoursForRange(hourLogs, startOfDay, endOfDay);
      
      // Get individual entries for this day
      const entries = hourLogs.filter((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate >= startOfDay && logDate < endOfDay;
      });
      
      return { date, hours, entries };
    });
  }, [weekDates, hourLogs]);

  // Calculate selected week total
  const selectedWeekTotal = useMemo(() => {
    return dailyHours.reduce((sum, day) => sum + day.hours, 0);
  }, [dailyHours]);

  // Calculate payment information using local paid hours for immediate UI update
  const paymentInfo = useMemo(() => {
    if (!project) return { totalEarned: 0, paidAmount: 0, dueAmount: 0, isPaid: false };

    const hourlyRate = project.hourlyRate || 0;
    const totalHours = hourLogs.reduce((sum, log) => sum + Number(log.submittedHours), 0);
    
    const totalEarned = totalHours * hourlyRate;
    const paidAmount = currentPaidHours * hourlyRate;
    const dueAmount = totalEarned - paidAmount;

    return {
      totalEarned,
      paidAmount,
      dueAmount,
      isPaid: dueAmount <= 0,
      totalHours,
      paidHours: currentPaidHours,
      dueHours: totalHours - currentPaidHours,
    };
  }, [project, hourLogs, currentPaidHours]);

  // Week navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    setSelectedWeekStart(monday);
  };

  // Get max hours for the bar chart scale
  const maxHours = useMemo(() => {
    const maxDailyHours = Math.max(...dailyHours.map((d) => d.hours), 1);
    return Math.max(maxDailyHours, 8); // Minimum scale of 8 hours
  }, [dailyHours]);

  // Calculate weekly payment status for selected week
  const getWeekPaymentStatus = () => {
    // For simplicity, we'll consider weeks as paid if the cumulative hours up to that week are covered by paid hours
    const weekEndDate = new Date(selectedWeekStart);
    weekEndDate.setDate(weekEndDate.getDate() + 7);
    
    const hoursUpToWeek = hourLogs
      .filter((log) => new Date(log.date) < weekEndDate)
      .reduce((sum, log) => sum + Number(log.submittedHours), 0);
    
    const paidHours = Number(project?.paidHours || 0);
    
    if (selectedWeekTotal === 0) return "no-hours";
    if (hoursUpToWeek <= paidHours) return "paid";
    return "unpaid";
  };

  const weekPaymentStatus = getWeekPaymentStatus();

  // Month navigation
  const goToPreviousMonth = () => {
    setSelectedMonth((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const goToCurrentMonth = () => {
    const today = new Date();
    setSelectedMonth({ year: today.getFullYear(), month: today.getMonth() });
  };

  // Calculate monthly summary - only hours within the specific month
  const monthlyData = useMemo(() => {
    const hourlyRate = project?.hourlyRate || 0;
    const paidHours = currentPaidHours;
    
    // Get month boundaries
    const monthStart = new Date(selectedMonth.year, selectedMonth.month, 1);
    const monthEnd = new Date(selectedMonth.year, selectedMonth.month + 1, 0, 23, 59, 59);
    
    // Calculate hours only within this month
    const monthHours = hourLogs
      .filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= monthStart && logDate <= monthEnd;
      })
      .reduce((sum, log) => sum + Number(log.submittedHours), 0);
    
    const totalMonthEarned = monthHours * hourlyRate;
    
    // Calculate cumulative hours up to end of this month for payment status
    const hoursUpToMonthEnd = hourLogs
      .filter((log) => new Date(log.date) <= monthEnd)
      .reduce((sum, log) => sum + Number(log.submittedHours), 0);
    
    const hoursBeforeMonth = hourLogs
      .filter((log) => new Date(log.date) < monthStart)
      .reduce((sum, log) => sum + Number(log.submittedHours), 0);
    
    // Determine payment status for this month's hours
    let status: "paid" | "partial" | "unpaid" | "no-hours" = "no-hours";
    if (monthHours === 0) {
      status = "no-hours";
    } else if (hoursUpToMonthEnd <= paidHours) {
      status = "paid";
    } else if (hoursBeforeMonth < paidHours && hoursUpToMonthEnd > paidHours) {
      status = "partial";
    } else if (hoursBeforeMonth >= paidHours) {
      status = "unpaid";
    }
    
    // Calculate paid/unpaid amounts for this month
    const paidHoursForThisMonth = Math.max(0, Math.min(monthHours, paidHours - hoursBeforeMonth));
    const unpaidHoursForThisMonth = monthHours - paidHoursForThisMonth;
    const paidAmountThisMonth = paidHoursForThisMonth * hourlyRate;
    const unpaidAmountThisMonth = unpaidHoursForThisMonth * hourlyRate;
    
    return {
      totalHours: monthHours,
      totalEarned: totalMonthEarned,
      status,
      paidHours: paidHoursForThisMonth,
      unpaidHours: unpaidHoursForThisMonth,
      paidAmount: paidAmountThisMonth,
      unpaidAmount: unpaidAmountThisMonth,
    };
  }, [selectedMonth, hourLogs, project?.hourlyRate, currentPaidHours]);

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Timesheet - ${project.projectName}`}
      className="max-w-4xl max-h-[90vh]"
    >
      <div className="max-h-[calc(90vh-100px)] overflow-y-auto pr-2 space-y-4">
        {/* Summary Cards - Upwork Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="text-xs text-gray-500 mb-1">Last 24 hours</p>
            <p className="text-xl font-bold">{formatHours(stats.last24Hours)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="text-xs text-gray-500 mb-1">This week</p>
            <p className="text-xl font-bold">{formatHours(stats.thisWeek)}</p>
            {stats.weeklyLimit > 0 && (
              <p className="text-xs text-gray-400">of {stats.weeklyLimit} hrs limit</p>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="text-xs text-gray-500 mb-1">Last week</p>
            <p className="text-xl font-bold">{formatHours(stats.lastWeek)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="text-xs text-gray-500 mb-1">Since start</p>
            <p className="text-xl font-bold">{formatHours(stats.sinceStart)}</p>
          </div>
        </div>

        {/* Add Time Entry Section */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Add Time Entry
            </h3>
            {!showAddEntry && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAddEntry(true)}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Hours
              </Button>
            )}
          </div>
          {showAddEntry && (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Hours</label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g., 2.5"
                    value={entryHours}
                    onChange={(e) => setEntryHours(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddEntry(false);
                    setEntryHours("");
                  }}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddTimeEntry}
                  disabled={addHourLog.isPending || !entryHours.trim()}
                  className="h-7 text-xs"
                >
                  {addHourLog.isPending ? "Adding..." : "Add Entry"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg border p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4" />
              Payment Summary
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={paymentInfo.isPaid ? "default" : "destructive"}
                className={paymentInfo.isPaid ? "bg-green-100 text-green-800" : ""}
              >
                {paymentInfo.isPaid ? "All Paid" : "Payment Due"}
              </Badge>
              {!showEditPayment && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditPayment(true);
                    setPaidHoursInput(paymentInfo.paidHours?.toString() || "0");
                  }}
                  className="h-6 w-6 p-0"
                  title="Edit paid hours"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Edit Payment Form */}
          {showEditPayment && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-gray-600 mb-2">
                Update paid hours when client makes a payment:
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter total paid hours"
                  value={paidHoursInput}
                  onChange={(e) => setPaidHoursInput(e.target.value)}
                  className="h-8 text-sm flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEditPayment(false);
                    setPaidHoursInput("");
                  }}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdatePaidHours}
                  disabled={updateProject.isPending}
                  className="h-8 text-xs"
                >
                  {updateProject.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-500">Total Earned</p>
              <p className="text-base font-semibold text-gray-900">
                ${paymentInfo.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-400">{paymentInfo.totalHours?.toFixed(1)} hrs × ${project.hourlyRate}/hr</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Paid</p>
              <p className="text-base font-semibold text-green-600">
                ${paymentInfo.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-400">{paymentInfo.paidHours?.toFixed(1)} hrs paid</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Due</p>
              <p className={`text-base font-semibold ${paymentInfo.dueAmount > 0 ? "text-red-600" : "text-gray-900"}`}>
                ${paymentInfo.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-400">{paymentInfo.dueHours?.toFixed(1)} hrs unpaid</p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            Weekly View
          </Button>
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="flex items-center gap-1"
          >
            <CalendarDays className="h-4 w-4" />
            Monthly Summary
          </Button>
        </div>

        {/* Weekly View */}
        {viewMode === "week" && (
          <div className="bg-white rounded-lg border">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Work Diary
                </h3>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={goToCurrentWeek} className="h-7 text-xs">
                    Today
                  </Button>
                  <Button variant="ghost" size="sm" onClick={goToPreviousWeek} className="h-7 w-7 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-medium min-w-[120px] text-center">
                    {formatWeekRange(weekDates)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={goToNextWeek} className="h-7 w-7 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Week Payment Status */}
            <div className="px-3 py-2 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Week Total:</span>
                <span className="font-semibold text-sm">{formatHours(selectedWeekTotal)}</span>
                {stats.weeklyLimit > 0 && (
                  <span className="text-xs text-gray-400">/ {stats.weeklyLimit} hrs</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {weekPaymentStatus === "paid" && (
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    Paid
                  </Badge>
                )}
                {weekPaymentStatus === "unpaid" && (
                  <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    Unpaid
                  </Badge>
                )}
                {weekPaymentStatus === "no-hours" && (
                  <Badge variant="outline" className="text-gray-500 text-xs">
                    No hours
                  </Badge>
                )}
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="p-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Clock className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-2">
                  {dailyHours.map(({ date, hours, entries }) => {
                    const dayNum = date.getDate();
                    const dayName = getDayName(date);
                    const isCurrentDay = isToday(date);
                    const barWidth = maxHours > 0 ? (hours / maxHours) * 100 : 0;

                    return (
                      <div
                        key={date.toISOString()}
                        className={`group py-1.5 ${isCurrentDay ? "bg-blue-50 -mx-3 px-3 rounded" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-24 flex-shrink-0">
                            <span className={`text-xs ${isCurrentDay ? "font-semibold text-blue-600" : "text-gray-700"}`}>
                              {dayNum} {dayName}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                              {hours > 0 && (
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isCurrentDay ? "bg-green-500" : "bg-green-400"
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                              )}
                            </div>
                          </div>
                          <div className="w-16 text-right">
                            <span className={`text-xs font-medium ${hours > 0 ? "text-gray-900" : "text-gray-400"}`}>
                              {hours > 0 ? `${hours.toFixed(2)} hrs` : "0:00 hrs"}
                            </span>
                          </div>
                          {/* Edit/Delete buttons - visible on hover */}
                          {entries.length > 0 && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {entries.map((entry) => (
                                <div key={entry.id} className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStartEditEntry(entry)}
                                    className="h-5 w-5 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    title="Edit entry"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTimeEntry(entry.id)}
                                    disabled={deleteHourLog.isPending}
                                    className="h-5 w-5 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Delete entry"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Edit mode - inline form */}
                        {entries.some(e => editingEntryId === e.id) && (
                          <div className="ml-24 mt-2 flex items-center gap-2 text-xs bg-white border rounded px-2 py-1">
                            <Input
                              type="date"
                              value={editingEntryDate}
                              onChange={(e) => setEditingEntryDate(e.target.value)}
                              className="h-6 text-xs w-28"
                            />
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              value={editingEntryHours}
                              onChange={(e) => setEditingEntryHours(e.target.value)}
                              className="h-6 text-xs w-16"
                            />
                            <span className="text-gray-500">hrs</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateTimeEntry(editingEntryId!)}
                              disabled={updateHourLog.isPending}
                              className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Save"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEditEntry}
                              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                              title="Cancel"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Monthly Summary View */}
        {viewMode === "month" && (
          <div className="bg-white rounded-lg border">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4" />
                  Monthly Summary
                </h3>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={goToCurrentMonth} className="h-7 text-xs">
                    This Month
                  </Button>
                  <Button variant="ghost" size="sm" onClick={goToPreviousMonth} className="h-7 w-7 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-medium min-w-[100px] text-center">
                    {getMonthName(selectedMonth.month)} {selectedMonth.year}
                  </span>
                  <Button variant="ghost" size="sm" onClick={goToNextMonth} className="h-7 w-7 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Month Summary */}
            <div className="p-4 space-y-4">
              {monthlyData.totalHours === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No hours logged in {getMonthName(selectedMonth.month)} {selectedMonth.year}</p>
                </div>
              ) : (
                <>
                  {/* Total Hours & Earnings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-blue-600 mb-1">Total Hours</p>
                      <p className="text-2xl font-bold text-blue-700">{formatHours(monthlyData.totalHours)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-green-600 mb-1">Total Earned</p>
                      <p className="text-2xl font-bold text-green-700">
                        ${monthlyData.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Payment Status</span>
                      {monthlyData.status === "paid" && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Fully Paid
                        </Badge>
                      )}
                      {monthlyData.status === "partial" && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Partially Paid
                        </Badge>
                      )}
                      {monthlyData.status === "unpaid" && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Unpaid
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded">
                        <span className="text-green-700">Paid</span>
                        <div className="text-right">
                          <span className="font-medium text-green-700">{monthlyData.paidHours.toFixed(1)} hrs</span>
                          <span className="text-green-600 text-xs ml-2">
                            (${monthlyData.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded">
                        <span className="text-red-700">Due</span>
                        <div className="text-right">
                          <span className="font-medium text-red-700">{monthlyData.unpaidHours.toFixed(1)} hrs</span>
                          <span className="text-red-600 text-xs ml-2">
                            (${monthlyData.unpaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t">
          <div>
            <span className="font-medium">Rate:</span> ${project.hourlyRate || 0}/hr
          </div>
          <div>
            <span className="font-medium">Weekly Limit:</span> {project.weeklyLimit || "No limit"} hrs
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TimesheetModal;
