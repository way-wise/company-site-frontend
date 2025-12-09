import { Blog } from "@/schema/blogSchema";

export async function getAllBlogs(): Promise<Blog[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
		const url = `${baseUrl}/blogs/public`;

		const response = await fetch(url, {
			cache: "no-store",
		});

		if (!response.ok) {
			return [];
		}

		const data = await response.json();
		return data.data || [];
	} catch {
		return [];
	}
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
		const response = await fetch(`${baseUrl}/blogs/slug/${slug}`, {
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return data.data || null;
	} catch {
		return null;
	}
}
