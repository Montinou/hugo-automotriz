import { getCurrentUserPlan } from "@/app/actions/subscription";
import { PricingPageClient } from "./PricingPageClient";

export default async function PricingPage() {
  const { plan } = await getCurrentUserPlan();

  return <PricingPageClient initialPlan={plan} />;
}
