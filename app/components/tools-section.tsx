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
import { ResponsiveAdUnit } from "nextjs-google-adsense";

const ITEMS_PER_BATCH = 50;

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
        "break-inside-avoid p-4 bg-gray-700 rounded-lg shadow-md border border-solid flex flex-col mb-4 overflow-hidden",
        isFavorite ? "border-yellow-400 hover:border-yellow-200" : "border-gray-600 hover:border-white"
      )}
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
                className={`min-w-6 min-h-6 ml-2 transition duration-300 ease-in-out transform hover:scale-110 ${isFavorite ? "text-red-500" : "text-gray-400"
                  }`}
                aria-label={isFavorite ? "Unfavorite" : "Favorite"}
              >
                {isClient && isFavorite ? (
                  <FaStar size="1.5rem" className="text-yellow-500" />
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
          {description?.[locale]}
        </p>
      </div>
    );
  };

const _ToolsSection: React.FC = () => {
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
  const [visibleTools, setVisibleTools] = useState(filteredTools.slice(0, ITEMS_PER_BATCH));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setVisibleTools(filteredTools.slice(0, ITEMS_PER_BATCH));
  }, [filteredTools]);


  const loadMoreTools = () => {
    if (visibleTools.length >= filteredTools.length) return;
    setVisibleTools((prev) => [
      ...prev,
      ...filteredTools.slice(prev.length, prev.length + ITEMS_PER_BATCH),
    ]);
  };


  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      console.log("Loading more tools..."); // Depuração
      loadMoreTools();
    }
  };

  return (
    <div
      className="w-full lg:w-9/12 p-4 overflow-y-scroll"
      onScroll={handleScroll}
      style={{ maxHeight: "calc(100vh)", scrollBehavior: "smooth", scrollbarWidth: "thin" }}
    >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 hidden sm:block">
          <span className="text-rose-600">pin</span>tech
        </h1>
        <div className="relative w-full mb-4">
          <input
            ref={searchElementRef}
            type="text"
            placeholder="Search tools..."
            className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 text-white"
            onChange={(e) => setToolsSearchTerm(e.target.value)}
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
          >
            ✕
          </button>
        </div>

        <Masonry
          breakpointCols={{ "default": 3, 1100: 2, 700: 1 }}
          className="flex"
          columnClassName="masonry-column grid-column"

        >
          {/* <ResponsiveAdUnit
            publisherId="pub-8223913407934219"
            slotId="8699990439"
            style={{ display: "block" }}
          /> */}
          <script async data-cfasync="false" src="//pl25076520.profitablecpmrate.com/32e5f16bcf4a534823857f8ef830c334/invoke.js"></script>
          <div id="container-32e5f16bcf4a534823857f8ef830c334"></div>
          <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8223913407934219"
            data-ad-slot="8699990439"
            data-ad-format="fluid"
            data-full-width-responsive="true"
          ></ins>
          {visibleTools.map((tool) => (
            <ToolCard
              key={tool.name}
              {...tool}
              isClient={isClient}
              locale={locale}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </Masonry>
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
