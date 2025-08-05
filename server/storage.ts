import { type Brand, type InsertBrand, type ChargingStation, type InsertChargingStation, type Lead, type InsertLead, type InfoCategory, type InsertInfoCategory, type InfoItem, type InsertInfoItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Brands
  getAllBrands(): Promise<Brand[]>;
  getBrandById(id: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;

  // Charging Stations
  getAllChargingStations(): Promise<ChargingStation[]>;
  getChargingStationById(id: string): Promise<ChargingStation | undefined>;
  getChargingStationsByBrand(brandId: string): Promise<ChargingStation[]>;
  getPopularChargingStations(): Promise<ChargingStation[]>;
  createChargingStation(station: InsertChargingStation): Promise<ChargingStation>;

  // Leads
  getAllLeads(): Promise<Lead[]>;
  getLeadById(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;

  // Info Categories & Items
  getAllInfoCategories(): Promise<InfoCategory[]>;
  getInfoItemsByCategory(categoryId: string): Promise<InfoItem[]>;
  createInfoCategory(category: InsertInfoCategory): Promise<InfoCategory>;
  createInfoItem(item: InsertInfoItem): Promise<InfoItem>;
}

export class MemStorage implements IStorage {
  private brands: Map<string, Brand>;
  private chargingStations: Map<string, ChargingStation>;
  private leads: Map<string, Lead>;
  private infoCategories: Map<string, InfoCategory>;
  private infoItems: Map<string, InfoItem>;

  constructor() {
    this.brands = new Map();
    this.chargingStations = new Map();
    this.leads = new Map();
    this.infoCategories = new Map();
    this.infoItems = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize brands
    const brandsData: InsertBrand[] = [
      {
        name: "Alfen",
        description: "Nederlandse marktleider in slimme laadoplossingen voor elektrische voertuigen",
        logoUrl: "https://www.delaadpaalshop.com/wp-content/uploads/2019/08/alfen_logo.png",
        isPopular: 1
      },
      {
        name: "Blue Current",
        description: "Innovatieve Nederlandse fabrikant van slimme laadpalen",
        logoUrl: "https://www.delaadpaalshop.com/wp-content/uploads/2019/08/blue_current_logo.png",
        isPopular: 1
      },
      {
        name: "Peblar",
        description: "Smart charging oplossingen van Nederlandse bodem",
        logoUrl: "https://www.delaadpaalshop.com/wp-content/uploads/peblar-logo.jpg",
        isPopular: 1
      },
      {
        name: "Shell Recharge",
        description: "Betrouwbare laadoplossingen van wereldwijde energieleider",
        logoUrl: "https://www.delaadpaalshop.com/wp-content/uploads/shell-recharge-logo.jpg",
        isPopular: 1
      },
      {
        name: "Zaptec",
        description: "Noorse innovatie in slimme laadtechnologie",
        logoUrl: "https://www.delaadpaalshop.com/wp-content/uploads/zaptec-logo.jpg",
        isPopular: 1
      }
    ];

    brandsData.forEach(brand => {
      this.createBrand(brand);
    });

    // Initialize info categories
    const categoriesData: InsertInfoCategory[] = [
      {
        title: "Soorten Laadpalen",
        description: "Ontdek welke laadpaal het beste bij jouw situatie past",
        icon: "Zap",
        order: 1
      },
      {
        title: "Installatie & Voorbereiding",
        description: "Alles wat je moet weten over de installatie van je laadpaal",
        icon: "Wrench",
        order: 2
      },
      {
        title: "Kosten & Subsidies",
        description: "Overzicht van kosten en beschikbare subsidies",
        icon: "Euro",
        order: 3
      },
      {
        title: "Smart Features",
        description: "Moderne functionaliteiten en app-bediening",
        icon: "Smartphone",
        order: 4
      }
    ];

    categoriesData.forEach(category => {
      this.createInfoCategory(category);
    });

    // Get brand IDs
    const alfenId = Array.from(this.brands.values()).find(b => b.name === "Alfen")?.id || "";
    const blueCurrentId = Array.from(this.brands.values()).find(b => b.name === "Blue Current")?.id || "";
    const peblarId = Array.from(this.brands.values()).find(b => b.name === "Peblar")?.id || "";
    const shellId = Array.from(this.brands.values()).find(b => b.name === "Shell Recharge")?.id || "";
    const zaptecId = Array.from(this.brands.values()).find(b => b.name === "Zaptec")?.id || "";

    // Initialize charging stations
    const stationsData: InsertChargingStation[] = [
      {
        brandId: zaptecId,
        name: "Zaptec Go 2 22kW",
        description: "Complete laadoplossing met smart charging en app-bediening. Weatherproof en geschikt voor alle elektrische auto's.",
        power: "22kW",
        price: 1009.14,
        imageUrl: "https://www.delaadpaalshop.com/wp-content/uploads/zaptec-go-2.jpg",
        features: { smart: true, weatherproof: true, app: true },
        category: "thuis",
        isPopular: 1
      },
      {
        brandId: peblarId,
        name: "Peblar Home",
        description: "Slimme laadpaal met Nederlandse kwaliteit. Eenvoudige installatie en uitstekende prijs-kwaliteit verhouding.",
        power: "11kW",
        price: 747.00,
        imageUrl: "https://www.delaadpaalshop.com/wp-content/uploads/image4-37.png",
        features: { smart: true, weatherproof: true, app: true },
        category: "thuis",
        isPopular: 1
      },
      {
        brandId: alfenId,
        name: "Alfen Eve Single Pro Line 11kW",
        description: "Nederlandse marktleider met bewezen kwaliteit. Robuust en betrouwbaar voor dagelijks gebruik.",
        power: "11kW",
        price: 1124.09,
        imageUrl: "https://www.delaadpaalshop.com/wp-content/uploads/Eve-Single-Proline-socket-schuin_0.jpg",
        features: { smart: true, weatherproof: true, rfid: true },
        category: "thuis",
        isPopular: 1
      }
    ];

    stationsData.forEach(station => {
      this.createChargingStation(station);
    });

    // Initialize info items
    const infoItemsData: InsertInfoItem[] = [
      {
        categoryId: Array.from(this.infoCategories.values()).find(c => c.title === "Soorten Laadpalen")?.id || "",
        title: "Thuislaadpalen (11kW vs 22kW)",
        content: "11kW laadpalen zijn ideaal voor de meeste gebruikers en laden je auto in 6-8 uur volledig op. 22kW laadpalen zijn sneller maar vereisen 3-fase aansluiting.",
        imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?ixlib=rb-4.0.3",
        order: 1
      },
      {
        categoryId: Array.from(this.infoCategories.values()).find(c => c.title === "Installatie & Voorbereiding")?.id || "",
        title: "Elektrische keuring vereist",
        content: "Voor elke laadpaal installatie is een elektrische keuring verplicht. Wij zorgen voor een gecertificeerde installateur en alle benodigde papieren.",
        imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3",
        order: 1
      },
      {
        categoryId: Array.from(this.infoCategories.values()).find(c => c.title === "Kosten & Subsidies")?.id || "",
        title: "SEEH subsidie tot €1.500",
        content: "De SEEH subsidie geeft tot €1.500 korting op je laadpaal en installatie. Wij helpen je met de aanvraag en zorgen dat je maximaal profiteert.",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3",
        order: 1
      }
    ];

    infoItemsData.forEach(item => {
      this.createInfoItem(item);
    });
  }

  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrandById(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const newBrand: Brand = { 
      id, 
      ...brand,
      isPopular: brand.isPopular ?? 0
    };
    this.brands.set(id, newBrand);
    return newBrand;
  }

  // Charging Station methods
  async getAllChargingStations(): Promise<ChargingStation[]> {
    return Array.from(this.chargingStations.values());
  }

  async getChargingStationById(id: string): Promise<ChargingStation | undefined> {
    return this.chargingStations.get(id);
  }

  async getChargingStationsByBrand(brandId: string): Promise<ChargingStation[]> {
    return Array.from(this.chargingStations.values()).filter(
      station => station.brandId === brandId
    );
  }

  async getPopularChargingStations(): Promise<ChargingStation[]> {
    return Array.from(this.chargingStations.values()).filter(
      station => station.isPopular === 1
    );
  }

  async createChargingStation(station: InsertChargingStation): Promise<ChargingStation> {
    const id = randomUUID();
    const newStation: ChargingStation = { 
      id, 
      ...station,
      isPopular: station.isPopular ?? 0,
      features: station.features ?? {}
    };
    this.chargingStations.set(id, newStation);
    return newStation;
  }

  // Lead methods
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const newLead: Lead = { 
      id, 
      ...lead,
      phone: lead.phone ?? null,
      postcode: lead.postcode ?? null,
      housingSituation: lead.housingSituation ?? null,
      currentCar: lead.currentCar ?? null,
      plannedCar: lead.plannedCar ?? null,
      budget: lead.budget ?? null,
      timeframe: lead.timeframe ?? null,
      interests: lead.interests ?? null,
      notes: lead.notes ?? null,
      createdAt: new Date()
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  // Info methods
  async getAllInfoCategories(): Promise<InfoCategory[]> {
    return Array.from(this.infoCategories.values()).sort((a, b) => a.order - b.order);
  }

  async getInfoItemsByCategory(categoryId: string): Promise<InfoItem[]> {
    return Array.from(this.infoItems.values())
      .filter(item => item.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  }

  async createInfoCategory(category: InsertInfoCategory): Promise<InfoCategory> {
    const id = randomUUID();
    const newCategory: InfoCategory = { 
      id, 
      ...category,
      order: category.order ?? 0
    };
    this.infoCategories.set(id, newCategory);
    return newCategory;
  }

  async createInfoItem(item: InsertInfoItem): Promise<InfoItem> {
    const id = randomUUID();
    const newItem: InfoItem = { 
      id, 
      ...item,
      imageUrl: item.imageUrl ?? null,
      order: item.order ?? 0
    };
    this.infoItems.set(id, newItem);
    return newItem;
  }
}

export const storage = new MemStorage();