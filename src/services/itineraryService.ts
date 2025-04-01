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
  isMock?: boolean;
}

interface Attraction {
  name: string;
  description: string;
  rating: number;
  isMock?: boolean;
}

interface Weather {
  temperature: number;
  condition: string;
  icon: string;
  isMock?: boolean;
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
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isMock: true
    },
    {
      name: `${params.destination} Central Hostel`,
      rating: 4.5,
      price: params.budget === 'cheap' ? 18 : params.budget === 'moderate' ? 35 : 70,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isMock: true
    },
    {
      name: `${params.destination} Traveller's Inn`,
      rating: 4.3,
      price: params.budget === 'cheap' ? 20 : params.budget === 'moderate' ? 40 : 80,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isMock: true
    }
  ];

  // Mock attraction data
  const mockAttractions: Attraction[] = [
    {
      name: `${params.destination} Historical Museum`,
      description: `Learn about the rich history of ${params.destination}`,
      rating: 4.6,
      isMock: true
    },
    {
      name: `${params.destination} Central Park`,
      description: `Enjoy the beautiful nature in the heart of ${params.destination}`,
      rating: 4.8,
      isMock: true
    },
    {
      name: `${params.destination} Cultural Center`,
      description: `Experience the local culture and traditions of ${params.destination}`,
      rating: 4.4,
      isMock: true
    }
  ];

  // Mock weather data
  const mockWeather: Weather = {
    temperature: 22,
    condition: 'Sunny',
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
    isMock: true
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

// Function to fetch weather data from Open-Meteo API (free, no API key required)
const fetchWeatherData = async (destination: string): Promise<Weather | null> => {
  try {
    // First get coordinates for destination using Nominatim (OpenStreetMap's geocoding API - free, no key required)
    const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`);
    
    if (!geocodeResponse.ok) {
      throw new Error('Geocoding API request failed');
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData || geocodeData.length === 0) {
      throw new Error('Location not found');
    }
    
    const { lat, lon } = geocodeData[0];
    
    // Use Open-Meteo for weather (free, no API key)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Weather API request failed');
    }
    
    const weatherData = await weatherResponse.json();
    
    if (!weatherData || !weatherData.current) {
      throw new Error('Invalid weather data');
    }
    
    // Map weather code to condition
    const weatherConditions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    
    // Get weather condition based on code
    const weatherCode = weatherData.current.weather_code;
    const condition = weatherConditions[weatherCode] || 'Unknown';
    
    // Generate appropriate icon URL based on condition
    let iconUrl = 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png'; // default
    
    if (weatherCode === 0) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png'; // sun
    } else if (weatherCode >= 1 && weatherCode <= 3) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/414/414927.png'; // partly cloudy
    } else if (weatherCode >= 45 && weatherCode <= 48) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1197/1197102.png'; // fog
    } else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png'; // rain
    } else if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/642/642102.png'; // snow
    } else if (weatherCode >= 95) {
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1197/1197102.png'; // thunder
    }
    
    return {
      temperature: weatherData.current.temperature_2m,
      condition: condition,
      icon: iconUrl,
      isMock: false
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Function to fetch hostels data using OpenTripMap API (free tier)
const fetchHostelsData = async (destination: string, budget: string): Promise<Hostel[] | null> => {
  try {
    // OpenTripMap API (has a free tier)
    const otmApiKey = '5ae2e3f221c38a28845f05b6e8c9b3f0d87b77fa2fde762c57e2872d'; // This is a public API key for OpenTripMap
    
    // First get location coordinates
    const geoResponse = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(destination)}&apikey=${otmApiKey}`);
    
    if (!geoResponse.ok) {
      throw new Error('Geo API request failed');
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData || !geoData.lat || !geoData.lon) {
      throw new Error('Invalid geo data');
    }
    
    // Get hotel/hostel accommodations near the location
    // Use radius based on budget
    const radius = budget === 'cheap' ? 10000 : budget === 'moderate' ? 15000 : 20000;
    const accommodationResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${geoData.lon}&lat=${geoData.lat}&kinds=accomodations&format=json&apikey=${otmApiKey}`
    );
    
    if (!accommodationResponse.ok) {
      throw new Error('Accommodation API request failed');
    }
    
    const accommodations = await accommodationResponse.json();
    
    if (!accommodations || !Array.isArray(accommodations)) {
      throw new Error('Invalid accommodation data');
    }
    
    // For each accommodation, get more details
    const hostels: Hostel[] = [];
    const limit = Math.min(3, accommodations.length);
    
    for (let i = 0; i < limit; i++) {
      const place = accommodations[i];
      
      // Get place details
      const detailsResponse = await fetch(
        `https://api.opentripmap.com/0.1/en/places/xid/${place.xid}?apikey=${otmApiKey}`
      );
      
      if (detailsResponse.ok) {
        const details = await detailsResponse.json();
        
        // Calculate price based on budget and add some variability
        let basePrice = budget === 'cheap' ? 30 : budget === 'moderate' ? 60 : 120;
        const priceVariation = Math.random() * 20 - 10; // -10 to +10
        const price = Math.max(15, Math.floor(basePrice + priceVariation));
        
        hostels.push({
          name: details.name || `${destination} ${place.kinds.includes('hotels') ? 'Hotel' : 'Hostel'}`,
          rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // Rating between 3.5 and 5.0
          price: price,
          currency: 'USD',
          imageUrl: details.preview?.source || 
                   `https://source.unsplash.com/featured/?hotel,${encodeURIComponent(destination)}&sig=${i}`,
          isMock: false
        });
      }
    }
    
    // If we couldn't get enough hostels, fill up with generated ones
    while (hostels.length < 3) {
      const basePrice = budget === 'cheap' ? 30 : budget === 'moderate' ? 60 : 120;
      const priceVariation = Math.random() * 20 - 10; // -10 to +10
      const price = Math.max(15, Math.floor(basePrice + priceVariation));
      
      hostels.push({
        name: `${destination} ${['Riverside', 'Downtown', 'Central', 'Park', 'Beach'][hostels.length]} Hostel`,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // Rating between 3.5 and 5.0
        price: price,
        currency: 'USD',
        imageUrl: `https://source.unsplash.com/featured/?hotel,${encodeURIComponent(destination)}&sig=${hostels.length + 10}`,
        isMock: true // Mark as mock if we had to generate them
      });
    }
    
    return hostels;
  } catch (error) {
    console.error('Error fetching hostels data:', error);
    return null;
  }
};

