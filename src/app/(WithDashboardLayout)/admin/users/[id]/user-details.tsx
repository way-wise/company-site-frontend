"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUserMutations";
import {
  ArrowLeft,
  Check,
  CircleX,
  ShieldUser,
  UserRound,
  X,
} from "lucide-react";

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// UserDetails component
const UserDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: userResponse, isLoading, error } = useUser(id);

  // Extract user data from the response
  const user = userResponse?.data;
  console.log(user);
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft />
          <span>Go Back</span>
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        {isLoading ? (
          <UserDetailsSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-destructive">
              <p className="text-lg font-medium">Failed to load user details</p>
              <p className="text-sm text-muted-foreground">
                {error?.message ||
                  "Something went wrong while fetching user details"}
              </p>
            </div>
          </div>
        ) : user ? (
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-start sm:text-left">
            {user?.image ? (
              <Image
                src={user?.image}
                alt="Profile Image"
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex size-[150px] items-center justify-center rounded-full bg-muted">
                <UserRound className="size-20 stroke-[1.5] text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="flex items-center justify-center gap-2 text-2xl font-medium sm:justify-start">
                <span>{user?.name}</span>

                {user?.emailVerified ? (
                  <Badge variant="success" size="icon">
                    <Check className="size-4" />
                  </Badge>
                ) : (
                  <Badge variant="destructive" size="icon">
                    <X className="size-4" />
                  </Badge>
                )}
              </h1>
              <Link
                href={`mailto:${user?.email}`}
                className="text-muted-foreground"
              >
                {user?.email}
              </Link>
              <p className="text-muted-foreground">
                Since {user?.createdAt && formatDate(user?.createdAt)}
              </p>
              <div className="flex items-center gap-2 py-3">
                <div className="flex items-center gap-1.5 rounded-full bg-muted py-1.5 pr-2.5 pl-2 text-muted-foreground">
                  <ShieldUser className="size-6 stroke-[1.5]" />
                  <span className="capitalize">{user?.role}</span>
                </div>
                {!user?.isActive ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-destructive/70 py-1.5 pr-2.5 pl-2 text-white">
                    <CircleX className="size-6 stroke-[1.5]" />
                    <span className="capitalize">Banned</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full bg-muted py-1.5 pr-2.5 pl-2 text-muted-foreground">
                    <Check className="size-6 stroke-[1.5]" />
                    <span className="capitalize">Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">User not found</p>
          </div>
        )}
      </div>

      {/* <div className="mt-5 rounded-lg border bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Rewards Points</h3>
          <span className="text-md text-muted-foreground">
            {user?.totalPoints ?? 0}
          </span>
        </div>
      </div> */}
    </>
  );
};

// Skeleton loader for user profile
const UserDetailsSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:justify-start sm:text-left">
      <Skeleton className="size-[150px] rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-64 rounded" />
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-6 w-48 rounded" />
      </div>
    </div>
  );
};

export default UserDetails;
