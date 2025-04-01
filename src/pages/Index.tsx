
import { useState } from 'react';
import TravelForm from '@/components/TravelForm';
import ItineraryResult from '@/components/ItineraryResult';
import { fetchItineraryDetails } from '@/services/itineraryService';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [itineraryResults, setItineraryResults] = useState<any>(null);

  const handleItinerarySearch = async (formData: {
    destination: string;
    days: number;
    budget: string;
    travelers: string;
  }) => {
    setIsLoading(true);
    try {
      const data = await fetchItineraryDetails(formData);
      setItineraryResults(data);
      toast.success('Travel itinerary fetched successfully!');
    } catch (error) {
      console.error('Error fetching itinerary details:', error);
      toast.error('Failed to fetch itinerary details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-5">
        <h1 className="text-4xl font-bold text-center mb-5">Travel Itinerary Planner 🏕️🌴</h1>
        <p className="text-center mb-8">Find the perfect plan for your next adventure!</p>
        
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_3fr]">
          <div>
            <TravelForm onSubmit={handleItinerarySearch} isLoading={isLoading} />
          </div>
          <div>
            <ItineraryResult results={itineraryResults} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
