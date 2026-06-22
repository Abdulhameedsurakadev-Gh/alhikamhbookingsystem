// app/(store)/books/[id]/BookGallery.tsx
"use client";

import { useState, useEffect } from "react";
import { BookImageLabel } from "@prisma/client";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transformOrigin: "0% 0%" });

  // Auto-rotate carousel every 5 seconds (unless paused or hovering)
  useEffect(() => {
    if (!isAutoRotating || isHovering || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, isHovering, allImages.length]);

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
      case "FRONT_COVER":
        return "Front Cover";
      case "BACK_COVER":
        return "Back Cover";
      case "TABLE_OF_CONTENTS":
        return "Table of Contents (Index)";
      case "SAMPLE_PAGE":
        return "Sample Arabic Text Page";
      case "BINDING":
        return "Binding & Paper Quality";
      case "PUBLISHER_INFO":
        return "Publisher Apparatus Page";
      default:
        return "Inside View";
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

  // Navigation handlers
  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setIsAutoRotating(false); // Pause auto-rotate when user manually navigates
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
    setIsAutoRotating(false); // Pause auto-rotate when user manually navigates
  };

  const handleThumbnailClick = (idx: number) => {
    setActiveIndex(idx);
    setIsAutoRotating(false); // Pause auto-rotate when user manually selects
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  return (
    <div className="space-y-4">
      {/* Active High-Definition Viewer Frame Area with Auto-Rotate */}
      <div
        className="aspect-[3/4] w-full bg-white border border-slate-200 rounded-2xl relative overflow-hidden shadow-sm cursor-zoom-in hidden md:block group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { handleMouseLeave(); setIsHovering(false); }}
        onMouseEnter={() => setIsHovering(true)}
      >
        <img
          src={activeImage.imageUrl}
          alt={title}
          className="h-full w-full object-contain p-4 transition-all duration-300"
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

        {/* Navigation Arrows - Show on hover */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Auto-rotate Control Button - Top right corner */}
        {allImages.length > 1 && (
          <button
            onClick={toggleAutoRotate}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            title={isAutoRotating ? "Pause auto-rotate" : "Resume auto-rotate"}
          >
            {isAutoRotating ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Fallback Static Main Preview for Mobile Touchscreens */}
      <div className="aspect-[3/4] w-full bg-white border border-slate-200 rounded-2xl relative overflow-hidden shadow-sm block md:hidden">
        <img
          src={activeImage.imageUrl}
          alt={title}
          className="h-full w-full object-contain p-4"
        />

        {/* Mobile Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-slate-900 p-1.5 rounded-full shadow-md z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-slate-900 p-1.5 rounded-full shadow-md z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Carousel Indicators Dots */}
      {allImages.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {allImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === activeIndex
                  ? "h-2.5 w-2.5 bg-emerald-700"
                  : "h-1.5 w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Label Identifier Strip with Slide Counter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-md border border-slate-200">
            Viewing: {getLabelText(activeImage.label)}
          </span>
        </div>
        {allImages.length > 1 && (
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
            {activeIndex + 1} of {allImages.length}
          </span>
        )}
      </div>

      {/* Swappable Thumbnail Grid Track */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin snap-x">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => handleThumbnailClick(idx)}
              className={`w-16 h-20 bg-white border rounded-xl p-1 flex-shrink-0 cursor-pointer overflow-hidden transition snap-start ${
                idx === activeIndex
                  ? "border-emerald-700 ring-2 ring-emerald-50 shadow-md"
                  : "border-slate-200 hover:border-slate-400"
              }`}
              title={getLabelText(img.label)}
            >
              <img
                src={img.imageUrl}
                alt={img.label}
                className="w-full h-full object-cover rounded-lg"
              />
            </button>
          ))}
        </div>
      )}

      {/* Auto-rotate Status Indicator */}
      {allImages.length > 1 && (
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                isAutoRotating && !isHovering ? "bg-emerald-600 animate-pulse" : "bg-slate-300"
              }`}
            />
            {isAutoRotating && !isHovering ? "Auto-rotating" : "Manual mode"}
          </span>
        </div>
      )}
    </div>
  );
}