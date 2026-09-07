import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import PlumberNavbar from "@/components/modules/plumber/PlumberNavbar";
import PlumberBanner from "@/components/modules/plumber/PlumberBanner";
import PlumberServices from "@/components/modules/plumber/PlumberServices";
import PlumberWhyChoose from "@/components/modules/plumber/PlumberWhyChoose";
import PlumberPackages from "@/components/modules/plumber/PlumberPackages";
import PlumberProjects from "@/components/modules/plumber/PlumberProjects";
import PlumberWayToGrow from "@/components/modules/plumber/PlumberWayToGrow";
import PlumberBusinessControl from "@/components/modules/plumber/PlumberBusinessControl";
import PlumberBetterWay from "@/components/modules/plumber/PlumberBetterWay";
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
      <PlumberWhyChoose />
      <PlumberPackages />
      <PlumberProjects />
      <PlumberWayToGrow />
      <PlumberBusinessControl />
      <PlumberBetterWay />
      <PlumberFooter />
    </main>
  );
};

export default PlumberPage;
