export interface ItineraryStop {
  stop: string;
  description: string;
  distance: string;
  icon: string;
}

export interface TourPackage {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  gallery: string[];
  coordinates: [number, number][];
  center: [number, number];
  itinerary: ItineraryStop[];
}

export interface BookingFormData {
  packageId: string;
  packageName: string;
  travelDate: string;
  travelers: number;
  language: "es" | "en";
  fullName: string;
  email: string;
  phone: string;
}
