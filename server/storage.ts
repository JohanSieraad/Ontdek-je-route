import { type Region, type InsertRegion, type Route, type InsertRoute, type RouteStop, type InsertRouteStop, type AudioTrack, type InsertAudioTrack, type Review, type InsertReview, type Photo, type InsertPhoto } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Regions
  getAllRegions(): Promise<Region[]>;
  getRegionById(id: string): Promise<Region | undefined>;
  createRegion(region: InsertRegion): Promise<Region>;

  // Routes
  getAllRoutes(): Promise<Route[]>;
  getRouteById(id: string): Promise<Route | undefined>;
  getRoutesByRegion(regionId: string): Promise<Route[]>;
  getPopularRoutes(): Promise<Route[]>;
  createRoute(route: InsertRoute): Promise<Route>;

  // Route Stops
  getRouteStops(routeId: string): Promise<RouteStop[]>;
  createRouteStop(stop: InsertRouteStop): Promise<RouteStop>;

  // Audio Tracks
  getAudioTracksByRoute(routeId: string): Promise<AudioTrack[]>;
  getAudioTrackByStop(stopId: string): Promise<AudioTrack | undefined>;
  createAudioTrack(track: InsertAudioTrack): Promise<AudioTrack>;

  // Reviews
  getReviewsByRoute(routeId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewById(id: string): Promise<Review | undefined>;

  // Photos
  getPhotosByRoute(routeId: string): Promise<Photo[]>;
  getPhotosByStop(stopId: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getPhotoById(id: string): Promise<Photo | undefined>;
}

export class MemStorage implements IStorage {
  private regions: Map<string, Region>;
  private routes: Map<string, Route>;
  private routeStops: Map<string, RouteStop>;
  private audioTracks: Map<string, AudioTrack>;
  private reviews: Map<string, Review>;
  private photos: Map<string, Photo>;

  constructor() {
    this.regions = new Map();
    this.routes = new Map();
    this.routeStops = new Map();
    this.audioTracks = new Map();
    this.reviews = new Map();
    this.photos = new Map();
    this.initializeData();
    this.initializeReviewsAndPhotos();
  }

  private initializeData() {
    // Initialize with Dutch regions
    const dutchRegions: InsertRegion[] = [
      {
        name: "Noord-Holland",
        description: "Rijd langs kastelen, pittoreske dorpjes en toprestaurants. Van Muiderslot tot Volendam, perfecte autoroutes met culinaire stops.",
        routeCount: 8,
        estimatedDuration: "5-8 uur rijden",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3"
      },
      {
        name: "Zuid-Holland",
        description: "Autoroutes langs historische steden, molens en de kust. Van Kinderdijk tot Scheveningen met restaurant stops.",
        routeCount: 6,
        estimatedDuration: "4-7 uur rijden",
        imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3"
      },
      {
        name: "Utrecht",
        description: "Rijd door het groene hart met landgoederen, kastelen en charmante dorpjes. Perfecte lunch spots onderweg.",
        routeCount: 4,
        estimatedDuration: "3-6 uur rijden",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3"
      },
      {
        name: "Zeeland",
        description: "Kustroutes langs de Deltawerken, strand restaurants en vissersdorpjes. Stop bij Grand Café Ristorante Rossini (Middelburg).",
        routeCount: 3,
        estimatedDuration: "4-6 uur rijden",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3"
      },
      {
        name: "Gelderland",
        description: "Kasteel routes door de Veluwe met wildparken en restaurants. Van Kasteel Het Loo tot Restaurant De Echoput.",
        routeCount: 5,
        estimatedDuration: "5-8 uur rijden",
        imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3"
      },
      {
        name: "Overijssel",
        description: "Hanzestad routes langs Deventer, Zwolle en Giethoorn. Met lunch stops bij historische grand cafés.",
        routeCount: 4,
        estimatedDuration: "3-6 uur rijden",
        imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3"
      }
    ];

    // Initialize Belgian regions
    const belgianRegions: InsertRegion[] = [
      {
        name: "Belgische Ardennen",
        description: "Autoroutes langs kastelen, bossen en Belgische brouwerijen. Stop bij Kasteel Bouillon en Brasserie d'Achouffe.",
        routeCount: 4,
        estimatedDuration: "6-8 uur rijden", 
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3"
      }
    ];

    // Initialize all regions
    [...dutchRegions, ...belgianRegions].forEach(region => {
      this.createRegion(region);
    });

    // Automotive routes voor autorijders - echte routes langs mooie dorpjes en bezienswaardigheden
    const dutchRoutes: InsertRoute[] = [
      {
        title: "Kastelen Route Noord-Holland",
        description: "Spectaculaire autoroute langs Nederlandse kastelen: Muiderslot, Kasteel De Haar en Slot Assumburg. Stop bij Restaurant De Kazerne (Muiden) voor lunch met kasteelzicht. Perfecte fotomomenten bij historische vestingwerken.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Noord-Holland")?.id || "",
        category: "Kastelen & Eten",
        rating: 4.9,
        duration: "6 uur rijden",
        distance: "185 km",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3",
        difficulty: "gemakkelijk",
        isPopular: 1
      },
      {
        title: "Pittoreske Dorpjes Route",
        description: "Autoroute langs de mooiste dorpjes: Volendam, Marken, Giethoorn en Staphorst. Stop bij Restaurant Spaander (Volendam) voor verse vis en bij Grand Café Giethoorn voor koffie met dorpszicht. Instagram-waardige fotostops bij traditionele huizen.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Noord-Holland")?.id || "",
        category: "Dorpjes & Fotografie",
        rating: 4.7,
        duration: "8 uur rijden",
        distance: "220 km",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3",
        difficulty: "gemakkelijk",
        isPopular: 1
      },
      {
        title: "Nederlandse Bierroute",
        description: "Autoroute langs ambachtelijke brouwerijen: Brouwerij 't IJ (Amsterdam), Jopen Brouwerij (Haarlem) en Brouwerij De Molen (Bodegraven). Inclusief proeverijen, biertuinen voor lunch en brouwerij tours. Designate driver aanbevolen!",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Noord-Holland")?.id || "",
        category: "Bier & Cultuur",
        rating: 4.8,
        duration: "7 uur rijden",
        distance: "160 km",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
        difficulty: "gemakkelijk",
        isPopular: 1
      },
      {
        title: "Kustroute met Strandpaviljoen Stops",
        description: "Prachtige autoroute langs de Nederlandse kust: Zandvoort, Noordwijk, Scheveningen. Stop bij Beach Restaurant Tijn (Zandvoort) voor lunch op het strand, Strandpaviljoen De Brekers (Noordwijk) voor cocktails met zeezicht. Perfect voor zonsondergangfoto's.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Noord-Holland")?.id || "",
        category: "Strand & Restaurants",
        rating: 4.6,
        duration: "5 uur rijden",
        distance: "125 km",
        imageUrl: "https://images.unsplash.com/photo-1502780402662-acc01917478e?ixlib=rb-4.0.3",
        difficulty: "gemakkelijk",
        isPopular: 1
      },
      {
        title: "Landgoederen & Tuinen Route",
        description: "Luxe autoroute langs historische landgoederen: Keukenhof, Hortus Botanicus en Kasteel Groeneveld. Stop bij Restaurant De Kas (Utrecht) voor lunchen tussen de bloemen. Fotogenie tuinen en perfecte picknickplekken bij historische villa's.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Noord-Holland")?.id || "",
        category: "Natuur & Fotografie",
        rating: 4.8,
        duration: "5 uur rijden",
        distance: "140 km",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3",
        difficulty: "gemakkelijk",
        isPopular: 1
      },
      {
        title: "Waddeneiland Auto & Ferry Avontuur",
        description: "Unieke autoroute inclusief veerboten naar Texel en Vlieland. Stop bij Strandpaviljoen Paal 17 voor lunch op het strand, Restaurant Topido (Den Burg) voor lokale specialiteiten. Vuurtoren De Cocksdorp voor iconische zonsondergangfoto's.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Noord-Holland")?.id || "",
        category: "Eilanden & Zee",
        rating: 4.8,
        duration: "Volledige dag",
        distance: "180 km + ferry",
        imageUrl: "https://images.unsplash.com/photo-1516833398908-1e85ac4c4b56?ixlib=rb-4.0.3",
        difficulty: "gemakkelijk",
        isPopular: 1
      },
      {
        title: "Hollands Erfgoed Auto Route",
        description: "Autoroute langs Nederlandse iconen: Zaanse Schans molens, Kinderdijk en Waterland. Stop bij Restaurant De Hoop op Swarte Walvis (Zaandam) voor traditionele Nederlandse keuken. Molens en historische huizen perfect voor Instagram-foto's.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Noord-Holland")?.id || "",
        category: "Nederlandse Cultuur",
        rating: 4.7,
        duration: "6 uur rijden",
        distance: "165 km",
        imageUrl: "https://images.unsplash.com/photo-1602328493548-21e1b34d92d8?ixlib=rb-4.0.3",
        difficulty: "gemakkelijk",
        isPopular: 1
      },
      {
        title: "Nederlandse Kaas & Boerderij Route",
        description: "Culinaire autoroute langs kaasboerderijen: Reypenaer Kaasmakerij (Amsterdam), Alkmaar Kaasmarkt en Beenster Cheese. Stop bij Boerderij Restaurant De Vier Seizoenen voor kaasplank met wijn. Authentieke kaasmakerijen en koeienweiden voor landelijke foto's.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Noord-Holland")?.id || "",
        category: "Eten & Cultuur",
        rating: 4.6,
        duration: "5 uur rijden",
        distance: "130 km",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
        difficulty: "gemakkelijk",
        isPopular: 1
      },
      {
        title: "Kinderdijk Molens Route",
        description: "Verken de iconische 19 molens van Kinderdijk en leer over de Nederlandse strijd tegen het water. UNESCO Werelderfgoed.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Zuid-Holland")?.id || "",
        category: "Natuur & Cultuur",
        rating: 4.9,
        duration: "3 uur",
        distance: "4.5 km",
        imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3",
        difficulty: "gemiddeld",
        isPopular: 1
      },
      {
        title: "Kastelen Route Utrecht",
        description: "Deze prachtige route voert u langs drie historische kastelen in de provincie Utrecht. Ontdek de rijke geschiedenis van de Nederlandse adel.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Utrecht")?.id || "",
        category: "Geschiedenis",
        rating: 4.7,
        duration: "4 uur",
        distance: "6.5 km",
        imageUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3",
        difficulty: "gemiddeld",
        isPopular: 1
      }
    ];

    // Initialize Belgian Ardennes routes
    const ardennesRoutes: InsertRoute[] = [
      {
        title: "Kastelen Route Ardennen",
        description: "Ontdek de middeleeuwse kastelen van de Belgische Ardennen, van Bouillon tot La Roche-en-Ardenne. Een reis door de geschiedenis.",
        regionId: "", // Will be set after region creation
        category: "Geschiedenis & Kastelen",
        rating: 4.6,
        duration: "5 uur",
        distance: "125 km",
        imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?ixlib=rb-4.0.3",
        difficulty: "gemiddeld",
        isPopular: 1
      },
      {
        title: "Ardennen Natuur Route",
        description: "Wandel door de dichte bossen en langs de kronkelige rivieren van de Ardennen. Spot wilde dieren en geniet van de ongerepte natuur.",
        regionId: "", // Will be set after region creation
        category: "Natuur & Wildlife",
        rating: 4.8,
        duration: "4.5 uur",
        distance: "85 km",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3",
        difficulty: "uitdagend",
        isPopular: 1
      }
    ];

    // Set regionId for Belgian routes
    const ardennesRegion = Array.from(this.regions.values()).find(r => r.name === "Belgische Ardennen");
    if (ardennesRegion) {
      ardennesRoutes.forEach(route => {
        route.regionId = ardennesRegion.id;
      });
    }

    // Also add Zuid-Holland and other region routes
    const zuidHollandRoutes: InsertRoute[] = [
      {
        title: "Kinderdijk Molens Route",
        description: "Verken de iconische 19 molens van Kinderdijk en leer over de Nederlandse strijd tegen het water. UNESCO Werelderfgoed.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Zuid-Holland")?.id || "",
        category: "Natuur & Cultuur",
        rating: 4.9,
        duration: "3 uur",
        distance: "4.5 km",
        imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3",
        difficulty: "gemiddeld",
        isPopular: 1
      },
      {
        title: "Kastelen Route Utrecht",
        description: "Deze prachtige route voert u langs drie historische kastelen in de provincie Utrecht. Ontdek de rijke geschiedenis van de Nederlandse adel.",
        regionId: Array.from(this.regions.values()).find(r => r.name === "Utrecht")?.id || "",
        category: "Geschiedenis",
        rating: 4.7,
        duration: "4 uur",
        distance: "6.5 km",
        imageUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3",
        difficulty: "gemiddeld",
        isPopular: 1
      }
    ];

    // Create all routes
    [...dutchRoutes, ...zuidHollandRoutes, ...ardennesRoutes].forEach(route => {
      this.createRoute(route);
    });

    // Add route stops for the Kinderdijk route
    const kinderdjikRoute = Array.from(this.routes.values()).find(r => r.title === "Kinderdijk Molens Route");
    if (kinderdjikRoute) {
      const kinderdjikStops: InsertRouteStop[] = [
        {
          routeId: kinderdjikRoute.id,
          number: 1,
          title: "Bezoekerscentrum Kinderdijk",
          description: "Start je bezoek bij het informatiecentrum met introductie over de molens en waterbeheersing.",
          duration: "30 min",
          hasAudio: 1,
          coordinates: { lat: 51.8845, lng: 4.6407 }
        },
        {
          routeId: kinderdjikRoute.id,
          number: 2,
          title: "Overwaard Molens 1-8",
          description: "Wandel langs de eerste acht molens van de Overwaard met prachtige fotomogelijkheden.",
          duration: "45 min",
          hasAudio: 1,
          coordinates: { lat: 51.8822, lng: 4.6389 }
        },
        {
          routeId: kinderdjikRoute.id,
          number: 3,
          title: "Nederwaard Molens 1-8",
          description: "Verken de Nederwaard molens aan de andere kant van het kanaal.",
          duration: "40 min",
          hasAudio: 1,
          coordinates: { lat: 51.8801, lng: 4.6342 }
        },
        {
          routeId: kinderdjikRoute.id,
          number: 4,
          title: "Museum Molen Blokweer",
          description: "Bezoek het museum in een authentieke molen en leer over het leven van de molenaars.",
          duration: "35 min",
          hasAudio: 1,
          coordinates: { lat: 51.8833, lng: 4.6378 }
        }
      ];

      kinderdjikStops.forEach(stop => {
        this.createRouteStop(stop);
      });
    }

    // Add route stops for the castle route
    const castleRoute = Array.from(this.routes.values()).find(r => r.title === "Kastelen Route Utrecht");
    if (castleRoute) {
      const stops: InsertRouteStop[] = [
        {
          routeId: castleRoute.id,
          number: 1,
          title: "Kasteel de Haar",
          description: "Het grootste kasteel van Nederland met prachtige tuinen en een rijke geschiedenis.",
          duration: "45 min",
          hasAudio: 1,
          coordinates: { lat: 52.1089, lng: 5.0106 }
        },
        {
          routeId: castleRoute.id,
          number: 2,
          title: "Slot Zuylen",
          description: "Middeleeuws kasteel aan de rivier de Vecht, bekend van schrijfster Belle van Zuylen.",
          duration: "30 min",
          hasAudio: 1,
          coordinates: { lat: 52.1269, lng: 5.0892 }
        },
        {
          routeId: castleRoute.id,
          number: 3,
          title: "Kasteel Ruurlo",
          description: "Een 14e-eeuws kasteel met een prachtige collectie moderne kunst.",
          duration: "40 min",
          hasAudio: 1,
          coordinates: { lat: 52.0845, lng: 6.4567 }
        }
      ];

      stops.forEach(stop => {
        this.createRouteStop(stop);
      });

      // Add audio track for the route
      this.createAudioTrack({
        routeId: castleRoute.id,
        stopId: undefined,
        title: "Introductie - Kastelen van Utrecht",
        duration: "12:34",
        fileUrl: "/audio/kastelen-intro.mp3",
        transcript: "Welkom bij de Kastelen Route Utrecht..."
      });
    }

    // Add route stops for Ardennes Kastelen Route
    const ardennesKastelenRoute = Array.from(this.routes.values()).find(r => r.title === "Kastelen Route Ardennen");
    if (ardennesKastelenRoute) {
      const ardennesStops: InsertRouteStop[] = [
        {
          routeId: ardennesKastelenRoute.id,
          number: 1,
          title: "Kasteel van Bouillon",
          description: "Het oudste kasteel van België, gebouwd in de 8e eeuw door Godfried van Bouillon tijdens de kruistochten.",
          duration: "45 min",
          hasAudio: 1,
          coordinates: { lat: 49.7938, lng: 5.0664 }
        },
        {
          routeId: ardennesKastelenRoute.id,
          number: 2,
          title: "Kasteel van La Roche-en-Ardenne",
          description: "Ruïnes van een 11e-eeuws kasteel met spectaculair uitzicht over de rivier de Ourthe.",
          duration: "40 min",
          hasAudio: 1,
          coordinates: { lat: 50.1825, lng: 5.5789 }
        },
        {
          routeId: ardennesKastelenRoute.id,
          number: 3,
          title: "Kasteel van Reinhardstein",
          description: "Prachtig gerestaureerd 14e-eeuws kasteel in een dramatische bergachtige omgeving.",
          duration: "50 min",
          hasAudio: 1,
          coordinates: { lat: 50.4186, lng: 6.0975 }
        }
      ];

      ardennesStops.forEach(stop => {
        this.createRouteStop(stop);
      });

      // Add audio track for Ardennes castle route
      this.createAudioTrack({
        routeId: ardennesKastelenRoute.id,
        stopId: undefined,
        title: "Introductie - Kastelen van de Ardennen",
        duration: "14:22",
        fileUrl: "/audio/ardennen-kastelen-intro.mp3",
        transcript: "Welkom bij de Kastelen Route van de Belgische Ardennen..."
      });
    }

    // Add route stops for Ardennes Natuur Route
    const ardennesNatuurRoute = Array.from(this.routes.values()).find(r => r.title === "Ardennen Natuur Route");
    if (ardennesNatuurRoute) {
      const natuurStops: InsertRouteStop[] = [
        {
          routeId: ardennesNatuurRoute.id,
          number: 1,
          title: "Hoge Venen Nationaal Park",
          description: "Uniek hoogveenlandschap met veenmoerassen, wilde orchideeën en zeldzame vogels.",
          duration: "60 min",
          hasAudio: 1,
          coordinates: { lat: 50.5056, lng: 6.1000 }
        },
        {
          routeId: ardennesNatuurRoute.id,
          number: 2,
          title: "Ourthe Rivier Wandeling",
          description: "Volg de meanderende rivier door dichte bossen met kans op het spotten van bevers en ijsvogels.",
          duration: "45 min",
          hasAudio: 1,
          coordinates: { lat: 50.1589, lng: 5.6036 }
        },
        {
          routeId: ardennesNatuurRoute.id,
          number: 3,
          title: "Ardennen Wildlife Kijkpunt",
          description: "Observatieplatform voor het spotten van wilde zwijnen, reeën en roofvogels in hun natuurlijke habitat.",
          duration: "35 min",
          hasAudio: 1,
          coordinates: { lat: 50.2456, lng: 5.7892 }
        }
      ];

      natuurStops.forEach(stop => {
        this.createRouteStop(stop);
      });

      // Add audio track for Ardennes nature route
      this.createAudioTrack({
        routeId: ardennesNatuurRoute.id,
        stopId: undefined,
        title: "Introductie - Ardennen Natuur",
        duration: "11:45",
        fileUrl: "/audio/ardennen-natuur-intro.mp3",
        transcript: "Welkom bij de Natuur Route van de Belgische Ardennen..."
      });
    }
  }

  async getAllRegions(): Promise<Region[]> {
    return Array.from(this.regions.values());
  }

  async getRegionById(id: string): Promise<Region | undefined> {
    return this.regions.get(id);
  }

  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const id = randomUUID();
    const region: Region = { 
      ...insertRegion, 
      id,
      routeCount: insertRegion.routeCount ?? 0
    };
    this.regions.set(id, region);
    return region;
  }

  async getAllRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRouteById(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async getRoutesByRegion(regionId: string): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(route => route.regionId === regionId);
  }

  async getPopularRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(route => route.isPopular === 1);
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = { 
      ...insertRoute, 
      id,
      rating: insertRoute.rating ?? 0,
      difficulty: insertRoute.difficulty ?? "gemakkelijk",
      isPopular: insertRoute.isPopular ?? 0
    };
    this.routes.set(id, route);
    return route;
  }

  async getRouteStops(routeId: string): Promise<RouteStop[]> {
    return Array.from(this.routeStops.values())
      .filter(stop => stop.routeId === routeId)
      .sort((a, b) => a.number - b.number);
  }

  async createRouteStop(insertStop: InsertRouteStop): Promise<RouteStop> {
    const id = randomUUID();
    const stop: RouteStop = { 
      ...insertStop, 
      id,
      hasAudio: insertStop.hasAudio ?? 0,
      coordinates: insertStop.coordinates ?? null
    };
    this.routeStops.set(id, stop);
    return stop;
  }

  async getAudioTracksByRoute(routeId: string): Promise<AudioTrack[]> {
    return Array.from(this.audioTracks.values()).filter(track => track.routeId === routeId);
  }

  async getAudioTrackByStop(stopId: string): Promise<AudioTrack | undefined> {
    return Array.from(this.audioTracks.values()).find(track => track.stopId === stopId);
  }

  async createAudioTrack(insertTrack: InsertAudioTrack): Promise<AudioTrack> {
    const id = randomUUID();
    const track: AudioTrack = { 
      ...insertTrack, 
      id,
      routeId: insertTrack.routeId ?? null,
      stopId: insertTrack.stopId ?? null,
      fileUrl: insertTrack.fileUrl ?? null,
      transcript: insertTrack.transcript ?? null
    };
    this.audioTracks.set(id, track);
    return track;
  }

  // Reviews methods
  async getReviewsByRoute(routeId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.routeId === routeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      userEmail: insertReview.userEmail ?? null,
      visitDate: insertReview.visitDate ?? null,
      createdAt: new Date().toISOString(),
      isVerified: insertReview.isVerified ?? 0
    };
    this.reviews.set(id, review);
    return review;
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  // Photos methods
  async getPhotosByRoute(routeId: string): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .filter(photo => photo.routeId === routeId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async getPhotosByStop(stopId: string): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .filter(photo => photo.stopId === stopId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = {
      ...insertPhoto,
      id,
      stopId: insertPhoto.stopId ?? null,
      reviewId: insertPhoto.reviewId ?? null,
      caption: insertPhoto.caption ?? null,
      uploadedAt: new Date().toISOString(),
      isApproved: insertPhoto.isApproved ?? 0
    };
    this.photos.set(id, photo);
    return photo;
  }

  async getPhotoById(id: string): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  // Initialize sample reviews and photos
  private initializeReviewsAndPhotos() {
    // Get some existing routes for sample data
    const routes = Array.from(this.routes.values());
    if (routes.length === 0) return;

    const amsterdamRoute = routes.find(r => r.title.includes("Amsterdam"));
    const kastelenRoute = routes.find(r => r.title.includes("Kastelen"));

    if (amsterdamRoute) {
      // Sample reviews for Amsterdam route
      this.createReview({
        routeId: amsterdamRoute.id,
        userName: "Emma van der Berg",
        userEmail: "emma@example.com",
        rating: 5,
        title: "Prachtige rondleiding door de grachten",
        comment: "Wat een geweldige manier om Amsterdam te ontdekken! De audio gids was informatief en de route bracht ons langs alle belangrijke bezienswaardigheden. Zeker een aanrader voor toeristen en locals.",
        visitDate: "2024-12-15",
        isVerified: 1
      });

      this.createReview({
        routeId: amsterdamRoute.id,
        userName: "Michael Schmidt",
        userEmail: "m.schmidt@example.com", 
        rating: 4,
        title: "Leuke historische route",
        comment: "Mooie route met veel interessante verhalen over de geschiedenis van Amsterdam. Alleen jammer dat het zo druk was op sommige plekken. Verder een zeer geslaagde ervaring!",
        visitDate: "2024-12-10",
        isVerified: 1
      });

      // Sample photos for Amsterdam route
      this.createPhoto({
        routeId: amsterdamRoute.id,
        stopId: null,
        reviewId: null,
        fileName: "amsterdam-grachten-1.jpg",
        originalName: "IMG_2024_amsterdam.jpg",
        fileUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&w=800",
        caption: "Prachtig uitzicht over de grachten vanaf de brug",
        userName: "Emma van der Berg",
        isApproved: 1
      });

      this.createPhoto({
        routeId: amsterdamRoute.id,
        stopId: null,
        reviewId: null,
        fileName: "amsterdam-grachten-2.jpg",
        originalName: "canal-houses.jpg", 
        fileUrl: "https://images.unsplash.com/photo-1471002634840-4bbe1b8b10a1?ixlib=rb-4.0.3&w=800",
        caption: "Traditionele grachtenpanden in het avondlicht",
        userName: "Michael Schmidt",
        isApproved: 1
      });
    }

    if (kastelenRoute) {
      // Sample review for Belgian castle route
      this.createReview({
        routeId: kastelenRoute.id,
        userName: "Sophie Dubois",
        userEmail: "sophie.dubois@example.be",
        rating: 5,
        title: "Magnifieke kastelen in de Ardennen",
        comment: "Une route absolument fantastique à travers les plus beaux châteaux des Ardennes! Le château de Bouillon était particulièrement impressionnant. Parfait pour un weekend découverte.",
        visitDate: "2024-11-28",
        isVerified: 1
      });

      // Sample photo for Belgian route
      this.createPhoto({
        routeId: kastelenRoute.id,
        stopId: null,
        reviewId: null,
        fileName: "bouillon-castle.jpg",
        originalName: "chateau-bouillon.jpg",
        fileUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&w=800",
        caption: "Het imposante kasteel van Bouillon boven de rivier",
        userName: "Sophie Dubois", 
        isApproved: 1
      });
    }
  }
}

export const storage = new MemStorage();
