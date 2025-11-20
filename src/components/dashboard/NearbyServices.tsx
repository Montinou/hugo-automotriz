"use client";

import { useState, useEffect } from "react";
import { findNearbyServices } from "@/app/actions/places";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Phone, Star } from "lucide-react";

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export function NearbyServices() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  useEffect(() => {
    // Check permission status on mount
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermissionStatus(result.state);
        result.onchange = () => {
          setPermissionStatus(result.state);
        };
      });
    }
  }, []);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        // Fetch nearby services
        try {
          const response = await findNearbyServices(latitude, longitude, "car_repair");
          if (response.error) {
            setError("Error al buscar servicios cercanos.");
          } else {
            setPlaces(response.results as Place[]);
          }
        } catch (err) {
          setError("Ocurrió un error inesperado.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("No se pudo obtener tu ubicación. Por favor habilita los permisos.");
        setLoading(false);
      }
    );
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Talleres y Servicios Cercanos
        </CardTitle>
        <CardDescription>
          Encuentra ayuda mecánica cerca de tu ubicación actual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!location ? (
          <div className="text-center py-8 space-y-4">
            <div className="bg-muted/50 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Navigation className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Necesitamos tu ubicación para mostrarte los talleres más cercanos a ti.
            </p>
            <Button onClick={handleGetLocation} disabled={loading}>
              {loading ? "Obteniendo ubicación..." : "Buscar Servicios Cercanos"}
            </Button>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-2">
              <span>Ubicación detectada</span>
              <Button variant="ghost" size="sm" onClick={handleGetLocation} className="h-auto p-0 text-xs">
                Actualizar
              </Button>
            </div>
            
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Cargando servicios...</div>
            ) : places.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No se encontraron servicios cercanos.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {places.slice(0, 6).map((place) => (
                  <div key={place.place_id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors flex flex-col gap-2">
                    <div className="font-medium truncate" title={place.name}>{place.name}</div>
                    <div className="text-xs text-muted-foreground truncate" title={place.vicinity}>{place.vicinity}</div>
                    
                    <div className="flex items-center gap-1 text-xs mt-auto pt-2">
                      {place.rating && (
                        <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded">
                          <Star className="h-3 w-3 fill-current mr-1" />
                          <span>{place.rating}</span>
                          <span className="text-muted-foreground ml-1">({place.user_ratings_total})</span>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 ml-auto" 
                        onClick={() => openInMaps(place.geometry.location.lat, place.geometry.location.lng)}
                        title="Ver en Mapa"
                      >
                        <Navigation className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
