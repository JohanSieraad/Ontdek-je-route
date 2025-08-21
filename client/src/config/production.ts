// Production configuration for GitHub deployment
export const PRODUCTION_CONFIG = {
  API_BASE_URL: 'https://api.routeparel.com', // Replace with your production API
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  APP_BASE_URL: 'https://johansieraad.github.io/Routepare-/',
  STATIC_ASSETS_PATH: '/Routepare-/attached_assets/',
  
  // Mock data voor GitHub Pages (omdat er geen backend is)
  USE_MOCK_DATA: true,
  
  // Feature flags
  FEATURES: {
    GOOGLE_MAPS: true,
    AUTHENTICATION: false, // Uitgeschakeld voor static hosting
    DATABASE: false, // Uitgeschakeld voor static hosting
    ACTIVITY_TRACKING: false,
    RECOMMENDATIONS: true
  }
};