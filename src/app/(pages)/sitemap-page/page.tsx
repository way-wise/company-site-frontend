import Link from "next/link";
import {
	groupSitemapEntries,
	SitemapGroup,
	sitemapGroups,
} from "@/lib/sitemap-groups";
import { getAllSitemapEntries } from "@/lib/sitemap-data";
import { absoluteUrl } from "@/lib/site";
import { Metadata } from "next";

// Keep this a static `metadata` export rather than an async `generateMetadata`. This route is
// rendered dynamically, and Next.js streams *awaited* metadata to the end of <body> — static
// metadata has nothing to await, so it stays inside <head> where crawlers expect it.
export const metadata: Metadata = {
	title: "Sitemap | Way-Wise",
	description:
		"Navigate through all pages, services, blogs, and images on Way-Wise. Find exactly what you're looking for with our organized sitemap.",
	// Self-referencing canonical. Without this the page inherits the root layout's
	// alternates.canonical, which points at the homepage and canonicalises this page away.
	alternates: {
		canonical: absoluteUrl("/sitemap-page"),
	},
};

export default async function SitemapPage() {
	const allEntries = await getAllSitemapEntries();
	const grouped = groupSitemapEntries(allEntries);

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
					Way Wise Tech Website Sitemap and Pages
				</h1>

				{sitemapGroups.map((group) => {
					const entries = grouped[group.id] || [];
					if (entries.length === 0) return null;

					return (
						<div key={group.id} className="mb-8">
							<h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b pb-2">
								{group.label} ({entries.length})
							</h2>
							<ul className="space-y-1 text-sm">
								{entries.map((entry, index) => (
									<li key={`${entry.url}-${index}`}>
										<Link
											href={entry.url}
											className="text-blue-600 hover:underline dark:text-blue-400"
										>
											{entry.url}
										</Link>
										<span className="text-gray-500 dark:text-gray-400 ml-2">
											{entry.lastModified && `(${new Date(entry.lastModified).toLocaleDateString()})`}
										</span>
									</li>
								))}
							</ul>
						</div>
					);
				})}

				<div className="mt-8 pt-4 border-t">
					<Link
						href="/sitemap.xml"
						className="text-blue-600 hover:underline dark:text-blue-400 text-sm"
					>
						View XML Sitemap
					</Link>
				</div>
			</div>
		</div>
	);
}

