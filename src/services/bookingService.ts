
interface BookingParams {
  country: string;
  hotelid: string;
  checkin: string;
  checkout: string;
  currency: string;
  kids: number;
  adults: number;
  rooms: number;
}

export const fetchBookingDetails = async (params: BookingParams) => {
  const apiKey = "6576a85d9796563d73e34228401";
  
  // Build query string
  const queryParams = new URLSearchParams({
    country: params.country,
    hotelid: params.hotelid,
    checkin: params.checkin,
    checkout: params.checkout,
    currency: params.currency,
    kids: params.kids.toString(),
    adults: params.adults.toString(),
    rooms: params.rooms.toString(),
    api_key: apiKey
  });

  const response = await fetch(`https://api.makcorps.com/booking?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch booking details');
  }

  return await response.json();
};
