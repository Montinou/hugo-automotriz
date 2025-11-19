"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WorkshopCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  address: string;
  isOpen: boolean;
  services: string[];
}

export function WorkshopCard({ id, name, image, rating, reviews, address, isOpen, services }: WorkshopCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={isOpen ? "default" : "destructive"}>
            {isOpen ? "Abierto" : "Cerrado"}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {address}
            </div>
          </div>
          <div className="flex items-center bg-secondary px-2 py-1 rounded-md">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-bold text-sm">{rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-1 mt-2">
          {services.slice(0, 3).map((service) => (
            <Badge key={service} variant="outline" className="text-xs">
              {service}
            </Badge>
          ))}
          {services.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{services.length - 3} más
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/dashboard/workshops/${id}`} className="w-full">
          <Button className="w-full">Ver Detalles</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
