"use client";

import { useAuth } from "@/context/UserContext";

const DashboardOverview = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <p>Welcome, {user?.name || "User"}!</p>
    </div>
  );
};

export default DashboardOverview;
