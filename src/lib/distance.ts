// Haversine formula to calculate distance between two coordinates in meters
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
}

// Convert meters to miles
export function metersToMiles(meters: number): number {
  return meters * 0.000621371;
}

// Format distance for display
export function formatDistance(miles: number): string {
  if (miles < 0.01) {
    // Less than 0.01 miles, show in feet
    const feet = miles * 5280;
    return `${Math.round(feet)} feet`;
  }
  return `${miles.toFixed(2)} miles`;
}
