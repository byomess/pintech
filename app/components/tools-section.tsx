"use client";

import React, { useRef, useState, Suspense, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { FaStar, FaRegStar } from "react-icons/fa";

import { useTools } from "@/contexts/tools-context";
import AutoScrollContent from "./auto-scroll-content";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";

export type ToolsSectionProps = {};

const ToolCard: React.FC<{
  name: string;
  logoPath?: string;
  url: string;
  tags: string[];
  freeOffer?: string;
  description?: Record<string, any>;
  isFavorite?: boolean;
  inactive?: boolean;
  ref?: React.RefObject<HTMLDivElement | null>;
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
  locale,
  toggleFavorite,
}) => {
  const { ref: draggableScrollRef } = useDraggableScroll();
  return (
    <div
      key={name}
      className="break-inside-avoid p-4 bg-gray-700 rounded-lg shadow-md border border-solid border-gray-600 hover:border-white flex flex-col mb-4 overflow-hidden"
    >
      <div className="flex items-start space-x-4">
        {logoPath && (
          <div className="flex-shrink-0">
            <a target="_blank" href={url}>
              <Image
                src={logoPath}
                alt={`${name} logo`}
                className="w-16 h-16"
                width={256}
                height={256}
              />
            </a>
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <a target="_blank" href={url} className="overflow-hidden">
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
              className={`min-w-6 min-h-6 ml-2 transition duration-300 ease-in-out transform hover:scale-110 ${isFavorite ? "text-red-500" : "text-gray-400"}`}
              aria-label={isFavorite ? "Unfavorite" : "Favorite"}
            >
              {isClient && isFavorite ? (
                <FaStar size="1.5rem" className="text-rose-600" />
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
        {description?.[locale]}
      </p>
    </div>
  );
};

const _ToolsSection: React.FC<ToolsSectionProps> = () => {
  const [isClient, setIsClient] = useState(false);
  const searchElementRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const [locale, setLocale] = useState<string>(() => {
    const localePropNames = ["lang", "language", "locale"];
    const localeParam =
      localePropNames.find((propName) => searchParams.has(propName)) || "";
    return searchParams.get(localeParam) || "en-us";
  });

  const { setToolsSearchTerm, toggleFavorite, filteredTools } = useTools();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full lg:w-9/12 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 hidden sm:block">
          <span className="text-rose-600">pin</span>tech
        </h1>
        <div className="mb-4">
          <input
            ref={searchElementRef}
            type="text"
            placeholder="Search tools..."
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
            onChange={(e) => setToolsSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:columns-3 sm:columns-2 columns-1 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.name}
              {...tool}
              isClient={isClient}
              locale={locale}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ToolsSection: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <_ToolsSection />
    </Suspense>
  );
};
