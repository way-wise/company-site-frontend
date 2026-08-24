import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import AttorneyTopBar from "@/components/modules/attorney/AttorneyTopBar";
import AttorneyNavbar from "@/components/modules/attorney/AttorneyNavbar";
import AttorneyBanner from "@/components/modules/attorney/AttorneyBanner";
import AttorneyStats from "@/components/modules/attorney/AttorneyStats";
import AttorneyBuiltFor from "@/components/modules/attorney/AttorneyBuiltFor";
import AttorneyMarquee from "@/components/modules/attorney/AttorneyMarquee";
import AttorneyWork from "@/components/modules/attorney/AttorneyWork";
import AttorneyWhyUs from "@/components/modules/attorney/AttorneyWhyUs";
import AttorneyProcess from "@/components/modules/attorney/AttorneyProcess";
import AttorneyPricing from "@/components/modules/attorney/AttorneyPricing";
import AttorneyInsights from "@/components/modules/attorney/AttorneyInsights";
import AttorneyReviews from "@/components/modules/attorney/AttorneyReviews";
import AttorneyFaq from "@/components/modules/attorney/AttorneyFaq";
import AttorneyCta from "@/components/modules/attorney/AttorneyCta";
import AttorneyFooter from "@/components/modules/attorney/AttorneyFooter";

export const metadata: Metadata = {
  title: "Law Firm Websites & Client Portals | Way Wise Tech",
  description:
    "Way Wise Tech creates professional websites and secure client portals for law firms, helping attorneys attract clients and improve efficiency.",
  keywords: [
    "law firm website design",
    "attorney website development",
    "client portal for law firms",
    "legal software development",
  ],
  // Self-referencing canonical. Without it this page inherits the root layout's
  // alternates.canonical, which points at the homepage.
  alternates: {
    canonical: absoluteUrl("/attorney"),
  },
};

const AttorneyPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <AttorneyTopBar />
      <AttorneyNavbar />
      <AttorneyBanner />
      <AttorneyStats />
      <AttorneyBuiltFor />
      <AttorneyMarquee />
      <AttorneyWork />
      <AttorneyWhyUs />
      <AttorneyProcess />
      <AttorneyPricing />
      <AttorneyInsights />
      <AttorneyReviews />
      <AttorneyFaq />
      <AttorneyCta />
      {/* New sections go above the footer. */}
      <AttorneyFooter />
    </main>
  );
};

export default AttorneyPage;
