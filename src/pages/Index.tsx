
import { useState } from 'react';
import BookingForm from '@/components/BookingForm';
import BookingResult from '@/components/BookingResult';
import { fetchBookingDetails } from '@/services/bookingService';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResults, setBookingResults] = useState<any>(null);

  const handleBookingSearch = async (formData: {
    country: string;
    hotelid: string;
    checkin: string;
    checkout: string;
    currency: string;
    kids: number;
    adults: number;
    rooms: number;
  }) => {
    setIsLoading(true);
    try {
      const data = await fetchBookingDetails(formData);
      setBookingResults(data);
      toast.success('Booking details fetched successfully!');
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to fetch booking details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-5">
        <h1 className="text-4xl font-bold text-center mb-5">Hotel Booking System 🏨</h1>
        <p className="text-center mb-8">Find the perfect accommodation for your next trip!</p>
        
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_3fr]">
          <div>
            <BookingForm onSubmit={handleBookingSearch} isLoading={isLoading} />
          </div>
          <div>
            <BookingResult results={bookingResults} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
