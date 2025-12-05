import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Fallback cities for when Google API is not configured (Philippines-focused)
const POPULAR_CITIES = [
  { place_id: 'manila', description: 'Manila, Metro Manila, Philippines', structured_formatting: { main_text: 'Manila', secondary_text: 'Metro Manila, Philippines' } },
  { place_id: 'quezon', description: 'Quezon City, Metro Manila, Philippines', structured_formatting: { main_text: 'Quezon City', secondary_text: 'Metro Manila, Philippines' } },
  { place_id: 'makati', description: 'Makati, Metro Manila, Philippines', structured_formatting: { main_text: 'Makati', secondary_text: 'Metro Manila, Philippines' } },
  { place_id: 'cebu', description: 'Cebu City, Cebu, Philippines', structured_formatting: { main_text: 'Cebu City', secondary_text: 'Cebu, Philippines' } },
  { place_id: 'davao', description: 'Davao City, Davao del Sur, Philippines', structured_formatting: { main_text: 'Davao City', secondary_text: 'Davao del Sur, Philippines' } },
  { place_id: 'baguio', description: 'Baguio, Benguet, Philippines', structured_formatting: { main_text: 'Baguio', secondary_text: 'Benguet, Philippines' } },
  { place_id: 'iloilo', description: 'Iloilo City, Iloilo, Philippines', structured_formatting: { main_text: 'Iloilo City', secondary_text: 'Iloilo, Philippines' } },
  { place_id: 'bacolod', description: 'Bacolod, Negros Occidental, Philippines', structured_formatting: { main_text: 'Bacolod', secondary_text: 'Negros Occidental, Philippines' } },
  { place_id: 'cagayan', description: 'Cagayan de Oro, Misamis Oriental, Philippines', structured_formatting: { main_text: 'Cagayan de Oro', secondary_text: 'Misamis Oriental, Philippines' } },
  { place_id: 'zamboanga', description: 'Zamboanga City, Zamboanga del Sur, Philippines', structured_formatting: { main_text: 'Zamboanga City', secondary_text: 'Zamboanga del Sur, Philippines' } },
  { place_id: 'new_york', description: 'New York, NY, USA', structured_formatting: { main_text: 'New York', secondary_text: 'NY, USA' } },
  { place_id: 'los_angeles', description: 'Los Angeles, CA, USA', structured_formatting: { main_text: 'Los Angeles', secondary_text: 'CA, USA' } },
  { place_id: 'london', description: 'London, UK', structured_formatting: { main_text: 'London', secondary_text: 'UK' } },
  { place_id: 'singapore', description: 'Singapore', structured_formatting: { main_text: 'Singapore', secondary_text: 'Singapore' } },
  { place_id: 'tokyo', description: 'Tokyo, Japan', structured_formatting: { main_text: 'Tokyo', secondary_text: 'Japan' } },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  // If Google API key is configured, use Google Places API
  if (GOOGLE_API_KEY) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${GOOGLE_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ predictions: data.predictions || [] });
      }
    } catch (error) {
      console.error('Google Places API error:', error);
    }
  }

  // Fallback: Filter popular cities based on query
  const normalizedQuery = query.toLowerCase();
  const filteredCities = POPULAR_CITIES.filter(city =>
    city.description.toLowerCase().includes(normalizedQuery) ||
    city.structured_formatting.main_text.toLowerCase().includes(normalizedQuery)
  ).slice(0, 8);

  return NextResponse.json({ predictions: filteredCities });
}
