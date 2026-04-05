"use client";

import { useState, useCallback } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import type { MapMouseEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  marker?: { latitude: number; longitude: number } | null;
  interactive?: boolean;
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

export default function MapboxMap({
  onLocationSelect,
  marker,
  interactive = true,
  initialViewState = {
    latitude: 20,
    longitude: 0,
    zoom: 2,
  },
}: MapboxMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleClick = useCallback(
    (event: MapMouseEvent) => {
      if (!interactive) return;
      const { lat, lng } = event.lngLat;
      onLocationSelect(lat, lng);
    },
    [onLocationSelect, interactive]
  );

  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!mapToken) {
    return (
      <div className="flex items-center justify-center h-full bg-pink-100 rounded-xl">
        <p className="text-pink-800 font-medium">
          Mapbox token not configured. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        mapboxAccessToken={mapToken}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        onClick={handleClick}
        onLoad={() => setMapLoaded(true)}
        dragPan={interactive}
        scrollZoom={interactive}
        doubleClickZoom={interactive}
        dragRotate={false}
        touchZoomRotate={interactive}
      >
        {mapLoaded && marker && (
          <Marker
            latitude={marker.latitude}
            longitude={marker.longitude}
            anchor="bottom"
          >
            <div className="text-4xl animate-bounce drop-shadow-lg">
              🥚
            </div>
          </Marker>
        )}
      </Map>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-50">
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl animate-bounce">🐰</div>
            <p className="text-pink-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
