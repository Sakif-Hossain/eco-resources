import { ResourceCategory } from "@/types/resources";

export const CATEGORY_CONFIG = {
  [ResourceCategory.WAWANESA_HQ]: {
    label: "Wawanesa Mutual Insurance Company",
    color: "#1e40af",
    icon: "𝐖",
    description: "Best Insurance Company in Canada",
  },
  [ResourceCategory.RECYCLING]: {
    label: "Recycling Centers",
    color: "#3b82f6", // Blue
    icon: "♻️",
    description: "Drop-off locations for recyclable materials",
  },
  [ResourceCategory.COMPOST]: {
    label: "Compost Drop-off",
    color: "#059669", // Green
    icon: "🌱",
    description: "Organic waste composting locations",
  },
  [ResourceCategory.ZERO_WASTE]: {
    label: "Zero-Waste Stores",
    color: "#f59e0b", // Orange
    icon: "🏪",
    description: "Refill stations and package-free shopping",
  },
  [ResourceCategory.COMMUNITY_GARDEN]: {
    label: "Community Gardens",
    color: "#10b981", // Emerald
    icon: "🌿",
    description: "Local community growing spaces",
  },
  [ResourceCategory.BIKE_REPAIR]: {
    label: "Bike Repair Stations",
    color: "#ef4444", // Red
    icon: "🔧",
    description: "Bicycle maintenance and repair locations",
  },
  [ResourceCategory.R4_DEPOT]: {
    label: "4R Winnipeg Depot",
    color: "#7FFFD4", // Green
    icon: "♻️",
    description: "Bicycle maintenance and repair locations",
  },
  [ResourceCategory.OUTFIT_REPAIR]: {
    label: "Outfit Repair",
    color: "#964B00", // Brown
    icon: "👔",
    description: "Outfit alteration and shoe repairing locations",
  },
};

export const DEFAULT_MAP_CONFIG = {
  center: { lat: 49.89127360121605, lng: -97.14550127522907 }, // Wawanesa HQ, Winnipeg, MB
  zoom: 14,
  minZoom: 8,
  maxZoom: 18,
  gestureHandling: "greedy" as const,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
};
