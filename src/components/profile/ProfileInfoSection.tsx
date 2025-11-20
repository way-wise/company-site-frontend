"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/UserContext";
import { useUpdateUser } from "@/hooks/useUserMutations";
import { User, UserProfile } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  bio: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      "Please enter a valid URL (must start with http:// or https://)"
    ),
  twitter: z.string().optional(),
  linkedIn: z.string().optional(),
  facebook: z.string().optional(),
  language: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileInfoSectionProps {
  user: User;
}

export function ProfileInfoSection({ user }: ProfileInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { refreshUser } = useAuth();
  const updateUserMutation = useUpdateUser();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      contactNumber: user.userProfile?.contactNumber || "",
      address: user.userProfile?.address || "",
      gender: user.userProfile?.gender || undefined,
      bio: user.userProfile?.bio || "",
      website: user.userProfile?.website || "",
      twitter: user.userProfile?.twitter || "",
      linkedIn: user.userProfile?.linkedIn || "",
      facebook: user.userProfile?.facebook || "",
      language: user.userProfile?.language || "",
      education: user.userProfile?.education || "",
      experience: user.userProfile?.experience || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Prepare userProfile update data
      const userProfileData: Record<string, unknown> = {};
      if (data.contactNumber) userProfileData.contactNumber = data.contactNumber;
      if (data.address) userProfileData.address = data.address;
      if (data.gender) userProfileData.gender = data.gender;
      if (data.bio) userProfileData.bio = data.bio;
      if (data.website) userProfileData.website = data.website;
      if (data.twitter) userProfileData.twitter = data.twitter;
      if (data.linkedIn) userProfileData.linkedIn = data.linkedIn;
      if (data.facebook) userProfileData.facebook = data.facebook;
      if (data.language) userProfileData.language = data.language;
      if (data.education) userProfileData.education = data.education;
      if (data.experience) userProfileData.experience = data.experience;

      // Structure for Prisma nested update
      const updateData: Record<string, unknown> = {
        name: data.name,
        email: data.email,
      };

      if (user.userProfile) {
        // If userProfile exists, use nested update
        updateData.userProfile = {
          update: userProfileData,
        };
      } else {
        // If userProfile doesn't exist, create it
        updateData.userProfile = {
          create: userProfileData,
        };
      }

      await updateUserMutation.mutateAsync({
        userId: user.id,
        userData: updateData as Partial<User>,
      });
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and manage your personal information
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{user.email}</p>
              </div>
              {user.userProfile?.contactNumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact Number
                  </p>
                  <p className="text-base">{user.userProfile.contactNumber}</p>
                </div>
              )}
              {user.userProfile?.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p className="text-base">{user.userProfile.address}</p>
                </div>
              )}
              {user.userProfile?.gender && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-base capitalize">
                    {user.userProfile.gender.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {user.userProfile?.bio && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bio</p>
                  <p className="text-base">{user.userProfile.bio}</p>
                </div>
              )}
              {user.userProfile?.website && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Website
                  </p>
                  <a
                    href={user.userProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-primary hover:underline"
                  >
                    {user.userProfile.website}
                  </a>
                </div>
              )}
              {(user.userProfile?.twitter ||
                user.userProfile?.linkedIn ||
                user.userProfile?.facebook) && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Social Links
                  </p>
                  <div className="space-y-1">
                    {user.userProfile.twitter && (
                      <div>
                        <a
                          href={user.userProfile.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Twitter
                        </a>
                      </div>
                    )}
                    {user.userProfile.linkedIn && (
                      <div>
                        <a
                          href={user.userProfile.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                    {user.userProfile.facebook && (
                      <div>
                        <a
                          href={user.userProfile.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Facebook
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {user.userProfile?.language && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Language
                  </p>
                  <p className="text-base">{user.userProfile.language}</p>
                </div>
              )}
              {user.userProfile?.education && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Education
                  </p>
                  <p className="text-base">{user.userProfile.education}</p>
                </div>
              )}
              {user.userProfile?.experience && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Experience
                  </p>
                  <p className="text-base">{user.userProfile.experience}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Profile Information</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={updateUserMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://twitter.com/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://facebook.com/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                isLoading={updateUserMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

