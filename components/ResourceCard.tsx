"use client";

import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import { Book } from "@/data/books";
import { SaveButton } from "@/components/SaveButton";

interface ResourceCardProps {
  book: Book;
  index?: number;
  variant?: "default" | "featured" | "list" | "case-study";
  isLoggedIn?: boolean;
  initialSaved?: boolean;
  initialLiked?: boolean;
  onAuthRequired?: () => void;
}

export function ResourceCard({
  book,
  index = 0,
  variant = "default",
  isLoggedIn = false,
  initialSaved = false,
  initialLiked = false,
  onAuthRequired = () => {},
}: ResourceCardProps) {
  const [hovered, setHovered] = useState(false);

  const cardColors = ["#E8192C", "#16A34A", "#2563EB"];
  const cardColor = cardColors[index % 3];

  if (variant === "list") {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <div
          className="flex items-center gap-3 p-3 cursor-pointer group"
          onClick={() => window.open(book.link, "_blank", "noopener,noreferrer")}
        >
          {/* Alternating color block */}
          <div
            className="w-10 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
            style={{ background: cardColor }}
          >
            <span className="text-white text-xs font-bold text-center leading-tight px-1">
              {book.title.split(" ")[0].slice(0, 3).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {book.title}
            </h3>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {book.author}
            </p>
            <div className="flex items-center gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={9}
                  style={{
                    color: i < Math.floor(book.rating) ? "var(--brand-primary)" : "var(--text-faint)",
                    fill: i < Math.floor(book.rating) ? "var(--brand-primary)" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <ExternalLink size={13} style={{ color: "var(--text-faint)" }} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="px-3 pb-3">
          <SaveButton
            resource={book}
            isLoggedIn={isLoggedIn}
            initialSaved={initialSaved}
            initialLiked={initialLiked}
            onAuthRequired={onAuthRequired}
          />
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className="rounded-xl overflow-hidden flex-shrink-0"
        style={{
          width: "200px",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        {/* Alternating color tile */}
        <div
          className="relative cursor-pointer"
          style={{ height: "140px", background: cardColor }}
          onClick={() => window.open(book.link, "_blank", "noopener,noreferrer")}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
            <span className="text-white font-bold text-sm leading-tight">{book.title}</span>
            <span className="text-white text-xs mt-1 opacity-80">{book.author}</span>
          </div>
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
              <span className="text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
                Open
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {book.description}
          </p>
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                style={{
                  color: i < Math.floor(book.rating) ? "var(--brand-primary)" : "var(--text-faint)",
                  fill: i < Math.floor(book.rating) ? "var(--brand-primary)" : "transparent",
                }}
              />
            ))}
          </div>
          <SaveButton
            resource={book}
            isLoggedIn={isLoggedIn}
            initialSaved={initialSaved}
            initialLiked={initialLiked}
            onAuthRequired={onAuthRequired}
          />
        </div>
      </div>
    );
  }

  // default
  return (
    <div
      className="rounded-xl overflow-hidden flex-shrink-0"
      style={{
        width: "160px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Alternating color tile */}
      <div
        className="relative cursor-pointer"
        style={{ height: "110px", background: cardColor }}
        onClick={() => window.open(book.link, "_blank", "noopener,noreferrer")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
          <span className="text-white font-bold text-xs leading-tight">{book.title}</span>
          <span className="text-white text-xs mt-1 opacity-80" style={{ fontSize: "10px" }}>{book.author}</span>
        </div>
        {hovered && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
            <span className="text-white text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              Open
            </span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={9}
              style={{
                color: i < Math.floor(book.rating) ? "var(--brand-primary)" : "var(--text-faint)",
                fill: i < Math.floor(book.rating) ? "var(--brand-primary)" : "transparent",
              }}
            />
          ))}
        </div>
        <SaveButton
          resource={book}
          isLoggedIn={isLoggedIn}
          initialSaved={initialSaved}
          initialLiked={initialLiked}
          onAuthRequired={onAuthRequired}
        />
      </div>
    </div>
  );
}
