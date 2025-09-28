"use client";

// Simple cookie utilities for authentication - following best practices
export const cookieManager = {
  // Get cookie value by name
  get: (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(nameEQ)) {
        return trimmed.substring(nameEQ.length);
      }
    }
    return null;
  },

  // Clear authentication cookies
  clear: () => {
    if (typeof document === "undefined") return;

    const cookiesToClear = ["accessToken", "refreshToken"];
    const clearCookie = (name: string) => {
      //   document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;Secure;SameSite=Strict`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
    };

    cookiesToClear.forEach(clearCookie);
  },
};
