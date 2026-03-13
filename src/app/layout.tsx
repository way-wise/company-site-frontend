import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const baseUrl =
	process.env.NEXT_PUBLIC_BASE_URL ||
	(process.env.NODE_ENV === "production"
		? "https://waywisetech.com"
		: "http://localhost:3000");

export const metadata: Metadata = {
	title: "Web and Software Development Company USA",
	description:
		"Way Wise Tech is a top-rated web development company in the USA, providing custom software development, web app design, and digital solutions for global businesses seeking innovation and reliability.",
	keywords: [
		"web development company",
		"web development firm",
		"custom web development",
		"web development company USA",
		"web development firm USA",
		"ecommerce web development",
		"custom software development",
		"web app development",
		"react js development",
		"node js development",
		"python web development",
		"laravel web development",
		"wordpress development",
		"shopify development",
		"magento development",
		"enterprise web development",
		"offshore web development",
		"best web development company",
		"top web development firm",
	],
	verification: {
		google: "_P7U2RrZRrtu-vgri8bZ0pPBnHiRK99hlp0mh54mpfM",
	},
	authors: [{ name: "Way Wise Tech" }],
	creator: "Way Wise Tech",
	publisher: "Way Wise Tech",
	alternates: {
		canonical: baseUrl,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: baseUrl,
		siteName: "Way Wise Tech",
		title: "Web Development Company USA | Custom Software Solutions",
		description:
			"Way Wise Tech is a top-rated web development company in the USA, providing custom software development, web app design, and digital solutions for global businesses.",
		images: [
			{
				url: `${baseUrl}/_next/static/media/way-wise-logo`,
				width: 1200,
				height: 630,
				alt: "Way Wise Tech - Web Development Company",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Web Development Company USA | Custom Software Solutions",
		description:
			"Top-rated web development company in the USA providing custom software development and digital solutions.",
		images: [`${baseUrl}/_next/static/media/way-wise-logo`],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Google Tag Manager */}
				<Script
					id="google-tag-manager"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NHZ8RNGJ');
            `,
					}}
				/>
				<link
					href="https://assets.calendly.com/assets/external/widget.css"
					rel="stylesheet"
				/>
				<meta name="p:domain_verify" content="1a0ec79e5c7c26286091b5167b64a39d"/>
			</head>
			<body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
				{/* Google Tag Manager (noscript) */}
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-NHZ8RNGJ"
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
					/>
				</noscript>

				<Providers>
					<Toaster position="bottom-right" />
					{children}
					{/* <WhatsAppButton /> */}
				</Providers>

				<Script
					src="https://assets.calendly.com/assets/external/widget.js"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
