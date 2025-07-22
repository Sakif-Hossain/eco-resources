import { DEFAULT_MAP_CONFIG } from "@/lib/constants/categories";
import { MapProps } from "@/types/map";
import { useRef, useState, useEffect } from "react";
import MapMarker from "./MapMarker";

interface GoogleMapProps extends MapProps {
  mapId: string;
}

export const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  center,
  zoom,
  resources,
  onResourceClick,
  selectedResource,
  mapId,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const { center: _center, zoom: _zoom, ...restConfig } = DEFAULT_MAP_CONFIG;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      ...restConfig,
      mapId,
    });

    setMap(mapInstance);

    return () => {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
    };
  }, [mapId, center, zoom, markers]);

  useEffect(() => {
    if (!map) return;

    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = resources.map((resource) => {
      const marker = new MapMarker({
        resource,
        map,
        onClick: onResourceClick,
        isSelected: selectedResource?.id === resource.id,
      });

      return marker.getMarker();
    });

    setMarkers(newMarkers);
  }, [map, resources, onResourceClick, selectedResource]);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  return <div ref={mapRef} className="w-full h-full" />;
};
