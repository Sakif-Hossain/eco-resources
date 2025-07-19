"use client";

import React, { useState, useEffect } from "react";
import MapContainer from "@/components/Map/MapContainer";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { DEFAULT_MAP_CONFIG } from "../../lib/constants/categories";
import { RawResource, Resource, ResourceCategory } from "@/types/resources";
import { CATEGORY_CONFIG } from "../../lib/constants/categories";

export default function Map() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CONFIG.center);
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_CONFIG.zoom);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const googleSheetsURL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
        if (!googleSheetsURL) {
          throw new Error(
            "Google Sheets URL is not defined in environment variables."
          );
        }

        const response = await fetch(googleSheetsURL);
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Fetched data is not an array.");
        }

        for (const item of data) {
          if (typeof item !== "object" || item === null) {
            throw new Error("Each resource must be an object.");
          }
          if (typeof item.id !== "string") {
            throw new Error("Resource 'id' must be a string.");
          }
        }

        const formattedResources: Resource[] = (data as RawResource[]).map(
          (item) => ({
            id: item.id,
            name: item.name,
            category: isValidCategory(item.category)
              ? item.category
              : ResourceCategory.RECYCLING, // fallback
            address: item.address,
            coordinates: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lng),
            },
            phone: item.phone || undefined,
            website: item.website || undefined,
            hours: item.hours || undefined,
            description: item.description || undefined,
            acceptedItems: item.acceptedItems
              ? item.acceptedItems.split(",").map((s) => s.trim())
              : [],
            verified: item.verified === "TRUE" || item.verified === true,
            rating: item.rating ? parseFloat(item.rating) : undefined,
            lastUpdated: new Date(item.lastUpdated),
          })
        );

        console.log("Fetched resources:", formattedResources);
        setResources(formattedResources);
      } catch (error) {
        console.error("Failed to load resources from Google Sheets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setMapCenter(resource.coordinates);
    setMapZoom(15);
  };

  const isValidCategory = (val: string): val is ResourceCategory => {
    return Object.values(ResourceCategory).includes(val as ResourceCategory);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading sustainable resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar with resource info */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Fixed header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            Sustainable Resources
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {resources.length} locations found
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedResource?.id === resource.id
                  ? "ring-2 ring-primary-500 shadow-md"
                  : ""
              }`}
              padding="sm"
              onClick={() => handleResourceClick(resource)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor: CATEGORY_CONFIG[resource.category].color,
                  }}
                >
                  {CATEGORY_CONFIG[resource.category].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {CATEGORY_CONFIG[resource.category].label}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {resource.address}
                  </p>
                  {resource.rating && (
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {resource.rating}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          resources={resources}
          onResourceClick={handleResourceClick}
          selectedResource={selectedResource}
        />
      </div>
    </div>
  );
}
