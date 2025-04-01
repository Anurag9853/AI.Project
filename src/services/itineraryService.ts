
interface ItineraryParams {
  destination: string;
  days: number;
  budget: string;
  travelers: string;
}

// Mock data to use when API is unavailable
const mockItineraryData = (params: ItineraryParams) => {
  const activities = {
    cheap: [
      `Free walking tour of ${params.destination}`,
      `Visit public parks and gardens in ${params.destination}`,
      `Explore local markets in ${params.destination}`,
      `Hiking trails around ${params.destination}`,
      `Visit free museums or attractions in ${params.destination}`
    ],
    moderate: [
      `Guided tour of ${params.destination}'s main attractions`,
      `Visit popular museums and historical sites in ${params.destination}`,
      `Try local cuisine at mid-range restaurants in ${params.destination}`,
      `Day trip to nearby attractions from ${params.destination}`,
      `Cultural shows or performances in ${params.destination}`
    ],
    luxury: [
      `Private guided tour of ${params.destination}`,
      `Fine dining experiences at top-rated restaurants in ${params.destination}`,
      `Luxury spa treatments in ${params.destination}`,
      `Helicopter or private boat tours around ${params.destination}`,
      `VIP access to exclusive attractions in ${params.destination}`
    ]
  };

  // Select activities based on budget
  const budgetKey = params.budget as keyof typeof activities;
  const selectedActivities = activities[budgetKey] || activities.moderate;

  // Create mock itinerary data
  return {
    destination: params.destination,
    days: params.days,
    budget: params.budget,
    travelers: params.travelers,
    activities: selectedActivities.slice(0, Math.min(params.days + 2, selectedActivities.length))
  };
};

export const fetchItineraryDetails = async (params: ItineraryParams) => {
  const apiKey = "67eb8d31350030f6709d15f0";
  
  try {
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
  } catch (error) {
    console.error('Error fetching itinerary details:', error);
    
    // Return mock data instead of throwing the error
    return mockItineraryData(params);
  }
};
