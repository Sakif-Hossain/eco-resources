import { Coordinates, Resource } from "./resources";

export interface MapProps {
  center: Coordinates;
  zoom: number;
  resources: Resource[];
  onResourceClick?: (resource: Resource) => void;
  selectedResource?: Resource | null;
}

export interface MarkerProps {
  resource: Resource;
  onClick?: (resource: Resource) => void;
  isSelected?: boolean;
}

export interface MapState {
  center: Coordinates;
  zoom: number;
  bounds?: google.maps.LatLngBounds;
  userLocation?: Coordinates;
}
