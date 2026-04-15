import { GroupedSitemapEntry, SitemapGroup } from "./sitemap-groups";
import { servicesData } from "@/datas/services";

const baseUrl =
	process.env.NEXT_PUBLIC_BASE_URL ||
	(process.env.NODE_ENV === "production"
		? "https://www.waywisetech.com"
		: "http://localhost:3000");

// Helper to get image URL
const getImageUrl = (
	image: { src?: string } | string | undefined
): string | null => {
	if (!image) return null;
	if (typeof image === "string") {
		if (image.startsWith("http")) return image;
		return image.startsWith("/") ? `${baseUrl}${image}` : `${baseUrl}/${image}`;
	}
	if (image && typeof image === "object" && image !== null) {
		const src = (image as { src?: unknown }).src;
		if (typeof src === "string" && src.length > 0) {
			if (src.startsWith("http")) return src;
			return src.startsWith("/") ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
		}
	}
	return null;
};

// Public pages configuration
const publicPagesConfig: Array<{
	path: string;
	label: string;
	priority: number;
	changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}> = [
	{ path: "/", label: "Home", priority: 1.0, changeFrequency: "daily" },
	{ path: "/about-us", label: "About Us", priority: 0.8, changeFrequency: "monthly" },
	{ path: "/contact-us", label: "Contact Us", priority: 0.8, changeFrequency: "monthly" },
	{ path: "/services", label: "Services", priority: 0.9, changeFrequency: "weekly" },
	{ path: "/microsoft-support", label: "Microsoft Support", priority: 0.8, changeFrequency: "monthly" },
	{ path: "/faq", label: "FAQ", priority: 0.7, changeFrequency: "monthly" },
	{ path: "/privacy-policy", label: "Privacy Policy", priority: 0.5, changeFrequency: "yearly" },
	{ path: "/terms-and-conditions", label: "Terms and Conditions", priority: 0.5, changeFrequency: "yearly" },
	{ path: "/book", label: "Book a Meeting", priority: 0.6, changeFrequency: "monthly" },
	{ path: "/blog", label: "Blog", priority: 0.8, changeFrequency: "weekly" },
	{ path: "/sitemap-page", label: "Sitemap", priority: 0.5, changeFrequency: "monthly" },
];

// Import images - Home
import contactImg from "@/assets/images/home/contact.png";
import mainBackground from "@/assets/images/home/full-bg.png";
import heroLeftBg from "@/assets/images/home/hero-ai.png";

// About-us images
import aboutMainPng from "@/assets/images/about-us/about-main.png";
import aboutUsSvg from "@/assets/images/about-us/about-us.svg";

// Contact images
import contactFiroz from "@/assets/images/contact/firoz.svg";
import contactImage1 from "@/assets/images/contact/image1.svg";
import contactImage2 from "@/assets/images/contact/image2.svg";
import contactImage3 from "@/assets/images/contact/image3.svg";
import contactImage4 from "@/assets/images/contact/image4.svg";
import contactLee1 from "@/assets/images/contact/lee1.png";

// Projects images
import projectFidden from "@/assets/images/projects/fidden-io.png";
import projectFly from "@/assets/images/projects/fly.png";
import projectBg from "@/assets/images/projects/project-bg.png";
import projectSearch from "@/assets/images/projects/search.png";
import projectSeatWave from "@/assets/images/projects/seat-wave.png";
import projectVoice from "@/assets/images/projects/voice.png";
import projectWeout from "@/assets/images/projects/weout1.png";

// Offers images
import offerBg from "@/assets/images/offers/offer-bg.png";
import offer1 from "@/assets/images/offers/offer1.png";
import offer2 from "@/assets/images/offers/offer2.png";
import offer3 from "@/assets/images/offers/offer3.png";
import offer4 from "@/assets/images/offers/offer4.png";

// Feedback images
import feadbackBg from "@/assets/images/feadback/feadback-bg.png";
import feadbackFidden from "@/assets/images/feadback/fidden.jpg";
import feadbackFlyarjon from "@/assets/images/feadback/flyarjon.jpg";
import feadbackImage1 from "@/assets/images/feadback/image1.png";
import feadbackSearch from "@/assets/images/feadback/search.jpg";
import feadbackWeout from "@/assets/images/feadback/weout-jad.jpg";

// Category images
import categoryBullet from "@/assets/images/category/bullet.svg";
import categoryFidden from "@/assets/images/category/fidden.svg";
import categoryFlyArzan from "@/assets/images/category/fly-arzan.svg";
import categoryPenWise from "@/assets/images/category/pen-wise.svg";
import categoryRN from "@/assets/images/category/r-n.png";
import categoryRNsvg from "@/assets/images/category/r-n.svg";
import categorySearchforce from "@/assets/images/category/searchforce.png";
import categorySeatWaves from "@/assets/images/category/seat-waves.svg";
import categoryWeoutSvg from "@/assets/images/category/weout.svg";
import categoryWeout from "@/assets/images/category/weout1.png";

