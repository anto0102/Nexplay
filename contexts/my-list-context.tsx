'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, TVShow } from '@/lib/tmdb';

type ListItem = {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
};

type MyListContextType = {
  myList: ListItem[];
  addToList: (item: Movie | TVShow, type: 'movie' | 'tv') => void;
  removeFromList: (id: number, type: 'movie' | 'tv') => void;
  isInList: (id: number, type: 'movie' | 'tv') => boolean;
  clearList: () => void;
};

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export function MyListProvider({ children }: { children: ReactNode }) {
  const [myList, setMyList] = useState<ListItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedList = localStorage.getItem('nexplay-my-list');
      if (savedList) {
        const parsedList = JSON.parse(savedList);
        setMyList(Array.isArray(parsedList) ? parsedList : []);
      }
    } catch (error) {
      console.error('Error loading my list from localStorage:', error);
      setMyList([]);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever myList changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('nexplay-my-list', JSON.stringify(myList));
      } catch (error) {
        console.error('Error saving my list to localStorage:', error);
      }
    }
  }, [myList, isHydrated]);

  const addToList = (item: Movie | TVShow, type: 'movie' | 'tv') => {
    const listItem: ListItem = {
      id: item.id,
      type,
      title: type === 'movie' ? (item as Movie).title : (item as TVShow).name,
      name: type === 'tv' ? (item as TVShow).name : undefined,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      release_date: type === 'movie' ? (item as Movie).release_date : undefined,
      first_air_date: type === 'tv' ? (item as TVShow).first_air_date : undefined,
      overview: item.overview,
    };

    setMyList(prev => {
      // Check if item already exists
      const exists = prev.some(existingItem =>
        existingItem.id === item.id && existingItem.type === type
      );

      if (exists) {
        return prev; // Don't add duplicates
      }

      return [listItem, ...prev]; // Add to beginning of list
    });
  };

  const removeFromList = (id: number, type: 'movie' | 'tv') => {
    setMyList(prev => prev.filter(item =>
      !(item.id === id && item.type === type)
    ));
  };

  const isInList = (id: number, type: 'movie' | 'tv') => {
    return myList.some(item => item.id === id && item.type === type);
  };

  const clearList = () => {
    setMyList([]);
  };

  const value = {
    myList,
    addToList,
    removeFromList,
    isInList,
    clearList,
  };

  return (
    <MyListContext.Provider value={value}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (context === undefined) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
}