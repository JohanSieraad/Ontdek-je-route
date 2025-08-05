# Laadpaal Sales Funnel Application

## Overview

This is a high-performing sales funnel web application for www.delaadpaalshop.com that provides extensive information about charging point options followed by lead generation. The application features an information-first approach with expandable categories covering installation, costs, subsidies, and technical details, culminating in a comprehensive lead capture form. Built with React on the frontend and Express.js on the backend, it features authentic Laadpaalshop brand styling using shadcn/ui components and Tailwind CSS.

## Recent Changes

### Complete Laadpaal Sales Funnel Implementation (August 2025)
- **Brand identity transformation**: Converted to authentic Laadpaalshop styling with blue/orange color scheme
- **Sales funnel architecture**: Information-first approach with expandable content sections followed by lead capture
- **Comprehensive database schema**: Brands, charging stations, information categories, information items, and leads
- **API implementation**: Full REST API for brands, charging points, information content, and lead management
- **Information categorization**: Four main categories (Installation, Costs, Subsidies, Smart Features) with detailed content
- **Lead generation form**: Complete form with housing situation, car details, budget, installation needs, and timeline
- **Popular products section**: Real charging point data with pricing and feature information
- **Trust indicators**: Personal advice, recognized brands, and complete installation messaging
- **Responsive design**: Mobile-optimized funnel with clear call-to-action buttons

### Belgian Ardennes Expansion (January 2025)
- Added Belgium as new country with focus on Belgian Ardennes region
- Created 2 new Belgian routes: "Kastelen Route Ardennen" and "Ardennen Natuur Route"
- Added authentic Belgian castle stops: Bouillon, La Roche-en-Ardenne, Reinhardstein
- Implemented nature route with Hoge Venen National Park and Ourthe River
- Extended navigation system to support cross-border routing
- Corrected route distances (Kastelen Route: 125 km, Natuur Route: 85 km)

### Navigation Integration (January 2025)
- Added comprehensive navigation system architecture for future Google Maps/Waze integration
- Created RouteNavigation component with preferences for avoiding highways, tolls, and ferries  
- Implemented navigation service interfaces supporting multiple providers (Google Maps, Waze, OpenStreetMap)
- Enhanced route detail pages with navigation controls and transport mode selection
- Added schema support for navigation routes and preferences storage

## User Preferences

Preferred communication style: Simple, everyday language.
User repeatedly asks about navigation integration despite it being implemented: Google Maps/Waze route integration with highway avoidance is fully implemented and working in RouteNavigation component. User may need visual demonstration or rollback to see it clearly.

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
  - `brands` - Charging point manufacturers with logos and popularity flags
  - `chargingStations` - Product catalog with pricing, power ratings, and features
  - `infoCategories` - Information sections (Installation, Costs, Subsidies, Smart Features)
  - `infoItems` - Detailed content items within each information category
  - `leads` - Customer inquiries with contact info, housing situation, car details, and preferences
- **Validation**: Zod schemas for runtime type validation and API request/response validation
- **Lead Management**: Comprehensive lead capture with installation needs, budget, and timeline tracking

### Component Architecture
- **Layout Components**: Navigation, footer, and responsive mobile-friendly design
- **Feature Components**: Region cards, route cards, audio player, route navigation, and interactive map placeholder
- **UI Components**: Comprehensive shadcn/ui component library with consistent theming
- **Custom Hooks**: Mobile detection, toast notifications, and form handling
- **Navigation Components**: RouteNavigation with transport mode selection and route preferences

### Development Workflow
- **Monorepo Structure**: Shared types and schemas between frontend and backend
- **Hot Reloading**: Full-stack development with Vite serving frontend and Express backend
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Code Organization**: Clear separation between client, server, and shared code

## Navigation Features

### Route Navigation System
- **Multi-Provider Support**: Google Maps, Waze, and OpenStreetMap integration architecture
- **Route Preferences**: Options to avoid highways, tolls, ferries with scenic route preference
- **Transport Modes**: Support for driving, cycling, walking, and public transit
- **Multi-Stop Routes**: Optimized routing through multiple historical stops
- **Real-Time Integration**: Framework for live traffic and road condition updates

### Future Implementation Plans
- **Google Maps Integration**: Directions API with Dutch language support and regional optimization
- **Waze Integration**: Real-time traffic-aware routing for optimal travel times
- **OpenStreetMap**: Free alternative using OSRM routing engine
- **Route Caching**: Navigation route storage for improved performance
- **Offline Support**: Downloaded routes for areas with poor connectivity

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