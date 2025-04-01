
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MapPin, Calendar, DollarSign, Users } from "lucide-react";

interface TravelFormProps {
  onSubmit: (formData: {
    destination: string;
    days: number;
    budget: string;
    travelers: string;
  }) => void;
  isLoading: boolean;
}

const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number>(1);
  const [budget, setBudget] = useState<string>('');
  const [travelers, setTravelers] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      destination,
      days,
      budget,
      travelers
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Tell Us Your Travel Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="destination">Where do you want to go?</Label>
          <div className="flex items-center relative">
            <MapPin className="absolute left-3 text-gray-500" size={18} />
            <Input
              id="destination"
              className="pl-10"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="days">How many days are you planning?</Label>
          <div className="flex items-center relative">
            <Calendar className="absolute left-3 text-gray-500" size={18} />
            <Input
              id="days"
              type="number"
              className="pl-10"
              placeholder="Number of days"
              min={1}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">What is your budget?</Label>
          <div className="flex items-center relative">
            <DollarSign className="absolute left-3 text-gray-500 z-10" size={18} />
            <Select onValueChange={setBudget} required>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cheap">Cheap - Stay conscious of costs</SelectItem>
                <SelectItem value="moderate">Moderate - Keep cost on the average side</SelectItem>
                <SelectItem value="luxury">Luxury - Don't worry about cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Who will you be traveling with?</Label>
          <div className="flex items-center relative">
            <Users className="absolute left-3 text-gray-500 z-10" size={18} />
            <Select onValueChange={setTravelers} required>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select travelers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="just-me">Just Me - A sole traveler in exploration</SelectItem>
                <SelectItem value="couple">A Couple - Two travelers in tandem</SelectItem>
                <SelectItem value="family">Family - A group of fun-loving adventurers</SelectItem>
                <SelectItem value="friends">Friends - A bunch of thrill-seekers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Generating Itinerary...' : 'Generate Itinerary'}
        </Button>
      </form>
    </div>
  );
};

export default TravelForm;
