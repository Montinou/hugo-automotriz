"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  isLoading?: boolean;
  onSubscribe: () => Promise<void>;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  isPopular = false,
  isCurrentPlan = false,
  isLoading = false,
  onSubscribe,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col transition-all duration-300 hover:shadow-lg",
        isPopular && "border-primary shadow-md scale-105",
        isCurrentPlan && "border-green-500 bg-green-50/50 dark:bg-green-950/20"
      )}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          Popular
        </Badge>
      )}

      {isCurrentPlan && (
        <Badge variant="outline" className="absolute -top-3 left-1/2 -translate-x-1/2 border-green-500 text-green-600">
          Plan Actual
        </Badge>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold">Bs {price}</span>
          {price > 0 && <span className="text-muted-foreground">/mes</span>}
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          disabled={isCurrentPlan || isLoading}
          onClick={onSubscribe}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : isCurrentPlan ? (
            "Plan Actual"
          ) : price === 0 ? (
            "Comenzar Gratis"
          ) : (
            "Suscribirse"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
