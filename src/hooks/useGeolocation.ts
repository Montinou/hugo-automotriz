import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: "Geolocalización no soportada", loading: false }));
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const error = (error: GeolocationPositionError) => {
      setState(s => ({ ...s, error: error.message, loading: false }));
    };

    navigator.geolocation.getCurrentPosition(success, error);
    
    const watchId = navigator.geolocation.watchPosition(success, error);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
