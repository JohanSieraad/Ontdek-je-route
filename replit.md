# Nederlandse Routes Application

## Overview

This is a full-stack web application for exploring historical routes throughout the Netherlands. The application allows users to discover various regions, browse curated historical routes, and access audio guides for an immersive cultural experience. Built with React on the frontend and Express.js on the backend, it features a modern, responsive design using shadcn/ui components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with support for dynamic routes
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom Dutch-themed color palette and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture  
- **Framework**: Express.js with TypeScript running on Node.js
- **Storage Layer**: In-memory storage implementation with interface pattern for future database integration
- **API Design**: RESTful API endpoints for regions, routes, route stops, and audio tracks
- **Middleware**: Request logging, JSON parsing, and error handling middleware
- **Development Setup**: Vite middleware integration for hot module replacement in development

### Database Schema
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Tables**: 
  - `regions` - Geographic areas with route counts and descriptions
  - `routes` - Individual historical routes with metadata and ratings
  - `routeStops` - Waypoints along routes with coordinates and descriptions  
  - `audioTracks` - Audio guide content linked to routes and stops
- **Validation**: Zod schemas for runtime type validation and API request/response validation

### Component Architecture
- **Layout Components**: Navigation, footer, and responsive mobile-friendly design
- **Feature Components**: Region cards, route cards, audio player, and interactive map placeholder
- **UI Components**: Comprehensive shadcn/ui component library with consistent theming
- **Custom Hooks**: Mobile detection, toast notifications, and form handling

### Development Workflow
- **Monorepo Structure**: Shared types and schemas between frontend and backend
- **Hot Reloading**: Full-stack development with Vite serving frontend and Express backend
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Code Organization**: Clear separation between client, server, and shared code

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript support
- **Backend**: Express.js, Node.js runtime environment
- **Build Tools**: Vite for frontend bundling, esbuild for backend compilation

### Database & ORM
- **Database**: PostgreSQL (configured via Drizzle, can be added later)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Connection**: Neon Database serverless driver for PostgreSQL

### UI & Styling
- **Component Library**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React icon library
- **Utility Libraries**: clsx and tailwind-merge for conditional styling

### Development Tools
- **Routing**: Wouter for lightweight React routing
- **Forms**: React Hook Form with Hookform Resolvers for validation
- **Date Handling**: date-fns for date manipulation and formatting
- **State Management**: TanStack React Query for server state
- **Validation**: Zod for runtime type validation

### Replit Integration
- **Development**: Replit-specific Vite plugins for runtime error handling
- **Deployment**: Replit development banner integration
- **Cartographer**: Replit Cartographer plugin for enhanced development experience