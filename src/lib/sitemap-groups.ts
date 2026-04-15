import { MetadataRoute } from "next";

export type SitemapGroup =
	| "public-pages"
	| "service-pages"
	| "blog-pages"
	| "images";

type SitemapEntry = MetadataRoute.Sitemap[0];

export type GroupedSitemapEntry = SitemapEntry & {
	group: SitemapGroup;
	groupLabel: string;
};

export interface SitemapGroupInfo {
	id: SitemapGroup;
	label: string;
	description: string;
	priority: number;
}

export const sitemapGroups: SitemapGroupInfo[] = [
	{
		id: "public-pages",
		label: "Public Pages",
		description: "Main website pages accessible to all visitors",
		priority: 1,
	},
	{
		id: "service-pages",
		label: "Services",
		description: "Our professional service offerings and solutions",
		priority: 2,
	},
	{
		id: "blog-pages",
		label: "Blog",
		description: "Articles, insights, and industry news",
		priority: 3,
	},
	{
		id: "images",
		label: "Images & Media",
		description: "Visual content and media assets",
		priority: 4,
	},
];

export function groupSitemapEntries(
	entries: GroupedSitemapEntry[]
): Record<SitemapGroup, GroupedSitemapEntry[]> {
	return entries.reduce(
		(acc, entry) => {
			if (!acc[entry.group]) {
				acc[entry.group] = [];
			}
			acc[entry.group].push(entry);
			return acc;
		},
		{
			"public-pages": [],
			"service-pages": [],
			"blog-pages": [],
			images: [],
		} as Record<SitemapGroup, GroupedSitemapEntry[]>
	);
}

export function getSitemapGroupInfo(
	groupId: SitemapGroup
): SitemapGroupInfo | undefined {
	return sitemapGroups.find((g) => g.id === groupId);
}
