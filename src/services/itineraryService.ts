
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

// Mock data for Indian destinations
const mockItineraryData = (params: ItineraryParams): ItineraryData => {
  // Extract just the city name without ", India" for better readability
  const cityName = params.destination.replace(/, India$/i, '');
  
  const activities = {
    cheap: [
      `Free walking tour of ${cityName}`,
      `Visit public parks and gardens in ${cityName}`,
      `Explore local markets in ${cityName}`,
      `Temple visits around ${cityName}`,
      `Street food tasting in ${cityName}`
    ],
    moderate: [
      `Guided tour of ${cityName}'s main attractions`,
      `Visit popular museums and historical sites in ${cityName}`,
      `Try local cuisine at mid-range restaurants in ${cityName}`,
      `Day trip to nearby attractions from ${cityName}`,
      `Cultural shows or performances in ${cityName}`
    ],
    luxury: [
      `Private guided tour of ${cityName}`,
      `Fine dining experiences at top-rated restaurants in ${cityName}`,
      `Luxury spa treatments in ${cityName}`,
      `Private tours of historical sites in ${cityName}`,
      `VIP access to exclusive attractions in ${cityName}`
    ]
  };

  // Select activities based on budget
  const budgetKey = params.budget as keyof typeof activities;
  const selectedActivities = activities[budgetKey] || activities.moderate;

  // Mock hostel data with Indian names
  const mockHostels: Hostel[] = [
    {
      name: `${cityName} Heritage Stay`,
      rating: 4.2,
      price: params.budget === 'cheap' ? 800 : params.budget === 'moderate' ? 1500 : 3000,
      currency: 'INR',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isMock: true
    },
    {
      name: `${cityName} Palace Hotel`,
      rating: 4.5,
      price: params.budget === 'cheap' ? 1000 : params.budget === 'moderate' ? 2000 : 4000,
      currency: 'INR',
      imageUrl: 'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isMock: true
    },
    {
      name: `${cityName} Traveller's Inn`,
      rating: 4.3,
      price: params.budget === 'cheap' ? 1200 : params.budget === 'moderate' ? 2500 : 5000,
      currency: 'INR',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isMock: true
    }
  ];

  // Mock attraction data for Indian locations
  const mockAttractions: Attraction[] = [
    {
      name: `${cityName} Heritage Museum`,
      description: `Learn about the rich history of ${cityName} and its cultural significance in India`,
      rating: 4.6,
      isMock: true
    },
    {
      name: `${cityName} Temple Complex`,
      description: `Experience the spiritual traditions in ${cityName}, one of India's most sacred sites`,
      rating: 4.8,
      isMock: true
    },
    {
      name: `${cityName} Cultural Center`,
      description: `Experience the local culture and traditions of ${cityName}, showcasing India's diverse heritage`,
      rating: 4.4,
      isMock: true
    }
  ];

  // Mock weather data (typical Indian weather)
  const mockWeather: Weather = {
    temperature: 28,
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

// Function to fetch weather data from Indian Meteorological Department API-equivalent public data
const fetchWeatherData = async (destination: string): Promise<Weather | null> => {
  try {
    console.log("Fetching weather data for Indian location:", destination);
    
    // First get coordinates for destination using Nominatim but restrict to India
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&countrycodes=in`, 
      { headers: { "Accept-Language": "en" } }
    );
    
    if (!geocodeResponse.ok) {
      console.error("Geocoding API request failed for Indian location:", await geocodeResponse.text());
      throw new Error('Geocoding API request failed');
    }
    
    const geocodeData = await geocodeResponse.json();
    console.log("Geocode data for Indian location:", geocodeData);
    
    if (!geocodeData || geocodeData.length === 0) {
      console.error("Location not found in India:", destination);
      throw new Error('Location not found in India');
    }
    
    const { lat, lon } = geocodeData[0];
    console.log("Coordinates for Indian location:", lat, lon);
    
    // Use Open-Meteo for weather (free, no API key)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
      { headers: { "Accept": "application/json" } }
    );
    
    if (!weatherResponse.ok) {
      console.error("Weather API request failed for Indian location:", await weatherResponse.text());
      throw new Error('Weather API request failed');
    }
    
    const weatherData = await weatherResponse.json();
    console.log("Weather data for Indian location:", weatherData);
    
    if (!weatherData || !weatherData.current) {
      console.error("Invalid weather data for Indian location");
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
    
    // Generate appropriate icon URL based on condition for Indian weather
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
    
    console.log("Indian weather result:", {
      temperature: weatherData.current.temperature_2m,
      condition: condition,
      icon: iconUrl
    });
    
    return {
      temperature: weatherData.current.temperature_2m,
      condition: condition,
      icon: iconUrl,
      isMock: false
    };
  } catch (error) {
    console.error('Error fetching weather data for Indian location:', error);
    return null;
  }
};

// Function to fetch hotels data using OpenStreetMap and Overpass API specifically for Indian locations
const fetchHostelsData = async (destination: string, budget: string): Promise<Hostel[] | null> => {
  try {
    console.log("Fetching hotels for Indian location:", destination);
    
    // First get location coordinates using Nominatim restricted to India
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&countrycodes=in`,
      { headers: { "Accept-Language": "en" } }
    );
    
    if (!geoResponse.ok) {
      console.error("Geo API request failed for Indian location:", await geoResponse.text());
      throw new Error('Geo API request failed');
    }
    
    const geoData = await geoResponse.json();
    console.log("Geocode data for Indian hotels:", geoData);
    
    if (!geoData || geoData.length === 0) {
      console.error("Location not found in India for hotels:", destination);
      throw new Error('Invalid geo data');
    }
    
    const { lat, lon } = geoData[0];
    console.log("Indian hotel search coordinates:", lat, lon);
    
    // Use Overpass API to query for Indian accommodations
    // Define the search radius based on budget
    const radius = budget === 'cheap' ? 5000 : budget === 'moderate' ? 10000 : 15000;
    
    // Query for tourism=hotel, tourism=hostel, and tourism=guest_house in India
    const overpassQuery = `
      [out:json];
      (
        node["tourism"="hotel"](around:${radius},${lat},${lon});
        node["tourism"="hostel"](around:${radius},${lat},${lon});
        node["tourism"="guest_house"](around:${radius},${lat},${lon});
      );
      out body 5;
    `;
    
    const overpassResponse = await fetch(
      `https://overpass-api.de/api/interpreter`, 
      {
        method: 'POST',
        body: overpassQuery,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    
    if (!overpassResponse.ok) {
      console.error("Overpass API request failed for Indian hotels:", await overpassResponse.text());
      throw new Error('Accommodation API request failed');
    }
    
    const overpassData = await overpassResponse.json();
    console.log("Overpass API response for Indian hotels:", overpassData);
    
    if (!overpassData || !overpassData.elements || !Array.isArray(overpassData.elements)) {
      console.error("Invalid Indian accommodation data structure");
      throw new Error('Invalid accommodation data');
    }
    
    // Process the results into our hostel format for Indian hotels
    const hostels: Hostel[] = [];
    const elements = overpassData.elements.filter(el => el.tags && el.tags.name);
    
    for (let i = 0; i < Math.min(5, elements.length); i++) {
      const element = elements[i];
      const tags = element.tags;
      
      // Calculate price based on budget and star rating for Indian hotels (in INR)
      let basePrice = budget === 'cheap' ? 1500 : budget === 'moderate' ? 3000 : 6000;
      if (tags.stars) {
        basePrice = basePrice * (parseInt(tags.stars) / 2);
      }
      
      const priceVariation = Math.random() * 500 - 250; // -250 to +250 INR
      const price = Math.max(800, Math.floor(basePrice + priceVariation));
      
      // Generate rating based on stars or random for realistic values for Indian hotels
      let rating = 3.0;
      if (tags.stars) {
        rating = parseFloat(tags.stars) / 5 * 5; // Convert to 5-star scale
      } else {
        rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1)); // Between 3.5 and 5.0
      }
      
      // Use Wikimedia Commons image if available, otherwise use Unsplash
      // Specifically looking for Indian hotel images
      let imageUrl = `https://source.unsplash.com/featured/?india,hotel,${encodeURIComponent(tags.name || destination)}&sig=${i}`;
      
      hostels.push({
        name: tags.name || `${destination} Accommodation`,
        rating: rating,
        price: price,
        currency: 'INR', // Always INR for Indian hotels
        imageUrl: imageUrl,
        isMock: false
      });
    }
    
    console.log("Generated Indian hotel data:", hostels);
    
    // If we couldn't get enough hostels, fill up with generated ones but mark as mock
    if (hostels.length === 0) {
      console.log("No hotels found in India, generating mock data");
      throw new Error('No hotels found in India');
    }
    
    return hostels;
  } catch (error) {
    console.error('Error fetching hotels data for Indian location:', error);
    return null;
  }
};

// Function to fetch attractions data using OpenStreetMap and Overpass API specifically for Indian locations
const fetchAttractionsData = async (destination: string): Promise<Attraction[] | null> => {
  try {
    console.log("Fetching attractions for Indian location:", destination);
    
    // First get location coordinates using Nominatim restricted to India
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&countrycodes=in`,
      { headers: { "Accept-Language": "en" } }
    );
    
    if (!geoResponse.ok) {
      console.error("Geo API request failed for Indian attractions:", await geoResponse.text());
      throw new Error('Geo API request failed');
    }
    
    const geoData = await geoResponse.json();
    console.log("Geocode data for Indian attractions:", geoData);
    
    if (!geoData || geoData.length === 0) {
      console.error("Location not found in India for attractions:", destination);
      throw new Error('Invalid geo data');
    }
    
    const { lat, lon } = geoData[0];
    console.log("Indian attraction search coordinates:", lat, lon);
    
    // Use Overpass API to query for popular attractions in India
    const radius = 15000; // 15km radius
    const overpassQuery = `
      [out:json];
      (
        node["tourism"="attraction"](around:${radius},${lat},${lon});
        node["historic"](around:${radius},${lat},${lon});
        node["tourism"="museum"](around:${radius},${lat},${lon});
        node["leisure"="park"](around:${radius},${lat},${lon});
        node["tourism"="viewpoint"](around:${radius},${lat},${lon});
        node["amenity"="place_of_worship"](around:${radius},${lat},${lon}); // For temples, mosques, etc.
      );
      out body 5;
    `;
    
    const overpassResponse = await fetch(
      `https://overpass-api.de/api/interpreter`, 
      {
        method: 'POST',
        body: overpassQuery,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    
    if (!overpassResponse.ok) {
      console.error("Overpass API request failed for Indian attractions:", await overpassResponse.text());
      throw new Error('Attractions API request failed');
    }
    
    const overpassData = await overpassResponse.json();
    console.log("Overpass API response for Indian attractions:", overpassData);
    
    if (!overpassData || !overpassData.elements || !Array.isArray(overpassData.elements)) {
      console.error("Invalid Indian attractions data structure");
      throw new Error('Invalid attractions data');
    }
    
    // Process the results into our attractions format for Indian locations
    const attractions: Attraction[] = [];
    const elements = overpassData.elements.filter(el => el.tags && el.tags.name);
    
    for (let i = 0; i < Math.min(5, elements.length); i++) {
      const element = elements[i];
      const tags = element.tags;
      
      // Generate description based on available tags with Indian context
      let description = "";
      if (tags.description) {
        description = tags.description;
      } else if (tags.historic) {
        description = `Historic ${tags.historic} in ${destination}, showcasing India's rich heritage.`;
      } else if (tags.tourism === 'museum') {
        description = `A fascinating museum in ${destination} displaying important Indian cultural artifacts.`;
      } else if (tags.leisure === 'park') {
        description = `A beautiful park in ${destination}, perfect for experiencing Indian nature.`;
      } else if (tags.amenity === 'place_of_worship') {
        description = `A sacred ${tags.religion || 'religious'} site in ${destination}, important to Indian spiritual traditions.`;
      } else {
        description = `A popular attraction in ${destination}, visited by many tourists exploring India's wonders.`;
      }
      
      attractions.push({
        name: tags.name || `${destination} Attraction`,
        description: description,
        rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)), // Rating between 4.0 and 5.0
        isMock: false
      });
    }
    
    console.log("Generated Indian attraction data:", attractions);
    
    // If we couldn't get enough attractions, signal this
    if (attractions.length === 0) {
      console.log("No attractions found in India, will use mock data");
      throw new Error('No attractions found in India');
    }
    
    return attractions;
  } catch (error) {
    console.error('Error fetching attractions data for Indian location:', error);
    return null;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchItineraryDetails = async (params: ItineraryParams): Promise<ItineraryData> => {
  // Make sure destination ends with ", India" for better search results
  const destination = params.destination.includes("India") 
    ? params.destination 
    : `${params.destination}, India`;
  
  const updatedParams = { ...params, destination };
  
  // Start with a basic itinerary structure
  let itineraryData: ItineraryData = {
    destination: updatedParams.destination,
    days: updatedParams.days,
    budget: updatedParams.budget,
    travelers: updatedParams.travelers,
    activities: []
  };
  
  // Generate activities based on budget for Indian travel
  const activities = {
    cheap: [
      `Free walking tour of ${updatedParams.destination}`,
      `Visit public parks and gardens in ${updatedParams.destination}`,
      `Explore local markets in ${updatedParams.destination}`,
      `Temple visits around ${updatedParams.destination}`,
      `Street food tasting in ${updatedParams.destination}`
    ],
    moderate: [
      `Guided tour of ${updatedParams.destination}'s main attractions`,
      `Visit popular museums and historical sites in ${updatedParams.destination}`,
      `Try local cuisine at mid-range restaurants in ${updatedParams.destination}`,
      `Day trip to nearby attractions from ${updatedParams.destination}`,
      `Cultural shows or performances in ${updatedParams.destination}`
    ],
    luxury: [
      `Private guided tour of ${updatedParams.destination}`,
      `Fine dining experiences at top-rated restaurants in ${updatedParams.destination}`,
      `Luxury spa treatments in ${updatedParams.destination}`,
      `Private tours of historical sites in ${updatedParams.destination}`,
      `VIP access to exclusive attractions in ${updatedParams.destination}`
    ]
  };
  
  // Select activities based on budget
  const budgetKey = updatedParams.budget as keyof typeof activities;
  itineraryData.activities = activities[budgetKey] || activities.moderate;
  itineraryData.activities = itineraryData.activities.slice(0, Math.min(updatedParams.days + 2, itineraryData.activities.length));
  
  try {
    console.log("Starting to fetch real data for Indian destination");
    
    // Fetch all external data in parallel with small delay between each to prevent rate limiting
    const weatherPromise = fetchWeatherData(updatedParams.destination);
    await delay(300); // Small delay to prevent rate limiting
    
    const hostelsPromise = fetchHostelsData(updatedParams.destination, updatedParams.budget);
    await delay(300); // Small delay to prevent rate limiting
    
    const attractionsPromise = fetchAttractionsData(updatedParams.destination);
    
    // Wait for all promises with timeout to prevent hanging if any API is slow
    const weatherResult = await Promise.race([
      weatherPromise,
      new Promise<null>((resolve) => setTimeout(() => {
        console.log("Weather API timeout for Indian location");
        resolve(null);
      }, 5000))
    ]);
    
    const hostelsResult = await Promise.race([
      hostelsPromise,
      new Promise<null>((resolve) => setTimeout(() => {
        console.log("Hotels API timeout for Indian location");
        resolve(null);
      }, 5000))
    ]);
    
    const attractionsResult = await Promise.race([
      attractionsPromise,
      new Promise<null>((resolve) => setTimeout(() => {
        console.log("Attractions API timeout for Indian location");
        resolve(null);
      }, 5000))
    ]);
    
    // Update itinerary with real data where available
    if (weatherResult) {
      console.log("Using real weather data for Indian location");
      itineraryData.weather = weatherResult;
    } else {
      console.log("Using mock weather data for Indian location");
      // Use mock weather as fallback
      const mockData = mockItineraryData(updatedParams);
      itineraryData.weather = mockData.weather;
    }
    
    if (hostelsResult && hostelsResult.length > 0) {
      console.log("Using real hotel data for Indian location");
      itineraryData.hostels = hostelsResult;
    } else {
      console.log("Using mock hotel data for Indian location");
      // Use mock hostels as fallback
      const mockData = mockItineraryData(updatedParams);
      itineraryData.hostels = mockData.hostels;
    }
    
    if (attractionsResult && attractionsResult.length > 0) {
      console.log("Using real attraction data for Indian location");
      itineraryData.attractions = attractionsResult;
    } else {
      console.log("Using mock attraction data for Indian location");
      // Use mock attractions as fallback
      const mockData = mockItineraryData(updatedParams);
      itineraryData.attractions = mockData.attractions;
    }
    
    return itineraryData;
    
  } catch (error) {
    console.error('Error in fetchItineraryDetails for Indian location:', error);
    
    // In case of any errors, return mock data
    console.log("Error occurred, using mock data for Indian location");
    const mockData = mockItineraryData(updatedParams);
    return mockData;
  }
};
