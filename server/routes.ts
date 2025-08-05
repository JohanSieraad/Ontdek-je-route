import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertChargingStationSchema, insertBrandSchema, insertInfoCategorySchema, insertInfoItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Brands
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van merken" });
    }
  });

  app.get("/api/brands/:id", async (req, res) => {
    try {
      const brand = await storage.getBrandById(req.params.id);
      if (!brand) {
        return res.status(404).json({ message: "Merk niet gevonden" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van merk" });
    }
  });

  app.post("/api/brands", async (req, res) => {
    try {
      const validated = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validated);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige merk gegevens" });
    }
  });

  // Charging Stations
  app.get("/api/charging-stations", async (req, res) => {
    try {
      const { brandId, popular } = req.query;
      
      let stations;
      if (brandId) {
        stations = await storage.getChargingStationsByBrand(brandId as string);
      } else if (popular === 'true') {
        stations = await storage.getPopularChargingStations();
      } else {
        stations = await storage.getAllChargingStations();
      }
      
      res.json(stations);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van laadpalen" });
    }
  });

  app.get("/api/charging-stations/:id", async (req, res) => {
    try {
      const station = await storage.getChargingStationById(req.params.id);
      if (!station) {
        return res.status(404).json({ message: "Laadpaal niet gevonden" });
      }
      res.json(station);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van laadpaal" });
    }
  });

  app.post("/api/charging-stations", async (req, res) => {
    try {
      const validated = insertChargingStationSchema.parse(req.body);
      const station = await storage.createChargingStation(validated);
      res.status(201).json(station);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige laadpaal gegevens" });
    }
  });

  // Leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLeadById(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: "Lead niet gevonden" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van lead" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const validated = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validated);
      res.status(201).json(lead);
    } catch (error) {
      console.error('Lead creation error:', error);
      res.status(400).json({ message: "Ongeldige lead gegevens", error: error });
    }
  });

  // Info Categories
  app.get("/api/info-categories", async (req, res) => {
    try {
      const categories = await storage.getAllInfoCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van info categorieën" });
    }
  });

  app.post("/api/info-categories", async (req, res) => {
    try {
      const validated = insertInfoCategorySchema.parse(req.body);
      const category = await storage.createInfoCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige categorie gegevens" });
    }
  });

  // Info Items
  app.get("/api/info-items/:categoryId", async (req, res) => {
    try {
      const items = await storage.getInfoItemsByCategory(req.params.categoryId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van info items" });
    }
  });

  app.post("/api/info-items", async (req, res) => {
    try {
      const validated = insertInfoItemSchema.parse(req.body);
      const item = await storage.createInfoItem(validated);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige info item gegevens" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}