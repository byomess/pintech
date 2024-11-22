"use client";

import React, { createContext, useState, useMemo, useCallback, ReactNode, useContext } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { debounce } from 'lodash';

export type Tool = {
    name: string;
    logoPath?: string;
    url: string;
    tags: string[];
    freeOffer?: string;
    description?: Record<string, any>;
    isFavorite?: boolean;
    inactive?: boolean;
    createdAt?: number;
};

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

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

type ToolsProviderProps = {
    tools: Tool[];
    children: ReactNode;
};

export const ToolsProvider: React.FC<ToolsProviderProps> = ({ tools, children }) => {
    const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
    const [toolsSearchTerm, setToolsSearchTerm] = useState('');
    const [tagsSearchTerm, setTagsSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [tagsOrderBy, setTagsOrderBy] = useState<'mostUsed' | 'alphabetic'>('mostUsed');
    const [showAllTags, setShowAllTags] = useState(false);

    const debouncedSetToolsSearchTerm = debounce(setToolsSearchTerm, 300)
    const debouncedSetTagsSearchTerm = debounce(setTagsSearchTerm, 300)

    const toggleFavorite = useCallback((toolName: string) => {
        setFavorites(currentFavorites => {
            const index = currentFavorites.indexOf(toolName);
            if (index > -1) {
                return currentFavorites.filter(favorite => favorite !== toolName);
            } else {
                return [...currentFavorites, toolName];
            }
        });
    }, [setFavorites]);

    const toggleTagSelection = useCallback((tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    }, []);

    const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

    const preprocessedTools = useMemo(() => tools.filter(tool => !tool.inactive).map(tool => ({
        ...tool,
        isFavorite: favoriteSet.has(tool.name),
        tags: tool.tags.map(tag => tag.toLowerCase()),
    })), [tools, favoriteSet]);

    const filteredTools = useMemo(() => {
        const searchTermLower = toolsSearchTerm.toLowerCase();
        return preprocessedTools.filter(tool => {
            const matchesSearchTerm = tool.name.toLowerCase().includes(searchTermLower);
            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => tool.tags.includes(tag.toLowerCase()));
            const matchesFavorites = !showFavoritesOnly || tool.isFavorite;
            return matchesSearchTerm && matchesTags && matchesFavorites;
        });
    }, [preprocessedTools, toolsSearchTerm, selectedTags, showFavoritesOnly]);

    const value = useMemo(() => ({
        filteredTools,
        toolsSearchTerm,
        setToolsSearchTerm: debouncedSetToolsSearchTerm,
        tagsSearchTerm,
        setTagsSearchTerm: debouncedSetTagsSearchTerm,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [
        filteredTools,
        toolsSearchTerm,
        tagsSearchTerm,
        selectedTags,
        showFavoritesOnly,
        tagsOrderBy,
        showAllTags,
        toggleTagSelection,
        toggleFavorite,
    ]);

    return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
};

export const useTools = () => {
    const context = useContext(ToolsContext);
    if (context === undefined) {
        throw new Error('useTools must be used within a ToolsProvider');
    }
    return context;
};
