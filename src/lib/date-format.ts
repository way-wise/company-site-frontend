/**
 * Format a date string to a readable format
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) {
    return "N/A";
  }

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    return "Invalid Date";
  }
};

/**
 * Format a date string to include time
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string with time (e.g., "Jan 15, 2024, 3:30 PM")
 */
export const formatDateTime = (dateString: string | Date | undefined | null): string => {
  if (!dateString) {
    return "N/A";
  }

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return "Invalid Date";
  }
};

