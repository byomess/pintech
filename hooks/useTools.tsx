'use client'

import React, { createContext, useState, useEffect, useMemo, useCallback, ReactNode, useRef } from 'react';
import toolsJson from './data.json';

export type Tool = {
    name: string;
    logoPath?: string;
    url: string;
    tags: string[];
    freeOffer?: string;
    description?: Record<string, any>;
    isFavorite?: boolean;
    inactive?: boolean;
};

// Define the context
type ToolsContextType = {
    filteredTools: Tool[];
    toolsSearchTerm: string;
    setToolsSearchTerm: (term: string) => void;
    tagsSearchTerm: string;
    setTagsSearchTerm: (term: string) => void;
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
    showFavoritesOnly: boolean;
    setShowFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>;
    tagsOrderBy: 'mostUsed' | 'alphabetic';
    setTagsOrderBy: React.Dispatch<React.SetStateAction<'mostUsed' | 'alphabetic'>>;
    showAllTags: boolean;
    setShowAllTags: React.Dispatch<React.SetStateAction<boolean>>;
    toggleTagSelection: (tag: string) => void;
    toggleFavorite: (toolName: string) => void;
};

const ToolsContext = createContext<ToolsContextType>({
    filteredTools: [],
    toolsSearchTerm: '',
    setToolsSearchTerm: () => { },
    tagsSearchTerm: '',
    setTagsSearchTerm: () => { },
    selectedTags: [],
    setSelectedTags: () => { },
    showFavoritesOnly: false,
    setShowFavoritesOnly: () => { },
    tagsOrderBy: 'mostUsed',
    setTagsOrderBy: () => { },
    showAllTags: false,
    setShowAllTags: () => { },
    toggleTagSelection: () => { },
    toggleFavorite: () => { },
});

type ToolsProviderProps = {
    children: ReactNode;
};

const preprocessTools = (tools: Tool[], favorites: Set<string>): Tool[] => tools.filter(tool => !tool.inactive).map(tool => ({
    ...tool,
    isFavorite: favorites.has(tool.name),
    tags: tool.tags.map(tag => tag.toLowerCase()),
}));

export const ToolsProvider: React.FC<ToolsProviderProps> = ({ children }) => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [toolsSearchTerm, setToolsSearchTerm] = useState('');
    const [tagsSearchTerm, setTagsSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [tagsOrderBy, setTagsOrderBy] = useState<'mostUsed' | 'alphabetic'>('mostUsed');
    const [showAllTags, setShowAllTags] = useState(false);
    const toolsSearchTimeoutRef = useRef<NodeJS.Timeout | null>();
    const tagsSearchTimeoutRef = useRef<NodeJS.Timeout | null>();

    useEffect(() => {
        const rawToolsData: Tool[] = toolsJson;
        setTools(preprocessTools(rawToolsData, new Set<string>(JSON.parse(localStorage.getItem('favorites') || '[]'))));
    }, []);

    const toggleFavorite = useCallback((toolName: string) => {
        setTools(currentTools => {
            const updatedTools = currentTools.map(tool => tool.name === toolName ? { ...tool, isFavorite: !tool.isFavorite } : tool);
            const favorites = updatedTools.filter(tool => tool.isFavorite).map(tool => tool.name);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            return updatedTools;
        });
    }, []);

    const toggleTagSelection = useCallback((tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    }, []);

    const handleSetTagsSearchTerm = (value: string) => {
        if (tagsSearchTimeoutRef.current) clearTimeout(tagsSearchTimeoutRef.current);
        tagsSearchTimeoutRef.current = setTimeout(() => {
            setTagsSearchTerm(value);
            tagsSearchTimeoutRef.current = null;
        }, 500);
    };

    const handleSetToolsSearchTerm = (value: string) => {
        if (toolsSearchTimeoutRef.current) clearTimeout(toolsSearchTimeoutRef.current);
        toolsSearchTimeoutRef.current = setTimeout(() => {
            setToolsSearchTerm(value);
            toolsSearchTimeoutRef.current = null;
        }, 500);
    };


    const value = {
        filteredTools: tools.filter(tool => {
            const matchesSearchTerm = tool.name.toLowerCase().includes(toolsSearchTerm.toLowerCase());
            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => tool.tags.includes(tag.toLowerCase()));
            const matchesFavorites = !showFavoritesOnly || tool.isFavorite;
            return matchesSearchTerm && matchesTags && matchesFavorites;
        }),
        setToolsSearchTerm: handleSetToolsSearchTerm,
        setTagsSearchTerm: handleSetTagsSearchTerm,
        tagsSearchTerm,
        toolsSearchTerm,
        selectedTags,
        setSelectedTags,
        showFavoritesOnly,
        setShowFavoritesOnly,
        tagsOrderBy,
        setTagsOrderBy,
        showAllTags,
        setShowAllTags,
        toggleTagSelection,
        toggleFavorite,
    };

    return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
};

export const useTools = () => React.useContext(ToolsContext);

