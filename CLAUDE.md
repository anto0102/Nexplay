# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Netflix-style streaming platform built with Next.js 15.5.3, React 19.1.0, TypeScript, and Tailwind CSS v4. The application integrates with TMDB API for movie/TV data and VixSrc for streaming functionality. Features include real-time search, "My List" functionality, and complete Netflix-like UI/UX.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking (if available)

## Architecture

### Project Structure
- Uses Next.js App Router (not Pages Router)
- Main application code lives in `/app` directory
- TypeScript configuration enables strict mode and path aliases (`@/*` maps to root)
- Tailwind CSS v4 with custom CSS variables for theming
- Component-based architecture with reusable UI components

### Core Features
- **Real-time Search**: Live search with dropdown suggestions (SearchBar component)
- **My List**: Personal watchlist with localStorage persistence
- **TMDB Integration**: Full movie/TV show data, images, trailers, cast/crew
- **Video Streaming**: VixSrc integration for movie/TV playback
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Performance Optimized**: Optimized animations and lazy loading

### Styling
- Uses Tailwind CSS v4 with custom theme configuration in `globals.css`
- Netflix-inspired color scheme (red/black/white)
- Performance-optimized animations (removed heavy effects)
- CSS variables for background/foreground colors with dark mode support
- Custom font variables for Geist Sans and Geist Mono fonts

### API Integration

#### TMDB API
- **API Key**: `2d082597ab951b3a9596ca23e71413a8`
- **Base URL**: `https://api.themoviedb.org/3`
- **Language**: Italian (`it-IT`)
- **Mock Data**: Fallback system for API failures
- **Functions**: Search, trending, popular, details, credits, videos

#### VixSrc Streaming
- **Base URL**: `https://vixsrc.to`
- **Custom Parameters**: Netflix red theme, Italian language
- **Integration**: Embedded player with custom controls

### State Management
- **My List Context**: Global state for user's personal watchlist
- **LocalStorage**: Persistent storage for user preferences
- **Real-time Updates**: Immediate UI feedback for list operations

## Key Files & Components

### Core App Structure
- `app/layout.tsx` - Root layout with font configuration and metadata
- `app/page.tsx` - Homepage with hero section and movie rows
- `app/globals.css` - Global styles and Tailwind imports with theme variables
- `next.config.ts` - Next.js configuration with image domains

### Pages
- `app/movies/page.tsx` - Movies catalog page
- `app/tv/page.tsx` - TV shows catalog page
- `app/trending/page.tsx` - Trending content page
- `app/my-list/page.tsx` - User's personal watchlist
- `app/search/page.tsx` - Search results page
- `app/movie/[id]/page.tsx` - Individual movie details
- `app/tv/[id]/page.tsx` - Individual TV show details

### Core Components
- `components/navbar.tsx` - Netflix-style navigation with search
- `components/search-bar.tsx` - Real-time search with suggestions
- `components/hero-section.tsx` - Large featured content banner
- `components/movie-row.tsx` - Horizontal scrolling content rows
- `components/movie-details-client.tsx` - Movie detail page content
- `components/tv-details-client.tsx` - TV show detail page content
- `components/video-player.tsx` - VixSrc streaming player integration

### Context & State
- `contexts/my-list-context.tsx` - Global state for "My List" functionality

### API & Data
- `lib/tmdb.ts` - TMDB API integration with error handling and mock data
- `lib/types.ts` - TypeScript interfaces for TMDB API responses

### UI Components (shadcn/ui)
- `components/ui/button.tsx` - Customizable button component
- `components/ui/badge.tsx` - Status and rating badges
- `components/ui/card.tsx` - Content cards and containers
- `components/ui/dialog.tsx` - Modal dialogs (enhanced for accessibility)
- `components/ui/input.tsx` - Form input fields
- `components/ui/skeleton.tsx` - Loading state placeholders

## Technical Specifications

### Performance Optimizations
- Removed heavy CSS animations and effects
- Optimized image loading with Next.js Image component
- Debounced search (300ms) to reduce API calls
- Lazy loading for improved initial page load
- Efficient state management to prevent unnecessary re-renders

### Accessibility Features
- Screen reader support with VisuallyHidden titles
- Keyboard navigation support
- ARIA labels and semantic HTML
- High contrast color schemes
- Focus management for modals and dropdowns

### Error Handling
- Graceful API failure handling with mock data
- Type-safe error boundaries
- User-friendly error messages
- Console logging for debugging
- Fallback UI states for loading and errors

### Mobile Responsiveness
- Mobile-first design approach
- Collapsible mobile navigation
- Touch-friendly interactive elements
- Responsive grid layouts
- Optimized for various screen sizes

## Development Notes

### TMDB API Integration
- All API calls include error handling and fallback
- Mock data system provides development continuity
- Image URLs are constructed with proper sizing
- Search functionality includes multi-media search
- Rate limiting considerations implemented

### Search Functionality
- Real-time search without page refresh
- Dropdown suggestions with rich previews
- Full search results page for comprehensive browsing
- Search history and query parameter handling
- Performance optimized with debouncing

### Video Streaming
- VixSrc integration for movie/TV playback
- Custom player theming to match Netflix aesthetic
- Support for both movies and TV shows with episodes
- Responsive video player for all screen sizes

### State Persistence
- My List items stored in localStorage
- Automatic state hydration on app load
- Cross-session persistence of user preferences
- Efficient data serialization and deserialization