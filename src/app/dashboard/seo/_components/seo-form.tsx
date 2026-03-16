"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateSeoInput, SeoSetting } from "@/services/SeoService";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const seoFormSchema = z.object({
  pageSlug: z.string().min(1, "Page slug is required"),
  pageName: z.string().min(1, "Page name is required"),
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
  isActive: z.boolean(),
});

type SeoFormValues = z.infer<typeof seoFormSchema>;

interface SeoFormProps {
  initialData?: SeoSetting;
  onSubmit: (data: CreateSeoInput) => Promise<void>;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

const PREDEFINED_PAGES = [
  { slug: "home", name: "Home Page" },
  { slug: "about-us", name: "About Us" },
  { slug: "services", name: "Services" },
  { slug: "contact-us", name: "Contact Us" },
  { slug: "blog", name: "Blog" },
  { slug: "faq", name: "FAQ" },
  { slug: "privacy-policy", name: "Privacy Policy" },
  { slug: "terms-and-conditions", name: "Terms and Conditions" },
  { slug: "microsoft-support", name: "Microsoft Support" },
];

export const SeoForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode,
}: SeoFormProps) => {
  const router = useRouter();

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      pageSlug: initialData?.pageSlug || "",
      pageName: initialData?.pageName || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      keywords: initialData?.keywords?.join(", ") || "",
      ogTitle: initialData?.ogTitle || "",
      ogDescription: initialData?.ogDescription || "",
      ogImage: initialData?.ogImage || "",
      twitterTitle: initialData?.twitterTitle || "",
      twitterDescription: initialData?.twitterDescription || "",
      twitterImage: initialData?.twitterImage || "",
      canonicalUrl: initialData?.canonicalUrl || "",
      robotsIndex: initialData?.robotsIndex ?? true,
      robotsFollow: initialData?.robotsFollow ?? true,
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleFormSubmit = async (data: SeoFormValues) => {
    const keywords = data.keywords
      ? data.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    await onSubmit({
      ...data,
      keywords,
    });
  };

  const handlePageSelect = (slug: string) => {
    const page = PREDEFINED_PAGES.find((p) => p.slug === slug);
    if (page) {
      form.setValue("pageSlug", page.slug);
      form.setValue("pageName", page.name);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "create" ? "Add SEO Setting" : "Edit SEO Setting"}
            </h1>
          </div>
          <p className="pl-10 text-sm text-muted-foreground">
            {mode === "create"
              ? "Configure SEO settings for a page."
              : "Update SEO settings for this page."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="seo-form" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
              ? "Create SEO Setting"
              : "Save Changes"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          id="seo-form"
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8"
        >
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium">Page Information</h3>

                {mode === "create" && (
                  <div className="space-y-2">
                    <FormLabel>Quick Select Page</FormLabel>
                    <Select onValueChange={handlePageSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a predefined page or enter custom" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREDEFINED_PAGES.map((page) => (
                          <SelectItem key={page.slug} value={page.slug}>
                            {page.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a page or enter custom values below
                    </FormDescription>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="pageSlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., home, about-us, services"
                            {...field}
                            disabled={isSubmitting || mode === "edit"}
                          />
                        </FormControl>
                        <FormDescription>
                          URL identifier for the page (without slashes)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pageName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Home Page, About Us"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Display name for this page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium">Meta Tags</h3>

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter meta title (50-60 characters recommended)"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/60 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter meta description (150-160 characters recommended)"
                          rows={3}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/160 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="web development, software company, USA, custom software"
                          rows={2}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords for search engines (e.g., keyword1, keyword2, keyword3)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.waywisetech.com/page"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Specify the canonical URL for this page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium">Open Graph (Social Media)</h3>

                <FormField
                  control={form.control}
                  name="ogTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title for social media sharing"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use meta title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ogDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description for social media sharing"
                          rows={2}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ogImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || ""}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                          placeholder="Upload or enter OG image URL"
                        />
                      </FormControl>
                      <FormDescription>
                        Recommended size: 1200x630 pixels
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium">Twitter Card</h3>

                <FormField
                  control={form.control}
                  name="twitterTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title for Twitter cards"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description for Twitter cards"
                          rows={2}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || ""}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                          placeholder="Upload or enter Twitter image URL"
                        />
                      </FormControl>
                      <FormDescription>
                        Recommended size: 1200x600 pixels
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-1">
              <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="font-medium">Settings</h3>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Enable this SEO configuration
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="robotsIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Engine Indexing</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Allow Indexing</SelectItem>
                          <SelectItem value="false">No Index</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Allow search engines to index this page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="robotsFollow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow Links</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Follow Links</SelectItem>
                          <SelectItem value="false">No Follow</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Allow search engines to follow links
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-lg border bg-blue-50 p-4">
                <h4 className="font-medium text-blue-900">SEO Tips</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• Meta title: 50-60 characters</li>
                  <li>• Meta description: 150-160 characters</li>
                  <li>• Include primary keywords naturally</li>
                  <li>• Each page should have unique SEO</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
