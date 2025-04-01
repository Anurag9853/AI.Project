
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, DollarSign, Users, Activity } from "lucide-react";

interface ItineraryResultProps {
  results: any;
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Your Customized Itinerary</h2>
      
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
    </div>
  );
};

export default ItineraryResult;
