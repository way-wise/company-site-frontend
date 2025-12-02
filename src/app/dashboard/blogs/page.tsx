import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { BlogStats } from "../_components/blogs/blog-stats";
import { BlogTable } from "../_components/blogs/blog-table";

const DashboardBlogsPage = () => {
  return (
    <PermissionGuard
      permissions={["read_blog", "view_all_blogs"]}
      requireAll={false}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-gray-600">
            Create, edit, and manage your blog posts
          </p>
        </div>

        <BlogStats />
        <BlogTable />
      </div>
    </PermissionGuard>
  );
};

export default DashboardBlogsPage;
