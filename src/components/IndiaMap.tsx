
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';

// Temporary access token input for development purposes
const MAPBOX_PUBLIC_TOKEN = 'pk.eyJ1IjoibG92YWJsZWFpIiwiYSI6ImNscmFrMnBjNDA5eTEyanBnbTk3aWRrdWwifQ.I-0-QHJ6SEbASI5QZGFMYA';

interface IndiaMapProps {
  selectedDestination?: string;
}

const IndiaMap = ({ selectedDestination }: IndiaMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [tokenInput, setTokenInput] = React.useState('');
  const [accessToken, setAccessToken] = React.useState(MAPBOX_PUBLIC_TOKEN || '');

  // India's bounding box coordinates - more precisely defined for better focus
  const indiaBounds = [
    [68.1, 6.5],  // Southwest coordinates [lng, lat]
    [97.4, 35.5]  // Northeast coordinates [lng, lat]
  ];

  useEffect(() => {
    if (!mapContainer.current || !accessToken) return;

    // Initialize map focused on India
    mapboxgl.accessToken = accessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      bounds: indiaBounds as mapboxgl.LngLatBoundsLike,
      fitBoundsOptions: { padding: 50 },
      maxZoom: 12,
      minZoom: 3
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add India border highlight
    map.current.on('load', () => {
      if (!map.current) return;
      
      // Show only India on the map
      try {
        map.current.setFilter('country-boundaries', ['==', ['get', 'iso_3166_1'], 'IN']);
      } catch (e) {
        console.log("Could not filter to just India");
      }
    });

    // Clean up on unmount
    return () => {
      map.current?.remove();
    };
  }, [accessToken]);

  // Add marker for selected destination if it exists
  useEffect(() => {
    if (!map.current || !selectedDestination) return;
    
    // Only proceed if the map is loaded
    if (!map.current.isStyleLoaded()) {
      map.current.once('load', () => addDestinationMarker());
    } else {
      addDestinationMarker();
    }

    function addDestinationMarker() {
      if (!map.current || !selectedDestination) return;
      
      // Get coordinates for the destination (only within India)
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedDestination)}&countrycodes=in`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            
            // Remove existing markers if any
            const markers = document.getElementsByClassName('mapboxgl-marker');
            while(markers.length > 0){
              markers[0].remove();
            }
            
            // Create a marker at the location
            new mapboxgl.Marker({ color: '#FF0000' })
              .setLngLat([parseFloat(lon), parseFloat(lat)])
              .addTo(map.current!);
            
            // Center the map on the marker
            map.current!.flyTo({
              center: [parseFloat(lon), parseFloat(lat)],
              zoom: 10,
              essential: true
            });
          }
        })
        .catch(err => console.error('Error getting location in India:', err));
    }
  }, [selectedDestination]);

  const handleTokenSubmit = () => {
    if (tokenInput) {
      setAccessToken(tokenInput);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">India Map View</h2>
      
      {!accessToken ? (
        <div className="space-y-3">
          <p className="text-sm">Please enter your Mapbox public token:</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="pk.eyJ1..."
            />
            <Button onClick={handleTokenSubmit}>Submit</Button>
          </div>
          <p className="text-xs text-gray-500">
            Get your token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
          </p>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200" />
      )}
    </div>
  );
};

export default IndiaMap;
