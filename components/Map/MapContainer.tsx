"use client";

import React, { useRef, useEffect, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { MapProps } from "@/types/map";
import LoadingSpinner from "../ui/LoadingSpinner";
import { GoogleMapComponent } from "./GoogleMap";

const MapContainer: React.FC<MapProps> = (props) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
          </p>
        </div>
      </div>
    );
  }

  const render = (status: any) => {
    if (status === "LOADING") {
      return <LoadingSpinner />;
    }
    if (status === "FAILURE") {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-red-600">Failed to load Google Maps</p>
        </div>
      );
    }
    // Always return a valid React element
    return <div />;
  };

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <GoogleMapComponent {...props} mapId="7548d29032546bf48e08cb01" />
    </Wrapper>
  );
};

export default MapContainer;
