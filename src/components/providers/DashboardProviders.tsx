"use client";

import { ReactNode } from "react";
import { PricingModalProvider } from "@/contexts/PricingModalContext";
import type { PlanType } from "@/app/actions/subscription";

interface DashboardProvidersProps {
  children: ReactNode;
  userPlan: PlanType;
}

export function DashboardProviders({ children, userPlan }: DashboardProvidersProps) {
  return (
    <PricingModalProvider initialPlan={userPlan}>
      {children}
    </PricingModalProvider>
  );
}
