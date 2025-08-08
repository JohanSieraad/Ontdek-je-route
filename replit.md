# Nederlandse Routes Application

## Overview
This full-stack web application, rebranded as "RouteParel", is designed for exploring historical routes across the Netherlands, Belgium, and potentially other regions. It enables users to discover historical routes, access audio guides, and receive personalized recommendations. The application focuses on automotive routes, highlighting scenic drives, cultural stops, and culinary experiences. Key ambitions include expanding to multi-day routes, integrating accommodation bookings for monetization, and publishing to app stores.

## User Preferences
Preferred communication style: Simple, everyday language.
Navigation preference: Extremely compact navigation with single dropdown menu (successfully implemented).
User confirmed satisfaction with navigation restructure: "ja nu werkt het hier goed".

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter for lightweight client-side routing.
- **State Management**: TanStack Query (React Query) for server state management and caching.
- **UI Components**: shadcn/ui library built on Radix UI primitives.
- **Styling**: Tailwind CSS with a custom Dutch-themed color palette and responsive design.
- **Build Tool**: Vite for fast development and optimized production builds.

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js.
- **Storage Layer**: Currently, an in-memory storage implementation with an interface for future database integration.
- **API Design**: RESTful API endpoints for regions, routes, stops, audio tracks, and comprehensive user profile management.
- **Authentication**: JWT-based authentication with bcryptjs for password hashing and secure session management.
- **Middleware**: Request logging, JSON parsing, error handling, and authentication middleware.

### Database Schema
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions.
- **Tables**:
    - `users`, `userSocialAccounts`, `sessions` for authentication.
    - `regions`, `routes`, `routeStops`, `audioTracks` for core content.
    - `userVehiclePreferences`, `userFavoriteLocations`, `userCompletedRoutes`, `pointsOfInterest` for user profiles.
    - `navigationRoutes` for caching external navigation data.
    - `userPreferences`, `activity`, `interactions` for the recommendation engine.
- **Validation**: Zod schemas for runtime type validation.

### Component Architecture
- **Layout**: Navigation, footer, and responsive mobile-friendly design.
- **Features**: Region cards, route cards, audio player, route navigation, interactive map placeholder, and full user profile interface.
- **UI**: Comprehensive shadcn/ui component library with consistent theming.
- **Custom Hooks**: For mobile detection, toast notifications, and form handling.
- **Navigation Components**: RouteNavigation with transport mode selection and route preferences.

### System Features
- **Persistent Route IDs**: Routes and regions use fixed IDs for stability.
- **Personalized Route Recommendations**: Collaborative filtering and content-based recommendation engine based on user activity and preferences.
- **Comprehensive User Profile System**: Allows users to manage vehicle preferences, favorite locations, and completed routes.
- **Route Navigation System**: Architecture supporting multi-provider integration (Google Maps, Waze, OpenStreetMap) with preferences (avoid highways, tolls, ferries).
- **Automotive Focus**: Application transformed to focus on car driving experiences with specific routes, restaurant stops, and photography spots.

## External Dependencies

### Core Framework Dependencies
- **Frontend**: React 18, React DOM, TypeScript.
- **Backend**: Express.js, Node.js.
- **Build Tools**: Vite, esbuild.

### Database & ORM
- **Database**: PostgreSQL.
- **ORM**: Drizzle ORM with Drizzle Kit.
- **Database Connection**: Neon Database serverless driver for PostgreSQL.

### UI & Styling
- **Component Library**: Radix UI primitives.
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer.
- **Icons**: Lucide React.
- **Utility Libraries**: clsx, tailwind-merge.

### Development Tools & Libraries
- **Routing**: Wouter.
- **Forms**: React Hook Form with Hookform Resolvers.
- **Date Handling**: date-fns.
- **State Management**: TanStack React Query.
- **Validation**: Zod.
- **Authentication**: bcryptjs (for password hashing).

### APIs & Services
- **Maps**: Google Maps JavaScript API (for map integration).

### Replit Integration
- Replit-specific Vite plugins for runtime error handling.
- Replit development banner integration.
- Replit Cartographer plugin.