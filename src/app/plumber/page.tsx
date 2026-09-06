import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import PlumberNavbar from "@/components/modules/plumber/PlumberNavbar";
import PlumberBanner from "@/components/modules/plumber/PlumberBanner";
import PlumberServices from "@/components/modules/plumber/PlumberServices";
import PlumberFooter from "@/components/modules/plumber/PlumberFooter";

export const metadata: Metadata = {
  // Self-referencing canonical. Without it this page inherits the root layout's
  // alternates.canonical, which points at the homepage.
  alternates: {
    canonical: absoluteUrl("/plumber"),
  },
};

const PlumberPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <PlumberNavbar />
      <PlumberBanner />
      <PlumberServices />
      <PlumberFooter />
    </main>
  );
};

export default PlumberPage;
