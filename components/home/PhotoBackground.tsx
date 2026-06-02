"use client";

import { useEffect, useState } from "react";

interface Photo {
  id: string;
  name: string;
  url: string;
}

export default function PhotoBackground() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then(({ photos }) => setPhotos(photos ?? []));
  }, []);

  useEffect(() => {
    if (!photos.length) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % photos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [photos]);

  if (!photos.length) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 0.22 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
      {/* Warm cream overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(245,240,232,0.5) 0%, rgba(245,240,232,0.82) 100%)",
        }}
      />
    </div>
  );
}