// Function to fetch attractions data using OpenTripMap API
const fetchAttractionsData = async (destination: string): Promise<Attraction[] | null> => {
  try {
    // OpenTripMap API (free tier)
    const otmApiKey = '5ae2e3f221c38a28845f05b6e8c9b3f0d87b77fa2fde762c57e2872d'; // This is a public API key for OpenTripMap
    
    // First get location coordinates
    const geoResponse = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(destination)}&apikey=${otmApiKey}`);
    
    if (!geoResponse.ok) {
      throw new Error('Geo API request failed');
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData || !geoData.lat || !geoData.lon) {
      throw new Error('Invalid geo data');
    }
    
    // Get attractions near the location
    const radius = 30000; // 30km radius
    const attractionsResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${geoData.lon}&lat=${geoData.lat}&kinds=cultural,historic,architecture,natural&format=json&limit=10&apikey=${otmApiKey}`
    );
    
    if (!attractionsResponse.ok) {
      throw new Error('Attractions API request failed');
    }
    
    const attractions = await attractionsResponse.json();
    
    if (!attractions || !Array.isArray(attractions)) {
      throw new Error('Invalid attractions data');
    }
    
    // Get details for top attractions
    const attractionResults: Attraction[] = [];
    const limit = Math.min(3, attractions.length);
    
    for (let i = 0; i < limit; i++) {
      const place = attractions[i];
      
      // Get place details
      const detailsResponse = await fetch(
        `https://api.opentripmap.com/0.1/en/places/xid/${place.xid}?apikey=${otmApiKey}`
      );
      
      if (detailsResponse.ok) {
        const details = await detailsResponse.json();
        
        attractionResults.push({
          name: details.name || `${destination} ${['Monument', 'Landmark', 'Museum', 'Park'][i % 4]}`,
          description: details.wikipedia_extracts?.text || 
                      `A popular attraction in ${destination}, known for its historic significance and cultural value.`,
          rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)), // Rating between 4.0 and 5.0
          isMock: false
        });
      }
    }
    
    // Fill with additional attractions if needed
    while (attractionResults.length < 3) {
      attractionResults.push({
        name: `${destination} ${['Castle', 'Cathedral', 'Historic Center', 'National Park', 'Museum'][attractionResults.length % 5]}`,
        description: `One of ${destination}'s most popular attractions, enjoyed by tourists and locals alike.`,
        rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)), // Rating between 4.0 and 5.0
        isMock: true
      });
    }
    
    return attractionResults;
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
