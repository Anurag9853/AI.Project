
interface ItineraryParams {
  destination: string;
  days: number;
  budget: string;
  travelers: string;
}

interface Hostel {
  name: string;
  rating: number;
  price: number;
  currency: string;
  imageUrl: string;
}

interface Attraction {
  name: string;
  description: string;
  rating: number;
}

interface Weather {
  temperature: number;
  condition: string;
  icon: string;
}

interface ItineraryData {
  destination: string;
  days: number;
  budget: string;
  travelers: string;
  activities: string[];
  hostels?: Hostel[];
  attractions?: Attraction[];
  weather?: Weather;
}

// Mock data to use when API is unavailable
const mockItineraryData = (params: ItineraryParams): ItineraryData => {
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

  // Mock hostel data
  const mockHostels: Hostel[] = [
    {
      name: `${params.destination} Backpackers Hostel`,
      rating: 4.2,
      price: params.budget === 'cheap' ? 15 : params.budget === 'moderate' ? 30 : 60,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: `${params.destination} Central Hostel`,
      rating: 4.5,
      price: params.budget === 'cheap' ? 18 : params.budget === 'moderate' ? 35 : 70,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: `${params.destination} Traveller's Inn`,
      rating: 4.3,
      price: params.budget === 'cheap' ? 20 : params.budget === 'moderate' ? 40 : 80,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  // Mock attraction data
  const mockAttractions: Attraction[] = [
    {
      name: `${params.destination} Historical Museum`,
      description: `Learn about the rich history of ${params.destination}`,
      rating: 4.6
    },
    {
      name: `${params.destination} Central Park`,
      description: `Enjoy the beautiful nature in the heart of ${params.destination}`,
      rating: 4.8
    },
    {
      name: `${params.destination} Cultural Center`,
      description: `Experience the local culture and traditions of ${params.destination}`,
      rating: 4.4
    }
  ];

  // Mock weather data
  const mockWeather: Weather = {
    temperature: 22,
    condition: 'Sunny',
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png'
  };

  // Create mock itinerary data
  return {
    destination: params.destination,
    days: params.days,
    budget: params.budget,
    travelers: params.travelers,
    activities: selectedActivities.slice(0, Math.min(params.days + 2, selectedActivities.length)),
    hostels: mockHostels,
    attractions: mockAttractions,
    weather: mockWeather
  };
};

// Function to fetch weather data
const fetchWeatherData = async (destination: string): Promise<Weather | null> => {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=5e647d28acef44a2ac8203007242504&q=${destination}`);
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    
    return {
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      icon: data.current.condition.icon
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Function to fetch hostels data
const fetchHostelsData = async (destination: string, budget: string): Promise<Hostel[] | null> => {
  try {
    // Using Booking.com API through RapidAPI
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3b35ad98c4msh36853e92ebbc3dep1ab0c9jsn8cef1c2fdedc', // This is a public demo API key
        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
      }
    };
    
    // First get destination ID
    const locationResponse = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=en-us&name=${destination}`, options);
    
    if (!locationResponse.ok) {
      throw new Error('Hostels API location request failed');
    }
    
    const locations = await locationResponse.json();
    
    if (!locations || locations.length === 0) {
      throw new Error('No locations found');
    }
    
    const destId = locations[0]?.dest_id;
    
    // Then get hostels
    const hotelsResponse = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/search?checkin_date=2023-09-27&checkout_date=2023-09-28&units=metric&dest_id=${destId}&dest_type=city&room_number=1&adults_number=2&filter_by_currency=USD&locale=en-us&order_by=popularity&page_number=0&categories_filter_ids=204`, options);
    
    if (!hotelsResponse.ok) {
      throw new Error('Hostels API hotels request failed');
    }
    
    const hotelsData = await hotelsResponse.json();
    
    if (!hotelsData || !hotelsData.result) {
      throw new Error('No hostels found');
    }
    
    // Map the results to our Hostel interface
    return hotelsData.result.slice(0, 3).map((hotel: any) => ({
      name: hotel.hotel_name,
      rating: hotel.review_score || 4.0,
      price: hotel.price_breakdown?.gross_price || 
             (budget === 'cheap' ? 20 : budget === 'moderate' ? 40 : 80),
      currency: hotel.price_breakdown?.currency || 'USD',
      imageUrl: hotel.max_photo_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }));
  } catch (error) {
    console.error('Error fetching hostels data:', error);
    return null;
  }
};

// Function to fetch attractions data
const fetchAttractionsData = async (destination: string): Promise<Attraction[] | null> => {
  try {
    // Using TripAdvisor API through RapidAPI
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3b35ad98c4msh36853e92ebbc3dep1ab0c9jsn8cef1c2fdedc', // This is a public demo API key
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    };
    
    // First search for location
    const locationResponse = await fetch(`https://tripadvisor16.p.rapidapi.com/api/v1/locations/search?query=${destination}`, options);
    
    if (!locationResponse.ok) {
      throw new Error('Attractions API location request failed');
    }
    
    const locationData = await locationResponse.json();
    
    if (!locationData?.data || locationData.data.length === 0) {
      throw new Error('No location data found');
    }
    
    const locationId = locationData.data[0]?.locationId;
    
    // Then get attractions
    const attractionsResponse = await fetch(`https://tripadvisor16.p.rapidapi.com/api/v1/attractions/list?locationId=${locationId}&limit=3`, options);
    
    if (!attractionsResponse.ok) {
      throw new Error('Attractions API request failed');
    }
    
    const attractionsData = await attractionsResponse.json();
    
    if (!attractionsData?.data || attractionsData.data.length === 0) {
      throw new Error('No attractions found');
    }
    
    // Map the results to our Attraction interface
    return attractionsData.data.map((attraction: any) => ({
      name: attraction.name,
      description: attraction.description || `A popular attraction in ${destination}`,
      rating: attraction.bubbleRating?.rating || 4.5
    }));
  } catch (error) {
    console.error('Error fetching attractions data:', error);
    return null;
  }
};

export const fetchItineraryDetails = async (params: ItineraryParams): Promise<ItineraryData> => {
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
    
    // Get the base mock itinerary data
    const mockData = mockItineraryData(params);
    
    // Try to enrich with real data
    try {
      // Fetch weather in parallel
      const weatherPromise = fetchWeatherData(params.destination);
      
      // Fetch hostels in parallel
      const hostelsPromise = fetchHostelsData(params.destination, params.budget);
      
      // Fetch attractions in parallel
      const attractionsPromise = fetchAttractionsData(params.destination);
      
      // Wait for all promises to resolve
      const [weather, hostels, attractions] = await Promise.all([
        weatherPromise,
        hostelsPromise,
        attractionsPromise
      ]);
      
      // Enrich mock data with real data where available
      if (weather) mockData.weather = weather;
      if (hostels) mockData.hostels = hostels;
      if (attractions) mockData.attractions = attractions;
    } catch (enrichError) {
      console.error('Error enriching mock data with real APIs:', enrichError);
    }
    
    return mockData;
  }
};
