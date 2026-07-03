"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Use for small thumbnails — shrinks the icon and hides the label so it doesn't overflow. */
  compact?: boolean;
}

export default function ProductImage({ src, alt, fill, className = "", sizes, priority, compact }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = failed || !src;

  if (showPlaceholder) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gray-50 text-gray-300 ${
          fill ? "absolute inset-0" : ""
        } ${className}`}
      >
        <ImageOff className={compact ? "w-3.5 h-3.5" : "w-8 h-8"} strokeWidth={1.5} />
        {!compact && <span className="text-[11px] text-gray-400 font-medium">No image available</span>}
      </div>
    );
  }

  return (
    <Image
      src={src as string}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
