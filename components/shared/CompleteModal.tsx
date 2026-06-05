"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { StarPicker } from "./StarPicker";

interface Props {
  title: string;
  subtitle?: string;
  showFeedback?: boolean;
  feedbackPlaceholder?: string;
  confirmLabel?: string;
  onConfirm: (rating: number, feedback?: string) => void;
  onClose: () => void;
}

export default function CompleteModal({
  title,
  subtitle,
  showFeedback = false,
  feedbackPlaceholder = "What did you think? (optional)",
  confirmLabel = "Mark complete",
  onConfirm,
  onClose,
}: Props) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (rating === 0) return;
    setSaving(true);
    await onConfirm(rating, feedback || undefined);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(44,36,22,0.45)",
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        className="relative rounded-2xl p-6 w-full max-w-sm shadow-xl"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-xl font-medium"
            style={{
              fontFamily: "var(--font-cormorant)",
              color: "var(--primary)",
            }}
          >
            {title}
          </h3>
          <button onClick={onClose} style={{ color: "var(--muted-foreground)" }}>
            <X size={16} />
          </button>
        </div>

        {subtitle && (
          <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
            {subtitle}
          </p>
        )}

        <p
          className="text-xs mb-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          Rate it
        </p>
        <div className="mb-4">
          <StarPicker value={rating} onChange={setRating} size={18} />
        </div>

        {showFeedback && (
          <textarea
            placeholder={feedbackPlaceholder}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={2}
            className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none mb-4"
            style={{
              background: "var(--secondary)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-xs"
            style={{
              background: "var(--secondary)",
              color: "var(--muted-foreground)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={rating === 0 || saving}
            className="flex-1 py-2 rounded-lg text-xs hover:opacity-80 disabled:opacity-40 transition-opacity"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {saving ? "Saving…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
