// app/(store)/books/[id]/BookGallery.tsx
"use client";

import { useState } from "react";
import { BookImageLabel } from "@prisma/client";

interface ImageItem {
  id: string;
  imageUrl: string;
  label: BookImageLabel;
}

interface BookGalleryProps {
  coverImage: string | null;
  title: string;
  images: ImageItem[];
}

export function BookGallery({ coverImage, title, images }: BookGalleryProps) {
  // Normalize images array to always include the main cover at index 0
  const allImages = [
    ...(coverImage ? [{ id: "cover", imageUrl: coverImage, label: "FRONT_COVER" as any }] : []),
    ...images,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transformOrigin: "0% 0%" });

  if (allImages.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
        <span className="text-xs font-serif text-slate-400 p-4 text-center">{title}</span>
      </div>
    );
  }

  const activeImage = allImages[activeIndex];

  // Map backend database enums to clean, readable scholarly presentation tabs
  const getLabelText = (label: string) => {
    switch (label) {
      case "FRONT_COVER": return "Front Cover";
      case "BACK_COVER": return "Back Cover";
      case "TABLE_OF_CONTENTS": return "Table of Contents (Index)";
      case "SAMPLE_PAGE": return "Sample Arabic Text Page";
      case "BINDING": return "Binding & Paper Quality";
      case "PUBLISHER_INFO": return "Publisher Apparatus Page";
      default: return "Inside View";
    }
  };

  // Hover loupe magnification calculation logic for desktop inspections
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({ display: "block", transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", transformOrigin: "0% 0%" });
  };

  return (
    <div className="space-y-4">
      {/* Active High-Definition Viewer Frame Area */}
      <div 
        className="aspect-[3/4] w-full bg-white border border-slate-200 rounded-2xl relative overflow-hidden shadow-sm cursor-zoom-in hidden md:block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img 
          src={activeImage.imageUrl} 
          alt={title} 
          className="h-full w-full object-contain p-4"
        />
        {/* Dynamic Zoom Overlay layer */}
        <div 
          className="absolute inset-0 bg-white pointer-events-none transition-transform duration-75"
          style={{
            ...zoomStyle,
            backgroundImage: `url(${activeImage.imageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "220%",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Fallback Static Main Preview for Mobile Touchscreens */}
      <div className="aspect-[3/4] w-full bg-white border border-slate-200 rounded-2xl relative overflow-hidden shadow-sm block md:hidden">
        <img 
          src={activeImage.imageUrl} 
          alt={title} 
          className="h-full w-full object-contain p-4"
        />
      </div>

      {/* Label Identifier Strip */}
      <div className="text-center">
        <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-md border border-slate-200">
          Viewing: {getLabelText(activeImage.label)}
        </span>
      </div>

      {/* Swappable Thumbnail Grid Track */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin snap-x">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-20 bg-white border rounded-xl p-1 flex-shrink-0 cursor-pointer overflow-hidden transition snap-start ${
                idx === activeIndex 
                  ? "border-emerald-700 ring-2 ring-emerald-50" 
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img src={img.imageUrl} alt={img.label} className="w-full h-full object-cover rounded-lg" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
