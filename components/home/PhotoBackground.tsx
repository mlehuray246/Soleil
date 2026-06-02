"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
          className="absolute inset-0 transition-opacity duration-2000"
          style={{ opacity: i === current ? 0.18 : 0 }}
        >
          <Image
            src={photo.url}
            alt={photo.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
      {/* warm cream overlay so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(245,240,232,0.55) 0%, rgba(245,240,232,0.85) 100%)",
        }}
      />
    </div>
  );
}
