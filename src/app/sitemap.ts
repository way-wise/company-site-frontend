// Home images
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

// Feadback images
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

// Services images (already in servicesData, but adding additional ones)
import microsoftSupportImg from "@/assets/images/services/microsoft-support.png";
import msSupportFlowChart from "@/assets/images/services/ms-support-flow-chart.png";
import msSupport from "@/assets/images/services/ms-support.png";
import serviceBg from "@/assets/images/services/service-bg.png";
import servicesBg from "@/assets/images/services/services-bg.png";

// Shared images
import wayWiseLogo from "@/assets/images/shared/way-wise-logo.svg";
import wayWiseProfile from "@/assets/images/shared/way-wise-profile.jpg";
import wayWiseText from "@/assets/images/shared/way-wise-text.png";

import { servicesData } from "@/datas/services";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  // Helper function to get image URL from StaticImageData
  const getImageUrl = (
    image: { src?: string } | string | undefined
  ): string | null => {
    if (!image) return null;

    // If it's already a string
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      return image.startsWith("/")
        ? `${baseUrl}${image}`
        : `${baseUrl}/${image}`;
    }

    // For StaticImageData objects, use the src property
    // Next.js optimized images have src that points to _next/static
    if (image && typeof image === "object" && image !== null) {
      // Access src property safely
      const src = (image as { src?: unknown }).src;

      // Ensure src is a string
      if (typeof src === "string" && src.length > 0) {
        if (src.startsWith("http")) return src;
        // The src from StaticImageData is already a path like /_next/static/...
        return src.startsWith("/") ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
      }
    }
    return null;
  };

  // Static pages with their images
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      images: (() => {
        const imageUrls: string[] = [];

        // Home page images
        const mainBgUrl = getImageUrl(mainBackground);
        const heroUrl = getImageUrl(heroLeftBg);
        const contactUrl = getImageUrl(contactImg);

        // Projects images (shown on home page)
        const projectUrls = [
          getImageUrl(projectFidden),
          getImageUrl(projectFly),
          getImageUrl(projectSearch),
          getImageUrl(projectSeatWave),
          getImageUrl(projectVoice),
          getImageUrl(projectWeout),
          getImageUrl(projectBg),
        ];

        // Offers images (shown on home page)
        const offerUrls = [
          getImageUrl(offerBg),
          getImageUrl(offer1),
          getImageUrl(offer2),
          getImageUrl(offer3),
          getImageUrl(offer4),
        ];

        // Feadback images (shown on home page)
        const feadbackUrls = [
          getImageUrl(feadbackBg),
          getImageUrl(feadbackFidden),
          getImageUrl(feadbackFlyarjon),
          getImageUrl(feadbackImage1),
          getImageUrl(feadbackSearch),
          getImageUrl(feadbackWeout),
        ];

        // Category images (shown on home page)
        const categoryUrls = [
          getImageUrl(categoryBullet),
          getImageUrl(categoryFidden),
          getImageUrl(categorySearchforce),
          getImageUrl(categorySeatWaves),
          getImageUrl(categoryWeout),
          getImageUrl(categoryWeoutSvg),
          getImageUrl(categoryFlyArzan),
          getImageUrl(categoryPenWise),
          getImageUrl(categoryRN),
          getImageUrl(categoryRNsvg),
        ];

        // Shared images
        const sharedUrls = [
          getImageUrl(wayWiseLogo),
          getImageUrl(wayWiseProfile),
          getImageUrl(wayWiseText),
        ];

        // Add all valid URLs
        [
          mainBgUrl,
          heroUrl,
          contactUrl,
          ...projectUrls,
          ...offerUrls,
          ...feadbackUrls,
          ...categoryUrls,
          ...sharedUrls,
        ].forEach((url) => {
          if (url && typeof url === "string") {
            imageUrls.push(url);
          }
        });

        return imageUrls.length > 0 ? imageUrls : undefined;
      })(),
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: (() => {
        const imageUrls: string[] = [];
        const aboutMainUrl = getImageUrl(aboutMainPng);
        const aboutUsUrl = getImageUrl(aboutUsSvg);

        // Projects and category images are also shown on about-us page
        const projectUrls = [
          getImageUrl(projectFidden),
          getImageUrl(projectFly),
          getImageUrl(projectSearch),
          getImageUrl(projectSeatWave),
          getImageUrl(projectVoice),
          getImageUrl(projectWeout),
        ];

        const categoryUrls = [
          getImageUrl(categoryBullet),
          getImageUrl(categoryFidden),
          getImageUrl(categorySearchforce),
          getImageUrl(categorySeatWaves),
          getImageUrl(categoryWeout),
          getImageUrl(categoryWeoutSvg),
        ];

        [aboutMainUrl, aboutUsUrl, ...projectUrls, ...categoryUrls].forEach(
          (url) => {
            if (url && typeof url === "string") {
              imageUrls.push(url);
            }
          }
        );

        return imageUrls.length > 0 ? imageUrls : undefined;
      })(),
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: (() => {
        const imageUrls: string[] = [];
        const contactUrls = [
          getImageUrl(contactFiroz),
          getImageUrl(contactImage1),
          getImageUrl(contactImage2),
          getImageUrl(contactImage3),
          getImageUrl(contactImage4),
          getImageUrl(contactLee1),
        ];

        contactUrls.forEach((url) => {
          if (url && typeof url === "string") {
            imageUrls.push(url);
          }
        });

        return imageUrls.length > 0 ? imageUrls : undefined;
      })(),
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: (() => {
        const imageUrls: string[] = [];
        const serviceUrls = [getImageUrl(serviceBg), getImageUrl(servicesBg)];

        // Add all service images from servicesData
        servicesData.forEach((service) => {
          const bgUrl = getImageUrl(service.bgImage);
          const videoUrl = getImageUrl(service.videoImage);
          const iconUrl = getImageUrl(service.icon);

          [bgUrl, videoUrl, iconUrl].forEach((url) => {
            if (url && typeof url === "string") {
              imageUrls.push(url);
            }
          });
        });

        serviceUrls.forEach((url) => {
          if (url && typeof url === "string") {
            imageUrls.push(url);
          }
        });

        return imageUrls.length > 0 ? imageUrls : undefined;
      })(),
    },
    {
      url: `${baseUrl}/microsoft-support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: (() => {
        const imageUrls: string[] = [];
        const msUrls = [
          getImageUrl(microsoftSupportImg),
          getImageUrl(msSupportFlowChart),
          getImageUrl(msSupport),
        ];

        msUrls.forEach((url) => {
          if (url && typeof url === "string") {
            imageUrls.push(url);
          }
        });

        return imageUrls.length > 0 ? imageUrls : undefined;
      })(),
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic service pages with images
  const servicePages: MetadataRoute.Sitemap = servicesData.map((service) => {
    const serviceUrl = `${baseUrl}${service.url}`;
    const imageUrls: string[] = [];

    // Add service background image
    const bgImageUrl = getImageUrl(service.bgImage);
    if (bgImageUrl && typeof bgImageUrl === "string") {
      imageUrls.push(bgImageUrl);
    }

    // Add service video/image
    const videoImageUrl = getImageUrl(service.videoImage);
    if (videoImageUrl && typeof videoImageUrl === "string") {
      imageUrls.push(videoImageUrl);
    }

    // Add service icon
    const iconUrl = getImageUrl(service.icon);
    if (iconUrl && typeof iconUrl === "string") {
      imageUrls.push(iconUrl);
    }

    return {
      url: serviceUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: imageUrls.length > 0 ? imageUrls : undefined,
    };
  });

  return [...staticPages, ...servicePages];
}
