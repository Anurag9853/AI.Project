
interface ItineraryParams {
  destination: string;
  days: number;
  budget: string;
  travelers: string;
}

export const fetchItineraryDetails = async (params: ItineraryParams) => {
  const apiKey = "67eb8d31350030f6709d15f0";
  
  // Build query string
  const queryParams = new URLSearchParams({
    destination: params.destination,
    days: params.days.toString(),
    budget: params.budget,
    travelers: params.travelers,
    api_key: apiKey
  });

  const response = await fetch(`https://api.example.com/getItinerary?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch itinerary details');
  }

  const data = await response.json();
  
  // Check if the API returned valid data
  if (data && data.itinerary) {
    return data.itinerary;
  } else {
    throw new Error('No itinerary found for the given preferences.');
  }
};
