"use server";

export async function findNearbyServices(lat: number, lng: number, type: string = "car_repair") {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error("GOOGLE_PLACES_API_KEY is not set");
    return { error: "Configuration error" };
  }

  try {
    // Search for places nearby
    // radius is in meters (e.g., 5000 = 5km)
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${apiKey}&language=es`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API Error:", data);
      return { error: "Failed to fetch places" };
    }

    return { results: data.results || [] };
  } catch (error) {
    console.error("Error fetching nearby services:", error);
    return { error: "Internal server error" };
  }
}

export async function getPlacePredictions(input: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return { error: "Configuration error" };

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&language=es&components=country:bo`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places Autocomplete Error:", data);
      return { error: "Failed to fetch predictions" };
    }

    return { predictions: data.predictions || [] };
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return { error: "Internal server error" };
  }
}

export async function getPlaceDetails(placeId: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return { error: "Configuration error" };

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places Details Error:", data);
      return { error: "Failed to fetch details" };
    }

    return { result: data.result };
  } catch (error) {
    console.error("Error fetching details:", error);
    return { error: "Internal server error" };
  }
}
