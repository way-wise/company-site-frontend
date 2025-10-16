"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useUpdateTaskTimeTracking } from "@/hooks/useTaskMutations";
import { Task } from "@/types";
import { Clock, Pause, Play, Save } from "lucide-react";
import { useState } from "react";

interface TaskTimeTrackerProps {
  task: Task;
}

export default function TaskTimeTracker({ task }: TaskTimeTrackerProps) {
  const updateTimeTrackingMutation = useUpdateTaskTimeTracking();
  const [isEditing, setIsEditing] = useState(false);
  const [spentHours, setSpentHours] = useState(task.spentHours || 0);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const [trackedTime, setTrackedTime] = useState(0);

  const estimatedHours = task.estimatedHours || 0;
  const currentSpentHours = task.spentHours || 0;
  const totalSpentHours = currentSpentHours + trackedTime;

  const progressPercentage =
    estimatedHours > 0
      ? Math.min((totalSpentHours / estimatedHours) * 100, 100)
      : 0;

  const handleStartTracking = () => {
    setIsTracking(true);
    setTrackingStartTime(new Date());
  };

  const handleStopTracking = () => {
    if (trackingStartTime) {
      const elapsedHours =
        (new Date().getTime() - trackingStartTime.getTime()) / (1000 * 60 * 60);
      setTrackedTime((prev) => prev + elapsedHours);
      setIsTracking(false);
      setTrackingStartTime(null);
    }
  };

  const handleSaveTime = async () => {
    try {
      await updateTimeTrackingMutation.mutateAsync({
        taskId: task.id,
        spentHours: Math.round(totalSpentHours * 100) / 100, // Round to 2 decimal places
      });
      setTrackedTime(0);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update time tracking:", error);
    }
  };

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const getTimeStatusColor = () => {
    if (estimatedHours === 0) return "text-gray-500";
    if (totalSpentHours <= estimatedHours * 0.8) return "text-green-600";
    if (totalSpentHours <= estimatedHours) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      {/* Time Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Estimated</span>
          <span className="font-medium">{formatHours(estimatedHours)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Spent</span>
          <span className={`font-medium ${getTimeStatusColor()}`}>
            {formatHours(totalSpentHours)}
          </span>
        </div>
        {estimatedHours > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </div>

      {/* Time Tracking Controls */}
      <div className="space-y-3">
        {isTracking ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <Clock className="h-4 w-4 animate-pulse" />
              Tracking time...
            </div>
            <Button size="sm" variant="outline" onClick={handleStopTracking}>
              <Pause className="h-4 w-4 mr-1" />
              Stop
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartTracking}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-1" />
            Start Timer
          </Button>
        )}

        {/* Manual Time Entry */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">Manual Entry</div>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="number"
                step="0.25"
                min="0"
                placeholder="Hours"
                value={spentHours}
                onChange={(e) => setSpentHours(Number(e.target.value))}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveTime}
                  disabled={updateTimeTrackingMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setSpentHours(currentSpentHours);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Current: {formatHours(currentSpentHours)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>

        {/* Tracking Session Info */}
        {trackedTime > 0 && (
          <Card className="p-3 bg-blue-50">
            <div className="text-sm text-blue-800">
              <div className="font-medium">Current Session</div>
              <div>+{formatHours(trackedTime)}</div>
            </div>
          </Card>
        )}
      </div>

      {/* Time Status */}
      {estimatedHours > 0 && (
        <div className="text-xs text-gray-500">
          {totalSpentHours < estimatedHours ? (
            <span className="text-green-600">
              {formatHours(estimatedHours - totalSpentHours)} remaining
            </span>
          ) : totalSpentHours === estimatedHours ? (
            <span className="text-blue-600">Time target reached</span>
          ) : (
            <span className="text-red-600">
              {formatHours(totalSpentHours - estimatedHours)} over estimate
            </span>
          )}
        </div>
      )}
    </div>
  );
}
