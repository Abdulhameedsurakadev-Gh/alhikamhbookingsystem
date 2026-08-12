// app/(store)/books/[id]/BookGallery.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { BookImageLabel } from "@prisma/client";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// The synthesized "cover" entry isn't a real BookImage row — the front
// cover lives on Book.coverImage, separate from the BookImage relation.
// BookImageLabel genuinely has no FRONT_COVER member (checked against the
// real schema), so this is a UI-only label type, not a database mismatch
// to paper over with `as any`.
type GalleryLabel = BookImageLabel | "FRONT_COVER";

interface ImageItem {
  id: string;
  imageUrl: string;
  label: GalleryLabel;
}

interface BookGalleryProps {
  coverImage: string | null;
  title: string;
  images: ImageItem[];
}

export function BookGallery({ coverImage, title, images }: BookGalleryProps) {
  const allImages: ImageItem[] = useMemo(
    () => [
      ...(coverImage ? [{ id: "cover", imageUrl: coverImage, label: "FRONT_COVER" as GalleryLabel }] : []),
      ...images,
    ],
    [coverImage, images]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transformOrigin: "0% 0%" });

  useEffect(() => {
    if (!isAutoRotating || isHovering || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, isHovering, allImages.length]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setIsAutoRotating(false);
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
    setIsAutoRotating(false);
  }, [allImages.length]);

  // Keyboard navigation — left/right arrows move through the gallery
  useEffect(() => {
    if (allImages.length <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allImages.length, handlePrevious, handleNext]);

  if (allImages.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-muted rounded-xl flex items-center justify-center border border-border">
        <span className="text-xs font-serif text-muted-foreground p-4 text-center">{title}</span>
      </div>
    );
  }

  const activeImage = allImages[activeIndex];

  const getLabelText = (label: GalleryLabel) => {
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({ display: "block", transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", transformOrigin: "0% 0%" });
  };

  const handleThumbnailClick = (idx: number) => {
    setActiveIndex(idx);
    setIsAutoRotating(false);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  return (
    <div className="space-y-4">
      {/* Desktop Viewer — treated as a feature image per Border Radius
          ("xl — hero/feature images"), unlike most other surfaces */}
      <div
        className="aspect-[3/4] w-full bg-background border border-border rounded-xl relative overflow-hidden cursor-zoom-in hidden md:block group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { handleMouseLeave(); setIsHovering(false); }}
        onMouseEnter={() => setIsHovering(true)}
      >
        <Image
          src={activeImage.imageUrl}
          alt={title}
          fill
          className="object-contain p-4 transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Zoom loupe overlay — not an <img>, this is a CSS background-image
            trick for the magnifier effect, so next/image doesn't apply here */}
        <div
          className="absolute inset-0 bg-background pointer-events-none transition-transform duration-75"
          style={{
            ...zoomStyle,
            backgroundImage: `url(${activeImage.imageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "220%",
            backgroundRepeat: "no-repeat",
          }}
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}

        {allImages.length > 1 && (
          <button
            onClick={toggleAutoRotate}
            className="absolute top-4 right-4 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            title={isAutoRotating ? "Pause auto-rotate" : "Resume auto-rotate"}
          >
            {isAutoRotating ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Viewer */}
      <div className="aspect-[3/4] w-full bg-background border border-border rounded-xl relative overflow-hidden block md:hidden">
        <Image
          src={activeImage.imageUrl}
          alt={title}
          fill
          className="object-contain p-4"
          sizes="100vw"
          priority
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 text-foreground p-1.5 rounded-full shadow-subtle z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 text-foreground p-1.5 rounded-full shadow-subtle z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Indicator Dots */}
      {allImages.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {allImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === activeIndex
                  ? "h-2.5 w-2.5 bg-primary"
                  : "h-1.5 w-1.5 bg-border hover:bg-border-hover"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Label Strip */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <span className="inline-block bg-secondary text-secondary-foreground text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-sm">
            Viewing: {getLabelText(activeImage.label)}
          </span>
        </div>
        {allImages.length > 1 && (
          <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap">
            {activeIndex + 1} of {allImages.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => handleThumbnailClick(idx)}
              className={`w-16 h-20 bg-background border rounded-sm p-1 flex-shrink-0 cursor-pointer overflow-hidden transition-colors duration-fast snap-start relative ${
                idx === activeIndex
                  ? "border-primary ring-2 ring-secondary"
                  : "border-border hover:border-border-hover"
              }`}
              title={getLabelText(img.label)}
            >
              <Image
                src={img.imageUrl}
                alt={getLabelText(img.label)}
                fill
                className="object-cover rounded-sm"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Auto-rotate Status */}
      {allImages.length > 1 && (
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                isAutoRotating && !isHovering ? "bg-primary animate-pulse" : "bg-border"
              }`}
            />
            {isAutoRotating && !isHovering ? "Auto-rotating" : "Manual mode"}
          </span>
        </div>
      )}
    </div>
  );
}