import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import MicrosoftSupportDetails from "@/components/modules/services/MicrosoftSupportDetails";
import PageHeader from "@/components/shared/PageHeader";
import { getDynamicMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	return getDynamicMetadata("microsoft-support", {
		// Kept under Google's ~561px SERP title limit (546px in Arial 20px).
		title: "Microsoft M365 Customer Support Services | Way Wise Tech",
		// 144 chars — under Google's ~155-char meta description limit.
		description:
			"Microsoft M365 customer support services by Way Wise Tech. Expert Microsoft support, troubleshooting and technical assistance for your business.",
		keywords: [
			"microsoft support services",
			"microsoft m365 support",
			"microsoft customer support",
			"microsoft technical support",
			"m365 support services",
			"microsoft office support",
			"microsoft support company",
			"microsoft help desk",
		],
		path: "/microsoft-support",
	});
}

const MicrosoftSupportPage = () => {
  return (
    <main>
      <PageHeader
        titleAs="h1"
        title="Microsoft Support"
        description="Services"
        titleClass="text-white text-5xl lg:text-[85px] font-bold"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <MicrosoftSupportDetails />
      <Feadback />
      <ContactUs />
    </main>
  );
};

export default MicrosoftSupportPage;

