import { LeaveType, LeaveTypeMeta } from "@/types";

export const LEAVE_TYPE_CONFIG: Record<LeaveType, LeaveTypeMeta> = {
  CASUAL: {
    value: "CASUAL",
    label: "Casual Leave",
    description: "Casual leave for personal work",
    defaultDaysPerYear: 12,
    requiresDocument: false,
    color: "#60A5FA",
  },
  SICK: {
    value: "SICK",
    label: "Sick Leave",
    description: "Sick leave for medical purposes",
    defaultDaysPerYear: 10,
    requiresDocument: false,
    color: "#F87171",
  },
  EMERGENCY: {
    value: "EMERGENCY",
    label: "Emergency Leave",
    description: "Emergency leave for urgent situations",
    defaultDaysPerYear: 0,
    requiresDocument: true,
    color: "#FB923C",
  },
};

export const LEAVE_TYPE_OPTIONS: LeaveTypeMeta[] =
  Object.values(LEAVE_TYPE_CONFIG);
