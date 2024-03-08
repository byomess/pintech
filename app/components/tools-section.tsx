import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTools } from '@/hooks/useTools';
import { useDraggableScroll } from '@/hooks/useDraggableScroll';

export type ToolsSectionProps = {};

export const ToolsSection: React.FC<ToolsSectionProps> = ({
}) => {
  const { ref } = useDraggableScroll();
  const searchElementRef = useRef<HTMLInputElement>(null);

  const {
    setToolsSearchTerm,
    toggleFavorite,
    filteredTools,
  } = useTools(); 

  return (
    <div className="w-full lg:w-9/12 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 hidden sm:block">pintech</h1>
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
            <div key={tool.name} className="break-inside-avoid p-4 bg-gray-700 rounded-lg shadow-md border border-solid border-gray-600 hover:border-white flex flex-col mb-4 overflow-hidden">
              <div className="relative flex items-start space-x-4">
                {tool.logoPath && (
                  <a target="_blank" href={tool.url}>
                    <Image src={tool.logoPath} alt={`${tool.name} logo`} className="w-16 h-16 flex-shrink-0" width={256} height={256} />
                  </a>
                )}
                <div className="min-w-0 flex-1">
                  <a target="_blank" href={tool.url}><h2 className="text-lg font-medium text-white truncate">{tool.name}</h2></a>
                  <div ref={ref} className="cursor-grab flex mt-2 overflow-auto hide-scrollbar gap-1" style={{ whiteSpace: 'nowrap' }}>
                    {tool.tags.map((tag, index) => (
                      <div key={index} className="text-xs whitespace-nowrap py-1 px-2 rounded-md bg-gray-800 text-gray-300">
                        {tag.trim()}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(tool.name);
                  }}
                  className={`absolute top-0 right-0 transition duration-300 ease-in-out transform hover:scale-110 ${tool.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                  aria-label={tool.isFavorite ? 'Unfavorite' : 'Favorite'}
                  style={{ transformOrigin: 'center' }}
                >
                  {tool.isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                      <path d="M12 .587l3.668 7.431 8.332 1.209-6.001 5.85 1.416 8.265L12 18.896l-7.415 3.9 1.416-8.265-6.001-5.85 8.332-1.209L12 .587z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24px" height="24px">
                      <path d="M12 .587l3.668 7.431 8.332 1.209-6.001 5.85 1.416 8.265L12 18.896l-7.415 3.9 1.416-8.265-6.001-5.85 8.332-1.209L12 .587z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-gray-300 text-sm overflow-hidden">
                {tool.description?.["pt-br"]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