// Services images
import microsoftSupportImg from "@/assets/images/services/microsoft-support.png";
import msSupportFlowChart from "@/assets/images/services/ms-support-flow-chart.png";
import msSupport from "@/assets/images/services/ms-support.png";
import serviceBg from "@/assets/images/services/service-bg.png";
import servicesBg from "@/assets/images/services/services-bg.png";

// Shared images
import wayWiseLogo from "@/assets/images/shared/way-wise-logo.svg";
import wayWiseProfile from "@/assets/images/shared/way-wise-profile.jpg";
import wayWiseText from "@/assets/images/shared/way-wise-text.png";

// Service-specific images
import cloudEngineeringBg from "@/assets/images/services/cloud-engineering.png";
import digitalMarketingBg from "@/assets/images/services/digital-marketing.png";
import graphicsDesignBg from "@/assets/images/services/graphics-design.png";
import internetThingsBg from "@/assets/images/services/internetthings.png";
import mobileAppBg from "@/assets/images/services/mobile-application.png";
import webAppBg from "@/assets/images/services/web-application.png";
import aiImg from "@/assets/images/services/ai.jpg";
import appImg from "@/assets/images/services/app.jpg";
import cloudImg from "@/assets/images/services/cloud.jpg";
import digitalImg from "@/assets/images/services/digital.jpg";
import grpahicsImg from "@/assets/images/services/graphic.jpg";
import webImg from "@/assets/images/services/web.jpg";

// Service icons
import cloudIcon from "@/assets/icons/services/cloud.svg";
import digitalIcon from "@/assets/icons/services/digital.png";
import graphicsIcon from "@/assets/icons/services/graphics.svg";
import internetIcon from "@/assets/icons/services/internet.svg";
import mobileIcon from "@/assets/icons/services/mobile.svg";
import webIcon from "@/assets/icons/services/web.png";

// Collect all images
const allImages = [
	// Home images
	{ image: mainBackground, label: "Home Background" },
	{ image: heroLeftBg, label: "Hero Background" },
	{ image: contactImg, label: "Contact Section Image" },

	// About images
	{ image: aboutMainPng, label: "About Main Image" },
	{ image: aboutUsSvg, label: "About Us Graphic" },

	// Contact images
	{ image: contactFiroz, label: "Contact - Firoz" },
	{ image: contactImage1, label: "Contact Image 1" },
	{ image: contactImage2, label: "Contact Image 2" },
	{ image: contactImage3, label: "Contact Image 3" },
	{ image: contactImage4, label: "Contact Image 4" },
	{ image: contactLee1, label: "Contact - Lee" },

	// Project images
	{ image: projectFidden, label: "Fidden.io Project" },
	{ image: projectFly, label: "Fly Project" },
	{ image: projectBg, label: "Projects Background" },
	{ image: projectSearch, label: "Search Project" },
	{ image: projectSeatWave, label: "Seat Wave Project" },
	{ image: projectVoice, label: "Voice Project" },
	{ image: projectWeout, label: "WeOut Project" },

	// Offer images
	{ image: offerBg, label: "Offers Background" },
	{ image: offer1, label: "Offer 1" },
	{ image: offer2, label: "Offer 2" },
	{ image: offer3, label: "Offer 3" },
	{ image: offer4, label: "Offer 4" },

	// Feedback images
	{ image: feadbackBg, label: "Feedback Background" },
	{ image: feadbackFidden, label: "Fidden Feedback" },
	{ image: feadbackFlyarjon, label: "Flyarjon Feedback" },
	{ image: feadbackImage1, label: "Feedback Image 1" },
	{ image: feadbackSearch, label: "Search Feedback" },
	{ image: feadbackWeout, label: "WeOut Feedback" },

	// Category images
	{ image: categoryBullet, label: "Bullet Category" },
	{ image: categoryFidden, label: "Fidden Category" },
	{ image: categoryFlyArzan, label: "Fly Arzan Category" },
	{ image: categoryPenWise, label: "Pen Wise Category" },
	{ image: categoryRN, label: "R-N Category" },
	{ image: categoryRNsvg, label: "R-N SVG Category" },
	{ image: categorySearchforce, label: "Searchforce Category" },
	{ image: categorySeatWaves, label: "Seat Waves Category" },
	{ image: categoryWeoutSvg, label: "WeOut SVG Category" },
	{ image: categoryWeout, label: "WeOut Category" },

	// Services images
	{ image: microsoftSupportImg, label: "Microsoft Support" },
	{ image: msSupportFlowChart, label: "MS Support Flow Chart" },
	{ image: msSupport, label: "MS Support" },
	{ image: serviceBg, label: "Service Background" },
	{ image: servicesBg, label: "Services Background" },

	// Shared images
	{ image: wayWiseLogo, label: "Way Wise Logo" },
	{ image: wayWiseProfile, label: "Way Wise Profile" },
	{ image: wayWiseText, label: "Way Wise Text" },

	// Service specific images
	{ image: cloudEngineeringBg, label: "Cloud Engineering" },
	{ image: digitalMarketingBg, label: "Digital Marketing" },
	{ image: graphicsDesignBg, label: "Graphics Design" },
	{ image: internetThingsBg, label: "AI/ML Services" },
	{ image: mobileAppBg, label: "Mobile Application" },
	{ image: webAppBg, label: "Web Application" },
	{ image: aiImg, label: "AI Services" },
	{ image: appImg, label: "App Development" },
	{ image: cloudImg, label: "Cloud Services" },
	{ image: digitalImg, label: "Digital Services" },
	{ image: grpahicsImg, label: "Graphics Services" },
	{ image: webImg, label: "Web Services" },

	// Service icons
	{ image: cloudIcon, label: "Cloud Icon" },
	{ image: digitalIcon, label: "Digital Icon" },
	{ image: graphicsIcon, label: "Graphics Icon" },
	{ image: internetIcon, label: "Internet Icon" },
	{ image: mobileIcon, label: "Mobile Icon" },
	{ image: webIcon, label: "Web Icon" },
];

