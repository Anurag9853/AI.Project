
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, DollarSign, Users, Activity, Hotel, CloudSun } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

interface ItineraryResultProps {
  results: {
    destination: string;
    days: number;
    budget: string;
    travelers: string;
    activities: string[];
    hostels?: Hostel[];
    attractions?: Attraction[];
    weather?: Weather;
  } | null;
  isLoading: boolean;
}

const ItineraryResult = ({ results, isLoading }: ItineraryResultProps) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold mb-3">Your Travel Itinerary</h2>
        <p className="text-gray-500">
          Fill out your travel preferences to generate a customized itinerary.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Itinerary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Your Customized Itinerary</CardTitle>
              <CardDescription>Personalized travel plan for your trip to {results.destination}</CardDescription>
            </div>
            {results.weather && (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <CloudSun className="text-blue-500" size={20} />
                  <span className="font-medium">{results.weather.temperature}°C</span>
                </div>
                <span className="text-sm text-gray-500">{results.weather.condition}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-500" size={20} />
              <span><strong>Destination:</strong> {results.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-blue-500" size={20} />
              <span><strong>Duration:</strong> {results.days} days</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="text-blue-500" size={20} />
              <span><strong>Budget:</strong> {results.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-blue-500" size={20} />
              <span><strong>Traveling with:</strong> {results.travelers.replace('-', ' ')}</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Activity className="text-blue-500" size={20} />
              Suggested Activities:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              {results.activities && results.activities.map((activity: string, index: number) => (
                <li key={index} className="text-gray-700">{activity}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Hostels Section */}
      {results.hostels && results.hostels.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Hotel className="text-blue-500" size={20} />
            Recommended Accommodations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.hostels.map((hostel, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={hostel.imageUrl} 
                    alt={hostel.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{hostel.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                        {hostel.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">Rating</span>
                    </div>
                    <div className="font-semibold">
                      {hostel.price} {hostel.currency}
                      <span className="text-sm text-gray-500 ml-1">/ night</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Attractions Section */}
      {results.attractions && results.attractions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <MapPin className="text-blue-500" size={20} />
            Top Attractions in {results.destination}
          </h3>
          <div className="space-y-4">
            {results.attractions.map((attraction, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{attraction.name}</CardTitle>
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {attraction.rating.toFixed(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{attraction.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryResult;
