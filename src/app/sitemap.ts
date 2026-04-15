import { getXmlSitemapEntries } from "@/lib/sitemap-data";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries = await getXmlSitemapEntries();
	return entries;
}
