import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import RestaurantNavbar from "@/components/modules/restaurant/RestaurantNavbar";
import RestaurantBanner from "@/components/modules/restaurant/RestaurantBanner";
import RestaurantFoodBusiness from "@/components/modules/restaurant/RestaurantFoodBusiness";
import RestaurantGuestExperience from "@/components/modules/restaurant/RestaurantGuestExperience";
import RestaurantScaleFaster from "@/components/modules/restaurant/RestaurantScaleFaster";
import RestaurantGrowDigitally from "@/components/modules/restaurant/RestaurantGrowDigitally";
import RestaurantPricing from "@/components/modules/restaurant/RestaurantPricing";
import RestaurantProjects from "@/components/modules/restaurant/RestaurantProjects";
import RestaurantOutcomes from "@/components/modules/restaurant/RestaurantOutcomes";
import RestaurantGrowthPartner from "@/components/modules/restaurant/RestaurantGrowthPartner";
import RestaurantFuture from "@/components/modules/restaurant/RestaurantFuture";
import RestaurantFooter from "@/components/modules/restaurant/RestaurantFooter";

export const metadata: Metadata = {
  // Self-referencing canonical. Without it this page inherits the root layout's
  // alternates.canonical, which points at the homepage.
  alternates: {
    canonical: absoluteUrl("/restaurant"),
  },
};

const RestaurantPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <RestaurantNavbar />
      <RestaurantBanner />
      <RestaurantFoodBusiness />
      <RestaurantGuestExperience />
      <RestaurantScaleFaster />
      <RestaurantGrowDigitally />
      <RestaurantPricing />
      <RestaurantProjects />
      <RestaurantOutcomes />
      <RestaurantGrowthPartner />
      <RestaurantFuture />
      <RestaurantFooter />
    </main>
  );
};

export default RestaurantPage;
