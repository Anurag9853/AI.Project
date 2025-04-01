
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookingFormProps {
  onSubmit: (data: {
    country: string;
    hotelid: string;
    checkin: string;
    checkout: string;
    currency: string;
    kids: number;
    adults: number;
    rooms: number;
  }) => void;
  isLoading: boolean;
}

const BookingForm = ({ onSubmit, isLoading }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    country: '',
    hotelid: '',
    checkin: '',
    checkout: '',
    currency: 'USD',
    kids: 0,
    adults: 1,
    rooms: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Hotel Rooms</CardTitle>
        <CardDescription>Enter your booking details to search for available rooms.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="hotelid">Hotel ID</Label>
            <Input
              id="hotelid"
              name="hotelid"
              value={formData.hotelid}
              onChange={handleChange}
              placeholder="Enter hotel ID"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin">Check-In Date</Label>
              <Input
                id="checkin"
                name="checkin"
                type="date"
                value={formData.checkin}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkout">Check-Out Date</Label>
              <Input
                id="checkout"
                name="checkout"
                type="date"
                value={formData.checkout}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(value) => handleSelectChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="adults">Adults</Label>
              <Input
                id="adults"
                name="adults"
                type="number"
                min="1"
                value={formData.adults}
                onChange={handleNumberChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="kids">Kids</Label>
              <Input
                id="kids"
                name="kids"
                type="number"
                min="0"
                value={formData.kids}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              <Label htmlFor="rooms">Rooms</Label>
              <Input
                id="rooms"
                name="rooms"
                type="number"
                min="1"
                value={formData.rooms}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search Rooms'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
