"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import { Tool, useTools } from "@/contexts/tools-context";
import { CustomSelect } from "@/components/custom-select";
import { Tag } from "@/components/tag";

export type TagsSectionProps = {};

const orderByOptions = [
  { value: "mostUsed", label: "Most Used" },
  { value: "alphabetic", label: "Alphabetic" },
];

export const TagsSection: React.FC = () => {
  const searchElementRef = useRef<HTMLInputElement>(null); // Initialize with null
  const {
    tagsOrderBy,
    setTagsOrderBy,
    showAllTags,
    setShowAllTags,
    tagsSearchTerm,
    setTagsSearchTerm,
    selectedTags,
    toggleTagSelection,
    filteredTools,
  } = useTools();

  const tagCounts = useMemo(
    () =>
      filteredTools.reduce((acc: Record<string, any>, tool: Tool) => {
        tool.tags.forEach((tag) => {
          if (!acc[tag]) acc[tag] = 0;
          acc[tag] += 1;
        });
        return acc;
      }, {}),
    [filteredTools],
  );

  const filteredAndSortedTags = useMemo(() => {
    const tags = Object.entries(tagCounts)
      .filter(([tag]) => tag.includes(tagsSearchTerm.toLowerCase()))
      .map(([tag, count]) => ({ tag, count }));

    tags.sort((a, b) =>
      tagsOrderBy === "mostUsed"
        ? b.count - a.count || a.tag.localeCompare(b.tag)
        : a.tag.localeCompare(b.tag),
    );
    return tags.map(({ tag }) => tag);
  }, [tagCounts, tagsSearchTerm, tagsOrderBy]);

  return (
    <div className="w-full lg:w-3/12">
      {/* <h1 className="text-3xl font-bold text-center my-4 block sm:hidden">
        pintech
      </h1> */}
      <div className="bg-background-blue p-4 h-full">
        <div className="flex justify-center md:justify-start items-center mb-4 w-full">
          <a href="/">
            <span className="text-4xl md:text-3xl font-bold text-white">
              <span className="text-green-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]">p</span>in
              <span className="text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]">t</span>ech
            </span>

          </a>
        </div>
        <div className="flex flex-col justify-center w-full border-2 border-solid rounded-md border-gray-700 px-4 pt-4">
          <div className="flex flex-col">
            <input
              ref={searchElementRef}
              type="text"
              placeholder="Search tags..."
              className="w-full mb-4 px-4 py-2 rounded-md bg-card-background text-white"
              onChange={(e) => setTagsSearchTerm(e.target.value)}
            />

            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="text-md font-bold">Sort Tags</h3>
              <CustomSelect
                options={orderByOptions}
                value={tagsOrderBy}
                onChange={(value) =>
                  setTagsOrderBy(value as "mostUsed" | "alphabetic")
                }
                className="min-w-40 w-1/2"
              />
            </div>

            <div className="min-h-56 h-56 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {filteredAndSortedTags
                  .slice(0, showAllTags ? undefined : 10)
                  .map((tag) => (
                    <Tag
                      key={tag}
                      tag={`${tag} (${tagCounts[tag.toLowerCase()]})`}
                      isSelected={selectedTags.includes(tag)}
                      onClick={() => toggleTagSelection(tag)}
                    />
                  ))}
              </div>
            </div>

            <div className="py-4 flex items-center border-t-2 border-solid border-gray-700">
              <button
                className="shadowed-text min-w-40 w-full sm:w-1/2 px-2 text-sm py-1 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:from-blue-400 hover:to-purple-500 transition-colors duration-300 ease-in-out flex items-center justify-center relative"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                <svg
                  className={`absolute left-0 w-6 h-6 transform ${showAllTags ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 8l-4 4h8l-4-4z" />
                </svg>
                {showAllTags
                  ? "Show Less"
                  : `Show ${Object.keys(tagCounts).length - 10} more`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
