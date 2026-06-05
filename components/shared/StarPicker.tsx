"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarPicker({
  value,
  onChange,
  size = 16,
}: {
  value: number;
  onChange: (n: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >
          <Star
            size={size}
            fill={(hover || value) >= n ? "var(--accent)" : "none"}
            stroke={(hover || value) >= n ? "var(--accent)" : "var(--border)"}
          />
        </button>
      ))}
    </div>
  );
}

export function StarDisplay({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= value ? "var(--accent)" : "none"}
          stroke={n <= value ? "var(--accent)" : "var(--border)"}
        />
      ))}
    </div>
  );
}
