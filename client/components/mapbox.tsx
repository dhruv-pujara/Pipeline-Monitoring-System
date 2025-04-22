"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function MapboxPipelineMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-114.0719, 51.0447], // Default to Calgary
      zoom: 9,
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] rounded-md shadow border"
    />
  );
}
