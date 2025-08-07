import { Router } from 'express';

const router = Router();

// Endpoint to provide client configuration
router.get('/api/config', (req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;