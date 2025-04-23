"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Pipeline = {
  PipelineID: number;
  Location: string;
  Diameter: number;
  Material: string;
  Status: string;
  InstallationDate: string;
  Longitude: number;
  Latitude: number;
};

export default function MapboxPipelineMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-115.0, 54.0],
      zoom: 5,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", async () => {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("http://localhost:8800/pipelines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const pipelines: Pipeline[] = await res.json();

      pipelines.forEach((p) => {
        const el = document.createElement("div");
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.border = "2px solid white";
        el.style.borderRadius = "50%";
        el.style.cursor = "pointer";

        if (p.Status === "Active") {
          el.style.backgroundColor = "#22c55e";
        } else if (p.Status === "Under Maintenance") {
          el.style.backgroundColor = "#f97316";
        } else {
          el.style.backgroundColor = "#ef4444";
        }

        const html = `
        <div style="font-size:14px; line-height:1.4; width:250px;">
          <div style="
            font-size:18px;
            font-weight:bold;
            text-decoration:underline;
            margin-bottom:8px;
          ">
            Pipeline #${p.PipelineID}
          </div>
          <div><strong>Location:</strong> ${p.Location}</div>
          <div><strong>Diameter:</strong> ${p.Diameter} in</div>
          <div><strong>Material:</strong> ${p.Material}</div>
          <div><strong>Status:</strong> ${p.Status}</div>
          <div><strong>Installed:</strong> ${p.InstallationDate.substring(0,10)}</div>
          <div><strong>Lon:</strong> ${p.Longitude}</div>
          <div><strong>Lat:</strong> ${p.Latitude}</div>
        </div>
      `;
      

        const marker = new mapboxgl.Marker(el)
          .setLngLat([p.Longitude, p.Latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25, maxWidth: "300px" }).setHTML(html))
          .addTo(map);

        el.addEventListener("mouseenter", () => marker.togglePopup());
        el.addEventListener("mouseleave", () => marker.togglePopup());
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} className="absolute inset-0" />
  );
}
