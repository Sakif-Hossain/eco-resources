export enum ResourceCategory {
  RECYCLING = "RECYCLING",
  COMPOST = "COMPOST",
  ZERO_WASTE = "ZERO_WASTE",
  COMMUNITY_GARDEN = "COMMUNITY_GARDEN",
  BIKE_REPAIR = "BIKE_REPAIR",
  WAWANESA_HQ = "WAWANESA_HQ",
  R4_DEPOT = "R4_DEPOT",
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  address: string;
  coordinates: Coordinates;
  phone?: string;
  website?: string;
  hours?: string;
  description?: string;
  acceptedItems?: string[];
  verified: boolean;
  rating?: number;
  lastUpdated: Date;
}

export type RawResource = {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: string;
  lng: string;
  phone?: string;
  website?: string;
  hours?: string;
  description?: string;
  acceptedItems?: string;
  verified?: string | boolean;
  rating?: string;
  lastUpdated: string;
};

export interface FilterState {
  categories: ResourceCategory[];
  searchQuery: string;
  radius: number;
  centerLocation?: Coordinates;
}
