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

const popularIndianDestinations = [
  "Delhi",
  "Mumbai",
  "Jaipur",
  "Agra",
  "Varanasi",
  "Goa",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Bengaluru",
  "Amritsar",
  "Rishikesh",
  "Udaipur",
  "Shimla",
  "Darjeeling",
  "Kochi",
  "Pune",
  "Ahmedabad",
  "Mysore",
  "Chandigarh",
  "Lucknow",
  "Bhopal",
  "Srinagar",
  "Thiruvananthapuram",
  "Madurai",
  "Pushkar",
  "Coimbatore",
  "Leh",
  "Gangtok",
  "Ooty"
];

const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number>(1);
  const [budget, setBudget] = useState<string>('');
  const [travelers, setTravelers] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Append ", India" if not already present
    const formattedDestination = destination.includes("India") 
      ? destination 
      : `${destination}, India`;
    
    onSubmit({
      destination: formattedDestination,
      days,
      budget,
      travelers
    });
  };

  const filteredSuggestions = popularIndianDestinations.filter(
    dest => dest.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Tell Us Your India Travel Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="destination">Where in India do you want to go?</Label>
          <div className="flex items-center relative">
            <MapPin className="absolute left-3 text-gray-500" size={18} />
            <Input
              id="destination"
              className="pl-10"
              placeholder="Enter Indian destination"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              required
            />
          </div>
          
          {showSuggestions && destination.length > 0 && (
            <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 max-h-48 overflow-y-auto w-full max-w-[calc(50%-3rem)]">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setDestination(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No suggestions found</div>
              )}
            </div>
          )}
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
                <SelectItem value="cheap">Budget - Under ₹2,000/day</SelectItem>
                <SelectItem value="moderate">Standard - ₹2,000-₹5,000/day</SelectItem>
                <SelectItem value="luxury">Premium - Above ₹5,000/day</SelectItem>
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
          {isLoading ? 'Generating Itinerary...' : 'Generate India Itinerary'}
        </Button>
      </form>
    </div>
  );
};

export default TravelForm;
