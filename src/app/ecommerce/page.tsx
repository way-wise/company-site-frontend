import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import EcommerceNavbar from "@/components/modules/ecommerce/EcommerceNavbar";
import EcommerceBanner from "@/components/modules/ecommerce/EcommerceBanner";
import EcommerceIndustries from "@/components/modules/ecommerce/EcommerceIndustries";
import EcommerceConnected from "@/components/modules/ecommerce/EcommerceConnected";
import EcommercePackages from "@/components/modules/ecommerce/EcommercePackages";
import EcommerceOurWork from "@/components/modules/ecommerce/EcommerceOurWork";
import EcommerceThreePhases from "@/components/modules/ecommerce/EcommerceThreePhases";
import EcommerceFooter from "@/components/modules/ecommerce/EcommerceFooter";

export const metadata: Metadata = {
  // Self-referencing canonical. Without it this page inherits the root layout's
  // alternates.canonical, which points at the homepage.
  alternates: {
    canonical: absoluteUrl("/ecommerce"),
  },
};

const EcommercePage = () => {
  return (
    <main className="min-h-screen bg-white">
      <EcommerceNavbar />
      <EcommerceBanner />
      <EcommerceIndustries />
      <EcommerceConnected />
      <EcommercePackages />
      <EcommerceOurWork />
      <EcommerceThreePhases />
      <EcommerceFooter />
    </main>
  );
};

export default EcommercePage;
