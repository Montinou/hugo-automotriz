"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { PricingModal } from "@/components/pricing/PricingModal";
import type { PlanType } from "@/app/actions/subscription";

interface PricingModalContextType {
  openPricingModal: (reason?: string) => void;
  closePricingModal: () => void;
  isOpen: boolean;
}

const PricingModalContext = createContext<PricingModalContextType | undefined>(undefined);

interface PricingModalProviderProps {
  children: ReactNode;
  initialPlan?: PlanType;
}

export function PricingModalProvider({ children, initialPlan = "free" }: PricingModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [currentPlan, setCurrentPlan] = useState<PlanType>(initialPlan);

  const openPricingModal = useCallback((reason?: string) => {
    setReason(reason);
    setIsOpen(true);
  }, []);

  const closePricingModal = useCallback(() => {
    setIsOpen(false);
    setReason(undefined);
  }, []);

  return (
    <PricingModalContext.Provider value={{ openPricingModal, closePricingModal, isOpen }}>
      {children}
      <PricingModal
        open={isOpen}
        onOpenChange={setIsOpen}
        currentPlan={currentPlan}
        reason={reason}
      />
    </PricingModalContext.Provider>
  );
}

export function usePricingModal() {
  const context = useContext(PricingModalContext);
  if (context === undefined) {
    throw new Error("usePricingModal must be used within a PricingModalProvider");
  }
  return context;
}
