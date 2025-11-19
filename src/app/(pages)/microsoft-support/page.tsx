import ContactUs from "@/components/modules/home/ContactUs";
import Feadback from "@/components/modules/home/Feadback";
import MicrosoftSupportDetails from "@/components/modules/services/MicrosoftSupportDetails";
import PageHeader from "@/components/shared/PageHeader";
import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  title: "Microsoft Support Services | M365 Customer Support | Way Wise Tech",
  description:
    "Professional Microsoft M365 customer support services by Way Wise Tech. Expert Microsoft support, troubleshooting, and technical assistance for businesses. Reliable Microsoft support solutions.",
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
  alternates: {
    canonical: `${baseUrl}/microsoft-support`,
  },
  openGraph: {
    type: "website",
    url: `${baseUrl}/microsoft-support`,
    title: "Microsoft Support Services | M365 Customer Support",
    description:
      "Professional Microsoft M365 customer support services. Expert Microsoft support and technical assistance for businesses.",
  },
};

const MicrosoftSupportPage = () => {
  return (
    <main>
      <PageHeader
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

