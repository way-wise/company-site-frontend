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

// Public folder image paths - Home
const contactImg = "/images/home/contact.png";
const mainBackground = "/images/home/full-bg.png";
const heroLeftBg = "/images/home/hero-ai.png";

// About-us images
const aboutMainPng = "/images/about-us/about-main.png";
const aboutUsSvg = "/images/about-us/about-us.svg";

// Contact images
const contactFiroz = "/images/contact/firoz.svg";
const contactImage1 = "/images/contact/image1.svg";
const contactImage2 = "/images/contact/image2.svg";
const contactImage3 = "/images/contact/image3.svg";
const contactImage4 = "/images/contact/image4.svg";
const contactLee1 = "/images/contact/lee1.png";

// Projects images
const projectFly = "/images/projects/fly.png";
const projectBg = "/images/projects/project-bg.png";
const projectSearch = "/images/projects/search.png";
const projectSeatWave = "/images/projects/seat-wave.png";
const projectVoice = "/images/projects/voice.png";
const projectWeout = "/images/projects/weout1.png";

// Offers images
const offerBg = "/images/offers/offer-bg.png";
const offer1 = "/images/offers/offer1.png";
const offer2 = "/images/offers/offer2.png";
const offer3 = "/images/offers/offer3.png";
const offer4 = "/images/offers/offer4.png";

// Feedback images
const feadbackBg = "/images/feadback/feadback-bg.png";
const feadbackFlyarjon = "/images/feadback/flyarjon.jpg";
const feadbackImage1 = "/images/feadback/image1.png";
const feadbackSearch = "/images/feadback/search.jpg";
const feadbackWeout = "/images/feadback/weout-jad.jpg";

// Category images
const categoryBullet = "/images/category/bullet.svg";
const categoryFlyArzan = "/images/category/fly-arzan.svg";
const categoryPenWise = "/images/category/pen-wise.svg";
const categoryRN = "/images/category/r-n.png";
const categoryRNsvg = "/images/category/r-n.svg";
const categorySearchforce = "/images/category/searchforce.png";
const categorySeatWaves = "/images/category/seat-waves.svg";
const categoryWeoutSvg = "/images/category/weout.svg";
const categoryWeout = "/images/category/weout1.png";

// Services images
const microsoftSupportImg = "/images/services/microsoft-support.png";
const msSupportFlowChart = "/images/services/ms-support-flow-chart.png";
const msSupport = "/images/services/ms-support.png";
const serviceBg = "/images/services/service-bg.png";
const servicesBg = "/images/services/services-bg.png";

// Shared images
const wayWiseLogo = "/images/shared/way-wise-logo.svg";
const wayWiseProfile = "/images/shared/way-wise-profile.jpg";
const wayWiseText = "/images/shared/way-wise-text.png";

// Service-specific images
const cloudEngineeringBg = "/images/services/cloud-engineering.png";
const digitalMarketingBg = "/images/services/digital-marketing.png";
const graphicsDesignBg = "/images/services/graphics-design.png";
const internetThingsBg = "/images/services/internetthings.png";
const mobileAppBg = "/images/services/mobile-application.png";
const webAppBg = "/images/services/web-application.png";
const aiImg = "/images/services/ai.jpg";
const appImg = "/images/services/app.jpg";
const cloudImg = "/images/services/cloud.jpg";
const digitalImg = "/images/services/digital.jpg";
const grpahicsImg = "/images/services/graphic.jpg";
const webImg = "/images/services/web.jpg";

// Service icons
const cloudIcon = "/icons/services/cloud.svg";
const digitalIcon = "/icons/services/digital.png";
const graphicsIcon = "/icons/services/graphics.svg";
const internetIcon = "/icons/services/internet.svg";
const mobileIcon = "/icons/services/mobile.svg";
const webIcon = "/icons/services/web.png";

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
	{ image: feadbackFlyarjon, label: "Flyarjon Feedback" },
	{ image: feadbackImage1, label: "Feedback Image 1" },
	{ image: feadbackSearch, label: "Search Feedback" },
	{ image: feadbackWeout, label: "WeOut Feedback" },

	// Category images
	{ image: categoryBullet, label: "Bullet Category" },
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
