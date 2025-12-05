"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogStats } from "@/hooks/useBlogMutations";
import { Archive, Eye, FileText, PenTool } from "lucide-react";

export const BlogStats = () => {
  const { data: response, isLoading } = useBlogStats();

  const stats = response?.data;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-1 h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Blogs",
      value: stats?.totalBlogs || 0,
      icon: FileText,
      description: "All blog posts",
    },
    {
      title: "Published",
      value: stats?.publishedBlogs || 0,
      icon: Eye,
      description: "Live blog posts",
    },
    {
      title: "Drafts",
      value: stats?.draftBlogs || 0,
      icon: PenTool,
      description: "Work in progress",
    },
    {
      title: "Archived",
      value: stats?.archivedBlogs || 0,
      icon: Archive,
      description: "Archived posts",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
