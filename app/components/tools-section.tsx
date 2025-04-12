"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useTools } from "@/contexts/tools-context";
import AutoScrollContent from "./auto-scroll-content";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";
import Masonry from "react-masonry-css";
import clsx from "clsx";
import { CustomSelect } from "@/components/custom-select";

const ITEMS_PER_BATCH = 50;

const filterOptions = [
  { value: false, label: "All" },
  { value: true, label: "Favorites" },
];

// --- ToolCard component remains unchanged ---
const ToolCard: React.FC<{
  name: string;
  logoPath?: string;
  url: string;
  tags: string[];
  freeOffer?: string;
  description?: Record<string, any>;
  isFavorite?: boolean;
  inactive?: boolean;
  createdAt?: number;
  isClient: boolean;
  locale: string;
  toggleFavorite: (toolName: string) => void;
}> = ({
  name,
  logoPath,
  url,
  tags,
  freeOffer,
  description,
  isFavorite,
  isClient,
  createdAt,
  locale,
  toggleFavorite,
}) => {
  const { ref: draggableScrollRef } = useDraggableScroll();
  const parsedCreatedAt = createdAt ? new Date(createdAt) : null;
  const isNew = parsedCreatedAt && Date.now() - parsedCreatedAt.getTime() < 30 * 24 * 60 * 60 * 1000;

  return (
    <div
      className={clsx(
        "break-inside-avoid p-4 bg-card-background rounded-lg shadow-md border border-solid flex flex-col mb-4 overflow-hidden",
        isFavorite ? "border-yellow-400 hover:border-yellow-200" : "border-gray-600 hover:border-white"
      )}
    >
      <div className="flex items-start space-x-4">
        {logoPath && (
          <div className="flex-shrink-0">
            <a target="_blank" rel="noopener noreferrer" href={url}> {/* Added rel attribute */}
              <Image
                src={logoPath}
                alt={`${name} logo`}
                className="w-16 h-16"
                width={256} // Provide actual dimensions if known, otherwise use layout="fill" or "responsive"
                height={256} // Provide actual dimensions if known
                // Consider adding priority prop if it's above the fold
              />
            </a>
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <a target="_blank" rel="noopener noreferrer" href={url} className="overflow-hidden"> {/* Added rel attribute */}
              <h2 className="text-lg font-bold text-white">
                <AutoScrollContent>{name}</AutoScrollContent>
              </h2>
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(name);
              }}
              className={`min-w-6 min-h-6 ml-2 transition duration-300 ease-in-out transform hover:scale-110 ${isFavorite ? "text-yellow-500" : "text-gray-400" // Changed favorite color to yellow for consistency
                }`}
              aria-label={isFavorite ? "Unfavorite" : "Favorite"}
            >
              {isClient && isFavorite ? (
                <FaStar size="1.5rem" /> // Keep yellow for filled star
              ) : (
                <FaRegStar size="1.5rem" />
              )}
            </button>
          </div>
          <div
            ref={draggableScrollRef}
            className="cursor-grab active:cursor-grabbing flex flex-1 mt-2 overflow-auto hide-scrollbar gap-1"
            style={{ whiteSpace: "nowrap" }}
          >
            {isNew && (
              <div className="text-xs whitespace-nowrap py-1 px-2 rounded-md bg-yellow-500 text-black">
                <span>new</span>
              </div>
            )}
            {tags.map((tag, index) => (
              <div
                key={index}
                className="text-xs whitespace-nowrap py-1 px-2 rounded-md bg-gray-800 text-gray-300"
              >
                <span>{tag.trim()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-2 text-gray-300 text-sm overflow-hidden">
        {/* Ensure description exists and locale exists within it */}
        {description?.[locale] ?? description?.['en-us'] ?? 'No description available.'}
      </p>
    </div>
  );
};


// Renamed _ToolsSection to ToolsSectionContent and merged logic
const ToolsSectionContent: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const searchElementRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams(); // Call hooks at the top level

  // State for locale depends on searchParams, initialize correctly
  const [locale, setLocale] = useState<string>('en-us'); // Default locale

  const { setToolsSearchTerm, toggleFavorite, filteredTools, showFavoritesOnly, setShowFavoritesOnly } = useTools();
  const [visibleTools, setVisibleTools] = useState(() => filteredTools.slice(0, ITEMS_PER_BATCH)); // Use functional update for initial state based on props/context

  // Effect to set client flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect to update locale based on searchParams *after* client-side mount
  useEffect(() => {
    if (isClient) { // Only run this logic on the client where searchParams are reliable
      const localePropNames = ["lang", "language", "locale"];
      const localeParamKey = localePropNames.find((propName) => searchParams.has(propName));
      const localeValue = localeParamKey ? searchParams.get(localeParamKey) : null;
      setLocale(localeValue || 'en-us');
    }
  }, [searchParams, isClient]); // Re-run if searchParams change

  // Effect to update visible tools when the filtered list changes
  useEffect(() => {
    setVisibleTools(filteredTools.slice(0, ITEMS_PER_BATCH));
  }, [filteredTools]); // Dependency array includes the source of changes


  const loadMoreTools = () => {
    // Check if already loading or no more tools to load
    if (visibleTools.length >= filteredTools.length) return;

    setVisibleTools((prev) => [
      ...prev,
      ...filteredTools.slice(prev.length, prev.length + ITEMS_PER_BATCH),
    ]);
  };


  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Add a small buffer to trigger loading slightly before reaching the absolute bottom
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreTools();
    }
  };

  // Memoize ToolCard rendering if performance becomes an issue,
  // but usually not needed unless list is huge and updates frequently.

  return (
    <div
      className="w-full lg:w-9/12 p-4 overflow-y-scroll"
      onScroll={handleScroll}
      style={{ maxHeight: "calc(100vh)", scrollBehavior: "smooth", scrollbarWidth: "thin" }} // Consider cross-browser scrollbar styling if needed
    >
      <div className="container mx-auto">
        {/* Search Input */}
        <div className="relative w-full mb-4">
          <input
            ref={searchElementRef}
            type="text"
            placeholder="Search tools..."
            className="w-full px-4 py-2 pr-10 rounded-md bg-card-background text-white border border-gray-600 focus:border-blue-500 focus:ring-blue-500 outline-none" // Added border and focus styles
            onChange={(e) => setToolsSearchTerm(e.target.value)}
            aria-label="Search tools" // Added aria-label
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            onClick={() => {
              if (searchElementRef.current) {
                searchElementRef.current.value = "";
                setToolsSearchTerm("");
              }
            }}
            aria-label="Clear search" // Added aria-label
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center mb-8 gap-4">
          <h3 className="text-md font-bold text-white">Filter By:</h3>
          <CustomSelect
            options={filterOptions}
            value={showFavoritesOnly} // Pass the boolean value directly
            onChange={(selectedOptionValue) => {
              // Find the option object if needed, or just use the value
              setShowFavoritesOnly(selectedOptionValue as boolean);
            }}
            className="w-28" // Adjust width as needed
            size="sm"
          />
        </div>

        {/* Tools Grid */}
        <Masonry
          breakpointCols={{ default: 3, 1100: 2, 700: 1 }} // Adjust breakpoints as needed
          className="flex w-full" // Use w-full for flex container
          columnClassName="px-2" // Add padding between columns using columnClassName
        >
          {/* --- Ads Removed for Clarity --- */}
          {visibleTools.length > 0 ? (
             visibleTools.map((tool) => (
              <ToolCard
                key={tool.name} // Use a unique key
                {...tool}
                isClient={isClient}
                locale={locale}
                toggleFavorite={toggleFavorite}
              />
            ))
          ) : (
             <p className="text-gray-400 text-center col-span-full"> {/* Ensure message spans all columns */}
               No tools found matching your criteria.
             </p>
          )}
        </Masonry>

        {/* Loading Indicator (Optional) */}
        {visibleTools.length < filteredTools.length && (
          <div className="text-center text-gray-400 py-4">Loading more...</div>
        )}
      </div>
    </div>
  );
};

// Exported component uses Suspense and renders the correctly named content component
export const ToolsSection: React.FC = () => {
  return (
    // Suspense is often used higher up, around data fetching or code splitting points.
    // If ToolsSectionContent itself doesn't use React.lazy or fetch data triggering Suspense,
    // you might not strictly need it here, but it doesn't hurt.
    <Suspense fallback={<div className="w-full lg:w-9/12 p-4 text-center text-gray-400">Loading Tools...</div>}>
      <ToolsSectionContent />
    </Suspense>
  );
};