export async function getAllSitemapEntries(): Promise<GroupedSitemapEntry[]> {
	const entries: GroupedSitemapEntry[] = [];
	const now = new Date();

	// Add public pages
	publicPagesConfig.forEach((page) => {
		entries.push({
			url: `${baseUrl}${page.path}`,
			lastModified: now,
			changeFrequency: page.changeFrequency,
			priority: page.priority,
			group: "public-pages",
			groupLabel: "Public Pages",
		});
	});

	// Add service pages
	servicesData.forEach((service) => {
		const imageUrls: string[] = [];
		const bgUrl = getImageUrl(service.bgImage);
		const videoUrl = getImageUrl(service.videoImage);
		const iconUrl = getImageUrl(service.icon);

		if (bgUrl) imageUrls.push(bgUrl);
		if (videoUrl) imageUrls.push(videoUrl);
		if (iconUrl) imageUrls.push(iconUrl);

		entries.push({
			url: `${baseUrl}${service.url}`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
			images: imageUrls.length > 0 ? imageUrls : undefined,
			group: "service-pages",
			groupLabel: "Services",
		});
	});

	// Fetch and add blog pages
	try {
		const baseApi = process.env.NEXT_PUBLIC_BASE_API;
		if (baseApi) {
			const response = await fetch(`${baseApi}/blogs/public`, {
				cache: "no-store",
			});
			if (response.ok) {
				const data = await response.json();
				const blogs = data.data || [];

				blogs.forEach((blog: { slug: string; updatedAt?: string; featuredImage?: string }) => {
					const imageUrls: string[] = [];
					if (blog.featuredImage) {
						imageUrls.push(blog.featuredImage);
					}

					entries.push({
						url: `${baseUrl}/blog/${blog.slug}`,
						lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
						changeFrequency: "weekly",
						priority: 0.7,
						images: imageUrls.length > 0 ? imageUrls : undefined,
						group: "blog-pages",
						groupLabel: "Blog",
					});
				});
			}
		}
	} catch {
		// Silent fail - blogs will be excluded if API is unavailable
	}

	// Add all images as separate entries
	allImages.forEach(({ image, label }) => {
		const url = getImageUrl(image);
		if (url) {
			entries.push({
				url,
				lastModified: now,
				changeFrequency: "monthly",
				priority: 0.4,
				group: "images",
				groupLabel: "Images",
			});
		}
	});

	return entries;
}

// For XML sitemap generation (MetadataRoute.Sitemap format)
export async function getXmlSitemapEntries(): Promise<
	Array<{
		url: string;
		lastModified?: Date;
		changeFrequency?:
			| "always"
			| "hourly"
			| "daily"
			| "weekly"
			| "monthly"
			| "yearly"
			| "never";
		priority?: number;
		images?: string[];
	}>
> {
	const grouped = await getAllSitemapEntries();
	return grouped.map(({ group, groupLabel, ...entry }) => ({
		...entry,
		lastModified: entry.lastModified instanceof Date ? entry.lastModified : new Date(),
	}));
}
