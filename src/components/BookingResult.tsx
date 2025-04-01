
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BookingResultProps {
  results: any | null;
  isLoading: boolean;
}

const BookingResult = ({ results, isLoading }: BookingResultProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hotel Booking Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Enter your booking details to see available options.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Options</CardTitle>
      </CardHeader>
      <CardContent>
        {results && results.rooms && results.rooms.length > 0 ? (
          <div className="space-y-4">
            {results.rooms.map((room: any, index: number) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-4">
                  <div className="font-medium">{room.name || 'Room Option'}</div>
                  <p className="text-muted-foreground mb-2">{room.description || 'No description available'}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold">Price:</span> {results.currency || 'USD'} {room.price || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Capacity:</span> {room.capacity || 'N/A'} guests
                    </div>
                    <div>
                      <span className="font-semibold">Room Type:</span> {room.type || 'Standard'}
                    </div>
                    <div>
                      <span className="font-semibold">Availability:</span> {room.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p>No rooms available for the selected criteria.</p>
        )}
        
        {results && results.hotel && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Hotel Information</h3>
            <p className="font-semibold">{results.hotel.name || 'Hotel name not available'}</p>
            <p className="text-sm text-muted-foreground">{results.hotel.address || 'Address not available'}</p>
            {results.hotel.rating && (
              <div className="flex items-center mt-1">
                <span className="text-sm mr-1">Rating:</span>
                <div className="flex">
                  {[...Array(Math.floor(results.hotel.rating))].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingResult;
