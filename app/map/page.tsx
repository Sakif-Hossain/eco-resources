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
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
    if (window.innerWidth < 768) {
      setIsPanelOpen(false);
    }
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
    <div className="h-[calc(100vh-64px)] flex relative">
      {/* Mobile bookmark toggle button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`
          md:hidden fixed top-1/2 -translate-y-1/2 z-50 
          bg-white shadow-lg border border-gray-200 hover:bg-gray-50 
          transition-all duration-300 ease-in-out
          ${isPanelOpen ? "left-80" : "left-0"}
          rounded-r-md border-l-0
          px-2 py-4 min-h-[60px] flex items-center
        `}
        aria-label={isPanelOpen ? "Close panel" : "Open panel"}
      >
        <div className="flex flex-col items-center space-y-1">
          <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
          <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
          <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
        </div>
      </button>

      {/* Backdrop for mobile */}
      {isPanelOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Sidebar with resource info */}
      <div
        className={`
          w-80 bg-white shadow-lg flex flex-col z-40
          md:relative md:translate-x-0 md:shadow-lg
          fixed left-0 top-0 h-full transition-transform duration-300 ease-in-out
          ${isPanelOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Fixed header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Sustainable Resources
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {resources.length} locations found
              </p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsPanelOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close panel"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
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
