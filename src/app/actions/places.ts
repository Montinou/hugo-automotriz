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
