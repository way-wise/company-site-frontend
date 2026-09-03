import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import RestaurentNavbar from "@/components/modules/restaurent/RestaurentNavbar";
import RestaurentBanner from "@/components/modules/restaurent/RestaurentBanner";
import RestaurentFoodBusiness from "@/components/modules/restaurent/RestaurentFoodBusiness";
import RestaurentGuestExperience from "@/components/modules/restaurent/RestaurentGuestExperience";
import RestaurentScaleFaster from "@/components/modules/restaurent/RestaurentScaleFaster";
import RestaurentGrowDigitally from "@/components/modules/restaurent/RestaurentGrowDigitally";
import RestaurentPricing from "@/components/modules/restaurent/RestaurentPricing";
import RestaurentProjects from "@/components/modules/restaurent/RestaurentProjects";

export const metadata: Metadata = {
  // Self-referencing canonical. Without it this page inherits the root layout's
  // alternates.canonical, which points at the homepage.
  alternates: {
    canonical: absoluteUrl("/restaurent"),
  },
};

const RestaurentPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <RestaurentNavbar />
      <RestaurentBanner />
      <RestaurentFoodBusiness />
      <RestaurentGuestExperience />
      <RestaurentScaleFaster />
      <RestaurentGrowDigitally />
      <RestaurentPricing />
      <RestaurentProjects />
    </main>
  );
};

export default RestaurentPage;
