import { type Region, type InsertRegion, type Route, type InsertRoute, type RouteStop, type InsertRouteStop, type AudioTrack, type InsertAudioTrack, type Review, type InsertReview, type Photo, type InsertPhoto, type CastleLandmark, type InsertCastleLandmark } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { routes, regions, routeStops, audioTracks, reviews, photos, castleLandmarks } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

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
  updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route>;
  deleteRoute(id: string): Promise<void>;

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

  // Castle Landmarks
  getAllCastleLandmarks(): Promise<CastleLandmark[]>;
  getCastleLandmarkById(id: string): Promise<CastleLandmark | undefined>;
  getCastleLandmarksByRoute(routeId: string): Promise<CastleLandmark[]>;
  createCastleLandmark(castle: InsertCastleLandmark): Promise<CastleLandmark>;

  // Multi-day Routes
  getAllMultiDayRoutes(): Promise<MultiDayRoute[]>;
  getMultiDayRouteById(id: string): Promise<MultiDayRoute | undefined>;
  getMultiDayRoutesByRegion(regionId: string): Promise<MultiDayRoute[]>;
  createMultiDayRoute(route: InsertMultiDayRoute): Promise<MultiDayRoute>;

  // Itinerary Days
  getItineraryDaysByRoute(multiDayRouteId: string): Promise<ItineraryDay[]>;
  getItineraryDayById(id: string): Promise<ItineraryDay | undefined>;
  createItineraryDay(day: InsertItineraryDay): Promise<ItineraryDay>;

  // Accommodations
  getAllAccommodations(): Promise<Accommodation[]>;
  getAccommodationById(id: string): Promise<Accommodation | undefined>;
  getAccommodationsByLocation(location: string): Promise<Accommodation[]>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;

  // Booking Tracking
  createBookingTracking(booking: InsertBookingTracking): Promise<BookingTracking>;
  getBookingsByUser(userId: string): Promise<BookingTracking[]>;
  updateBookingStatus(bookingId: string, status: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private regions: Map<string, Region>;
  private routes: Map<string, Route>;
  private routeStops: Map<string, RouteStop>;
  private audioTracks: Map<string, AudioTrack>;
  private reviews: Map<string, Review>;
  private photos: Map<string, Photo>;
  private castleLandmarks: Map<string, CastleLandmark>;
  private multiDayRoutes: Map<string, MultiDayRoute>;
  private itineraryDays: Map<string, ItineraryDay>;
  private accommodations: Map<string, Accommodation>;
  private bookingTracking: Map<string, BookingTracking>;

  constructor() {
    this.regions = new Map();
    this.routes = new Map();
    this.routeStops = new Map();
    this.audioTracks = new Map();
    this.reviews = new Map();
    this.photos = new Map();
    this.castleLandmarks = new Map();
    this.multiDayRoutes = new Map();
    this.itineraryDays = new Map();
    this.accommodations = new Map();
    this.bookingTracking = new Map();
    this.initializeData();
    this.initializeCastleLandmarks(); // Move after routes are created
    this.initializeReviewsAndPhotos();
    this.initializeAccommodations();
    this.initializeMultiDayRoutes();
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

    // Initialize all regions with fixed IDs
    const regionIds = {
      "Noord-Holland": "region-noord-holland",
      "Zuid-Holland": "region-zuid-holland", 
      "Utrecht": "region-utrecht",
      "Zeeland": "region-zeeland",
      "Gelderland": "region-gelderland",
      "Overijssel": "region-overijssel",
      "Belgische Ardennen": "region-belgische-ardennen"
    };

    [...dutchRegions, ...belgianRegions].forEach(region => {
      const id = regionIds[region.name] || randomUUID();
      const newRegion: Region = { id, ...region };
      this.regions.set(id, newRegion);
    });

    // Automotive routes voor autorijders - echte routes langs mooie dorpjes en bezienswaardigheden
    const dutchRoutes: InsertRoute[] = [
      {
        title: "Kastelen Route Noord-Holland",
        description: "Spectaculaire autoroute langs Nederlandse kastelen: Muiderslot, Kasteel De Haar en Slot Assumburg. Stop bij Restaurant De Kazerne (Muiden) voor lunch met kasteelzicht. Perfecte fotomomenten bij historische vestingwerken.",
        regionId: "region-noord-holland",
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
        regionId: "region-noord-holland",
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
        regionId: "region-noord-holland",
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
        regionId: "region-noord-holland",
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
        regionId: "region-noord-holland",
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
        regionId: "region-noord-holland",
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
        regionId: "region-noord-holland",
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
        regionId: "region-noord-holland",
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
        regionId: "region-zuid-holland",
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
        regionId: "region-utrecht",
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
        regionId: "region-belgische-ardennen", // Will be set after region creation
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
        regionId: "region-belgische-ardennen", // Will be set after region creation
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
    ardennesRoutes.forEach(route => {
      route.regionId = "region-belgische-ardennen";
    });

    // Also add Zuid-Holland and other region routes
    const zuidHollandRoutes: InsertRoute[] = [
      {
        title: "Kinderdijk Molens Route",
        description: "Verken de iconische 19 molens van Kinderdijk en leer over de Nederlandse strijd tegen het water. UNESCO Werelderfgoed.",
        regionId: "region-zuid-holland",
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
        regionId: "region-utrecht",
        category: "Geschiedenis",
        rating: 4.7,
        duration: "4 uur",
        distance: "6.5 km",
        imageUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3",
        difficulty: "gemiddeld",
        isPopular: 1
      }
    ];

    // Create all routes with fixed IDs
    const routeIds = [
      "route-kastelen-noord-holland",
      "route-dorpjes-noord-holland", 
      "route-bier-noord-holland",
      "route-kust-noord-holland",
      "route-landgoederen-noord-holland",
      "route-wadden-noord-holland",
      "route-erfgoed-noord-holland",
      "route-kaas-noord-holland",
      "route-kinderdijk-zuid-holland",
      "route-kastelen-utrecht",
      "route-kinderdijk-dup-zuid-holland",
      "route-kastelen-dup-utrecht", 
      "route-kastelen-ardennen",
      "route-natuur-ardennen"
    ];

    [...dutchRoutes, ...zuidHollandRoutes, ...ardennesRoutes].forEach((route, index) => {
      const id = routeIds[index] || randomUUID();
      const newRoute: Route = {
        id,
        ...route,
        isUserCreated: route.isUserCreated ?? false,
        createdBy: route.createdBy || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.routes.set(id, newRoute);
    });

    // Add route stops for the Kinderdijk route
    const kinderdjikRoute = this.routes.get("route-kinderdijk-zuid-holland");
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

    // Add stops for all other Dutch routes
    this.addDutchRouteStops();
  }

  private addDutchRouteStops() {
    // Add stops for Noord-Holland kastelen route
    const noordHollandKastelenRoute = Array.from(this.routes.values()).find(r => r.title === "Kastelen Route Noord-Holland");
    if (noordHollandKastelenRoute) {
      const stops: InsertRouteStop[] = [
        {
          routeId: noordHollandKastelenRoute.id,
          number: 1,
          title: "Muiderslot",
          description: "Het beroemdste kasteel van Nederland in Muiden, bekend van de Geuzen en Hooft.",
          duration: "50 min",
          hasAudio: 1,
          coordinates: { lat: 52.3276, lng: 5.0689 }
        },
        {
          routeId: noordHollandKastelenRoute.id,
          number: 2,
          title: "Restaurant De Kazerne",
          description: "Lunchen met kasteelzicht in Muiden, gevestigd in een oude kazerne.",
          duration: "60 min",
          hasAudio: 0,
          coordinates: { lat: 52.3298, lng: 5.0712 }
        },
        {
          routeId: noordHollandKastelenRoute.id,
          number: 3,
          title: "Slot Assumburg",
          description: "Ruïne van een 13e-eeuws kasteel in Heemskerk, met een mysterieuze geschiedenis.",
          duration: "30 min",
          hasAudio: 1,
          coordinates: { lat: 52.5089, lng: 4.6756 }
        }
      ];

      stops.forEach(stop => {
        this.createRouteStop(stop);
      });

      this.createAudioTrack({
        routeId: noordHollandKastelenRoute.id,
        stopId: undefined,
        title: "Introductie - Kastelen van Noord-Holland",
        duration: "11:45",
        fileUrl: "/audio/noord-holland-kastelen-intro.mp3",
        transcript: "Welkom bij de Kastelen Route Noord-Holland. Ontdek de verhalen achter Muiderslot..."
      });
    }

    // Add stops for Zuid-Holland eten route
    const zuidHollandEtenRoute = Array.from(this.routes.values()).find(r => r.title === "Eten & Drinken Route Zuid-Holland");
    if (zuidHollandEtenRoute) {
      const stops: InsertRouteStop[] = [
        {
          routeId: zuidHollandEtenRoute.id,
          number: 1,
          title: "Kaasmarkt Gouda",
          description: "Traditionele kaasmarkt op het historische marktplein, elke donderdag in de zomer.",
          duration: "45 min",
          hasAudio: 1,
          coordinates: { lat: 52.0115, lng: 4.7077 }
        },
        {
          routeId: zuidHollandEtenRoute.id,
          number: 2,
          title: "Restaurant De Mallemolen",
          description: "Sterrenrestaurant in Gouda, perfect voor een culinaire lunch.",
          duration: "90 min",
          hasAudio: 0,
          coordinates: { lat: 52.0134, lng: 4.7156 }
        },
        {
          routeId: zuidHollandEtenRoute.id,
          number: 3,
          title: "Stroopwafelbakkerij Gouda",
          description: "Verse stroopwafels bij de oudste bakkerij van Nederland.",
          duration: "20 min",
          hasAudio: 0,
          coordinates: { lat: 52.0108, lng: 4.7089 }
        },
        {
          routeId: zuidHollandEtenRoute.id,
          number: 4,
          title: "Picknick bij Reeuwijkse Plassen",
          description: "Instagram-waardig picknicken met uitzicht over de meren.",
          duration: "60 min",
          hasAudio: 0,
          coordinates: { lat: 52.0456, lng: 4.7234 }
        }
      ];

      stops.forEach(stop => {
        this.createRouteStop(stop);
      });

      this.createAudioTrack({
        routeId: zuidHollandEtenRoute.id,
        stopId: undefined,
        title: "Introductie - Eten & Drinken Zuid-Holland",
        duration: "9:32",
        fileUrl: "/audio/zuid-holland-eten-intro.mp3",
        transcript: "Welkom bij de culinaire route door Zuid-Holland. Proef de authentieke smaken..."
      });
    }

    // Add stops for Zeeland strand route
    const zeelandStrandRoute = Array.from(this.routes.values()).find(r => r.title === "Strand & Restaurants Zeeland");
    if (zeelandStrandRoute) {
      const stops: InsertRouteStop[] = [
        {
          routeId: zeelandStrandRoute.id,
          number: 1,
          title: "Domburg Strand",
          description: "Het meest fotogenieke strand van Zeeland, perfect voor zonsondergang foto's.",
          duration: "40 min",
          hasAudio: 1,
          coordinates: { lat: 51.5656, lng: 3.4967 }
        },
        {
          routeId: zeelandStrandRoute.id,
          number: 2,
          title: "Restaurant De Brekers",
          description: "Strandpaviljoen met verse zeevruchten en zeezicht in Domburg.",
          duration: "75 min",
          hasAudio: 0,
          coordinates: { lat: 51.5645, lng: 3.4945 }
        },
        {
          routeId: zeelandStrandRoute.id,
          number: 3,
          title: "Westkapelle Lighthouse",
          description: "Historische vuurtoren met panoramisch uitzicht, ideaal voor Instagram.",
          duration: "30 min",
          hasAudio: 1,
          coordinates: { lat: 51.5289, lng: 3.4234 }
        },
        {
          routeId: zeelandStrandRoute.id,
          number: 4,
          title: "Zeeuwse Oesterkwekerij",
          description: "Proef verse oesters direct van de kwekerij met zeezicht.",
          duration: "45 min",
          hasAudio: 0,
          coordinates: { lat: 51.5378, lng: 3.4567 }
        }
      ];

      stops.forEach(stop => {
        this.createRouteStop(stop);
      });

      this.createAudioTrack({
        routeId: zeelandStrandRoute.id,
        stopId: undefined,
        title: "Introductie - Zeeland Strand Route",
        duration: "10:15",
        fileUrl: "/audio/zeeland-strand-intro.mp3",
        transcript: "Welkom bij de Zeeland Strand Route. Ontdek de mooiste stranden..."
      });
    }

    // Add stops for Gelderland natuur route
    const gelderlandNatuurRoute = Array.from(this.routes.values()).find(r => r.title === "Natuur & Dorpjes Gelderland");
    if (gelderlandNatuurRoute) {
      const stops: InsertRouteStop[] = [
        {
          routeId: gelderlandNatuurRoute.id,
          number: 1,
          title: "Nationaal Park Hoge Veluwe",
          description: "Iconische natuurgebied met het Kröller-Müller Museum en witte fietsjes.",
          duration: "120 min",
          hasAudio: 1,
          coordinates: { lat: 52.0878, lng: 5.8345 }
        },
        {
          routeId: gelderlandNatuurRoute.id,
          number: 2,
          title: "Bronkhorst",
          description: "Het kleinste stadje van Nederland, perfect voor instagramfoto's.",
          duration: "45 min",
          hasAudio: 1,
          coordinates: { lat: 52.1456, lng: 6.1978 }
        },
        {
          routeId: gelderlandNatuurRoute.id,
          number: 3,
          title: "Restaurant In de Karkol",
          description: "Sterrenrestaurant in Bronkhorst in een historisch pand.",
          duration: "90 min",
          hasAudio: 0,
          coordinates: { lat: 52.1467, lng: 6.1989 }
        },
        {
          routeId: gelderlandNatuurRoute.id,
          number: 4,
          title: "Zutphen Hanzestad",
          description: "Middeleeuwse hanzestad met torens en Oude Boekenmarkt.",
          duration: "60 min",
          hasAudio: 1,
          coordinates: { lat: 52.1456, lng: 6.2023 }
        }
      ];

      stops.forEach(stop => {
        this.createRouteStop(stop);
      });

      this.createAudioTrack({
        routeId: gelderlandNatuurRoute.id,
        stopId: undefined,
        title: "Introductie - Gelderland Natuur Route",
        duration: "11:28",
        fileUrl: "/audio/gelderland-natuur-intro.mp3",
        transcript: "Welkom bij de Gelderland Natuur Route. Ervaar de prachtige natuur..."
      });
    }

    // Add stops for Overijssel bier route
    const overijsselBierRoute = Array.from(this.routes.values()).find(r => r.title === "Bier & Cultuur Overijssel");
    if (overijsselBierRoute) {
      const stops: InsertRouteStop[] = [
        {
          routeId: overijsselBierRoute.id,
          number: 1,
          title: "Brouwerij Grolsch",
          description: "Rondleiding bij de beroemdste brouwerij van Nederland in Enschede.",
          duration: "75 min",
          hasAudio: 1,
          coordinates: { lat: 52.2234, lng: 6.8789 }
        },
        {
          routeId: overijsselBierRoute.id,
          number: 2,
          title: "Deventer Bergkwartier",
          description: "Historisch centrum met gezellige cafés en biertuinen.",
          duration: "90 min",
          hasAudio: 1,
          coordinates: { lat: 52.2545, lng: 6.1634 }
        },
        {
          routeId: overijsselBierRoute.id,
          number: 3,
          title: "De Lachende Koe",
          description: "Ambachtelijke brouwerij met terras aan het water in Kampen.",
          duration: "60 min",
          hasAudio: 0,
          coordinates: { lat: 52.5567, lng: 5.9156 }
        },
        {
          routeId: overijsselBierRoute.id,
          number: 4,
          title: "Zwolle Hanzestad",
          description: "Bruisende hanzestad met bierbrouwerijen en terrasjes.",
          duration: "75 min",
          hasAudio: 1,
          coordinates: { lat: 52.5125, lng: 6.0944 }
        }
      ];

      stops.forEach(stop => {
        this.createRouteStop(stop);
      });

      this.createAudioTrack({
        routeId: overijsselBierRoute.id,
        stopId: undefined,
        title: "Introductie - Overijssel Bier Route",
        duration: "8:45",
        fileUrl: "/audio/overijssel-bier-intro.mp3",
        transcript: "Welkom bij de Overijssel Bier Route. Proef de beste bieren..."
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

  // Castle Landmarks methods
  async getAllCastleLandmarks(): Promise<CastleLandmark[]> {
    return Array.from(this.castleLandmarks.values());
  }

  async getCastleLandmarkById(id: string): Promise<CastleLandmark | undefined> {
    return this.castleLandmarks.get(id);
  }

  async getCastleLandmarksByRoute(routeId: string): Promise<CastleLandmark[]> {
    return Array.from(this.castleLandmarks.values()).filter(castle => 
      Array.isArray(castle.routeIds) && castle.routeIds.includes(routeId)
    );
  }

  async createCastleLandmark(castleData: InsertCastleLandmark): Promise<CastleLandmark> {
    const castle: CastleLandmark = {
      id: randomUUID(),
      ...castleData,
    };
    this.castleLandmarks.set(castle.id, castle);
    return castle;
  }

  private initializeCastleLandmarks() {
    // Get route IDs for linking castles to routes
    const kastelenRoutes = Array.from(this.routes.values()).filter(r => 
      r.title.toLowerCase().includes('kasteel') || r.category.toLowerCase().includes('kastelen')
    );
    const noordHollandRoute = kastelenRoutes.find(r => r.title.includes('Noord-Holland'));
    const utrechtRoute = kastelenRoutes.find(r => r.title.includes('Utrecht'));
    const ardennenRoute = kastelenRoutes.find(r => r.title.includes('Ardennen'));

    const castleData: InsertCastleLandmark[] = [
      {
        name: "Kasteel Muiderslot",
        location: "Muiden, Noord-Holland", 
        description: "Een van de best bewaarde middeleeuwse kastelen van Nederland, gebouwd in 1285 door Graaf Floris V. Het kasteel ligt strategisch aan de monding van de Vecht en biedt een prachtige combinatie van geschiedenis en architectuur.",
        imageUrl: "https://images.unsplash.com/photo-1549813069-f95e44d7f498?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        historicalPeriod: "13e eeuw",
        builtYear: 1285,
        architecturalStyle: "Middeleeuwse vesting",
        visitDuration: "1,5-2 uur",
        entryFee: "€16,50 volwassenen",
        highlights: [
          "Authentiek interieur uit de Gouden Eeuw",
          "Wapenmuseum met middeleeuwse uitrusting", 
          "Prachtige tuinen met historische planten",
          "Panoramisch uitzicht vanaf de torens"
        ],
        funFacts: [
          "Graaf Floris V werd hier gevangen gehouden voordat hij werd vermoord",
          "Het kasteel diende als inspiratie voor vele sprookjes",
          "P.C. Hooft organiseerde hier literaire bijeenkomsten in de 17e eeuw",
          "De slotgracht is nog steeds gevuld met water uit de Vecht"
        ],
        parkingInfo: "Gratis parkeren op 200 meter van het kasteel. Druk tijdens weekenden, vroeg komen aanbevolen.",
        instagramSpots: [
          "Hoofdingang met ophaalbrug",
          "Binnenplaats met oude waterput", 
          "Uitzicht vanaf de ridderzaal",
          "Kasteel weerspiegeling in de gracht"
        ],
        coordinates: { lat: 52.3353, lng: 5.0702 },
        routeIds: noordHollandRoute ? [noordHollandRoute.id] : []
      },
      {
        name: "Kasteel de Haar",
        location: "Haarzuilens, Utrecht",
        description: "Het grootste en meest luxueuze kasteel van Nederland, herbouwd in neo-gotische stijl aan het einde van de 19e eeuw. Met zijn sprookjesachtige torens en prachtige parken is het een absolute must-see.",
        imageUrl: "https://images.unsplash.com/photo-1549813069-f95e44d7f498?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        historicalPeriod: "19e eeuw (herbouw)",
        builtYear: 1892,
        architecturalStyle: "Neo-gotiek",
        visitDuration: "2-3 uur",
        entryFee: "€17,50 volwassenen",
        highlights: [
          "Luxueuze kamers met originele meubels",
          "Grote bibliotheek met duizenden boeken",
          "Japanse tuin en rozen labyrint",
          "Imposante ridderzaal met gewelven"
        ],
        funFacts: [
          "Heeft meer kamers dan Buckingham Palace",
          "Het hele dorp Haarzuilens werd verplaatst voor de herbouw",
          "Elk jaar wordt het kasteel helemaal leeggehaald voor de winter",
          "De familie Van Zuylen woont er nog steeds een deel van het jaar"
        ],
        parkingInfo: "Ruime parkeerplaats direct bij het kasteel, €5 per dag. Shuttle service naar ingang beschikbaar.",
        instagramSpots: [
          "Hoofdfaçade met alle torens",
          "Ophaalbrug ingang",
          "Bibliotheek met houten boekenkasten",
          "Kasteel vanaf de vijver"
        ],
        coordinates: { lat: 52.1201, lng: 5.1319 },
        routeIds: utrechtRoute ? [utrechtRoute.id] : []
      },
      {
        name: "Kasteel van Bouillon",
        location: "Bouillon, Belgische Ardennen",
        description: "Een van de oudste kastelen van Europa, gebouwd op een rotsblok boven de Semois rivier. Het kasteel van Godfried van Bouillon, leider van de Eerste Kruistocht, ademt eeuwenoude geschiedenis uit.",
        imageUrl: "https://images.unsplash.com/photo-1549813069-f95e44d7f498?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        historicalPeriod: "11e eeuw",
        builtYear: 1060,
        architecturalStyle: "Romaanse burchtarchitectuur",
        visitDuration: "1,5-2 uur",
        entryFee: "€9,50 volwassenen",
        highlights: [
          "Spectaculair uitzicht over de Semois vallei",
          "Middeleeuwse martelkamer",
          "Authentieke gewelven en torens",
          "Kruistocht geschiedenis museum"
        ],
        funFacts: [
          "Godfried van Bouillon verkocht het kasteel om de Eerste Kruistocht te financieren",
          "Het kasteel werd nooit volledig ingenomen tijdens belegeringen",
          "Er zijn geheime gangen die naar de rivier leiden",
          "Napoleon bezocht het kasteel tijdens zijn veldtochten"
        ],
        parkingInfo: "Parkeren in het centrum van Bouillon, 5 minuten lopen naar kasteel ingang.",
        instagramSpots: [
          "Kasteel vanaf de Semois brug",
          "Panorama vanaf de hoofdtoren",
          "Middeleeuwse binnenplaats",
          "Uitzicht over de rivier bocht"
        ],
        coordinates: { lat: 49.7930, lng: 5.0661 },
        routeIds: ardennenRoute ? [ardennenRoute.id] : []
      }
    ];

    castleData.forEach(castle => {
      const newCastle: CastleLandmark = {
        id: randomUUID(),
        ...castle,
      };
      this.castleLandmarks.set(newCastle.id, newCastle);
    });
  }

  // Multi-day Routes implementation
  async getAllMultiDayRoutes(): Promise<MultiDayRoute[]> {
    return Array.from(this.multiDayRoutes.values());
  }

  async getMultiDayRouteById(id: string): Promise<MultiDayRoute | undefined> {
    return this.multiDayRoutes.get(id);
  }

  async getMultiDayRoutesByRegion(regionId: string): Promise<MultiDayRoute[]> {
    return Array.from(this.multiDayRoutes.values()).filter(route => route.regionId === regionId);
  }

  async createMultiDayRoute(route: InsertMultiDayRoute): Promise<MultiDayRoute> {
    const id = randomUUID();
    const newRoute: MultiDayRoute = {
      id,
      ...route,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.multiDayRoutes.set(id, newRoute);
    return newRoute;
  }

  // Itinerary Days implementation
  async getItineraryDaysByRoute(multiDayRouteId: string): Promise<ItineraryDay[]> {
    return Array.from(this.itineraryDays.values())
      .filter(day => day.multiDayRouteId === multiDayRouteId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }

  async getItineraryDayById(id: string): Promise<ItineraryDay | undefined> {
    return this.itineraryDays.get(id);
  }

  async createItineraryDay(day: InsertItineraryDay): Promise<ItineraryDay> {
    const id = randomUUID();
    const newDay: ItineraryDay = { id, ...day };
    this.itineraryDays.set(id, newDay);
    return newDay;
  }

  // Accommodations implementation
  async getAllAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getAccommodationById(id: string): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async getAccommodationsByLocation(location: string): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values())
      .filter(acc => acc.location.toLowerCase().includes(location.toLowerCase()));
  }

  async createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation> {
    const id = randomUUID();
    const newAccommodation: Accommodation = {
      id,
      ...accommodation,
      createdAt: new Date()
    };
    this.accommodations.set(id, newAccommodation);
    return newAccommodation;
  }

  // Booking Tracking implementation
  async createBookingTracking(booking: InsertBookingTracking): Promise<BookingTracking> {
    const id = randomUUID();
    const newBooking: BookingTracking = {
      id,
      ...booking,
      createdAt: new Date()
    };
    this.bookingTracking.set(id, newBooking);
    return newBooking;
  }

  async getBookingsByUser(userId: string): Promise<BookingTracking[]> {
    return Array.from(this.bookingTracking.values())
      .filter(booking => booking.userId === userId);
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    const booking = this.bookingTracking.get(bookingId);
    if (booking) {
      booking.bookingStatus = status;
      this.bookingTracking.set(bookingId, booking);
    }
  }

  // Initialize authentic Dutch accommodations with affiliate links
  private initializeAccommodations() {
    const authenticAccommodations: InsertAccommodation[] = [
      {
        name: "Kasteel Hotel TweeKasteel",
        type: "Kasteel Hotel", 
        location: "Twello, Gelderland",
        description: "Authentiek kasteel hotel uit de 14e eeuw in het hart van Gelderland. Perfecte uitvalsbasis voor kasteel routes met restaurant dat lokale specialiteiten serveert.",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
        pricePerNight: "€180-250",
        rating: 4.8,
        amenities: ["Historisch interieur", "Fine dining restaurant", "Kasteel tuinen", "Parkeren", "WiFi", "Ontbijt"],
        airbnbUrl: "https://www.airbnb.com/rooms/kasteel-hotel-tweekasteel",
        airbnbAffiliateCode: "AFFILIATE_KASTEEL_001",
        bookingComUrl: "https://www.booking.com/hotel/kasteel-tweekasteel.html",
        bookingComAffiliateCode: "BOOKING_KASTEEL_001",
        coordinates: JSON.stringify({lat: 52.2397, lng: 6.1067}),
        address: "Hoofdstraat 25, 7391 AB Twello",
        isAuthentic: 1,
        specialFeatures: ["Historic castle", "Gourmet dining", "Wedding venue", "Gardens"]
      },
      {
        name: "Boerderij B&B De Hofstede",
        type: "Boerderij B&B",
        location: "Giethoorn, Overijssel", 
        description: "Authentieke Nederlandse boerderij B&B in het 'Venice van Nederland'. Ontbijt met verse producten van eigen land, perfecte base voor dorpjes route.",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3",
        pricePerNight: "€95-130",
        rating: 4.6,
        amenities: ["Boerderij ontbijt", "Eigen tuin", "Fiets verhuur", "Parkeren", "WiFi", "Huisdieren welkom"],
        airbnbUrl: "https://www.airbnb.com/rooms/boerderij-giethoorn",
        airbnbAffiliateCode: "AFFILIATE_FARM_001", 
        bookingComUrl: "https://www.booking.com/hotel/boerderij-hofstede.html",
        bookingComAffiliateCode: "BOOKING_FARM_001",
        coordinates: JSON.stringify({lat: 52.7386, lng: 6.0789}),
        address: "Dorpsstraat 15, 8355 BK Giethoorn",
        isAuthentic: 1,
        specialFeatures: ["Working farm", "Canal views", "Traditional Dutch breakfast", "Farm animals"]
      },
      {
        name: "Beach Hotel Noordwijk",
        type: "Beach Hotel",
        location: "Noordwijk, Zuid-Holland",
        description: "Modern strandhotel direct aan het Noordwijkse strand. Perfecte uitvalsbasis voor kustroutes met zeezicht kamers en strand restaurant.",
        imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3", 
        pricePerNight: "€140-200",
        rating: 4.4,
        amenities: ["Zeezicht", "Strand restaurant", "Spa faciliteiten", "Parkeren", "WiFi", "Balkon"],
        airbnbUrl: "https://www.airbnb.com/rooms/beach-hotel-noordwijk", 
        airbnbAffiliateCode: "AFFILIATE_BEACH_001",
        bookingComUrl: "https://www.booking.com/hotel/beach-noordwijk.html",
        bookingComAffiliateCode: "BOOKING_BEACH_001",
        coordinates: JSON.stringify({lat: 52.2565, lng: 4.4357}),
        address: "Boulevard Zeekant 8, 2202 JA Noordwijk",
        isAuthentic: 1,
        specialFeatures: ["Beachfront location", "Sea view rooms", "Spa services", "Beach access"]
      },
      {
        name: "Château des Ardennes",
        type: "Kasteel Hotel",
        location: "Bouillon, Belgische Ardennen", 
        description: "Luxe kasteel hotel in de Belgische Ardennen nabij het historische kasteel van Bouillon. Michelin ster restaurant en perfecte base voor kastelen route.",
        imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3",
        pricePerNight: "€220-320",
        rating: 4.9,
        amenities: ["Michelin restaurant", "Kasteel tuinen", "Spa", "Parkeren", "WiFi", "Historisch interieur"],
        airbnbUrl: "https://www.airbnb.com/rooms/chateau-ardennes",
        airbnbAffiliateCode: "AFFILIATE_ARDENNEN_001",
        bookingComUrl: "https://www.booking.com/hotel/chateau-ardennes.html", 
        bookingComAffiliateCode: "BOOKING_ARDENNEN_001",
        coordinates: JSON.stringify({lat: 49.7930, lng: 5.0661}),
        address: "Rue du Château 12, 6830 Bouillon, Belgium",
        isAuthentic: 1,
        specialFeatures: ["Michelin starred dining", "Historic castle", "Spa treatments", "Forest views"]
      }
    ];

    authenticAccommodations.forEach(accommodation => {
      const id = randomUUID();
      const newAccommodation: Accommodation = {
        id,
        ...accommodation,
        createdAt: new Date()
      };
      this.accommodations.set(id, newAccommodation);
    });
  }

  // Initialize multi-day routes with authentic itineraries
  private initializeMultiDayRoutes() {
    const multiDayRouteData: InsertMultiDayRoute[] = [
      {
        title: "3-Daagse Nederlandse Kastelen & Culinaire Route",
        description: "Spectaculaire 3-daagse autoroute langs de mooiste Nederlandse kastelen met overnachtingen in authentieke kasteel hotels. Van Muiderslot tot Kasteel De Haar, inclusief Michelin ster diners en lokale specialiteiten.",
        regionId: "region-noord-holland",
        duration: "3 dagen / 2 nachten",
        totalDistance: "380 km",
        difficulty: "gemakkelijk",
        priceRange: "€350-500 per persoon",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3",
        category: "Kastelen & Gastronomie",
        rating: 4.8,
        isPopular: 1,
        affiliateCommission: 8.5 // 8.5% expected commission
      },
      {
        title: "5-Daagse Hollandse Dorpjes & Fotografie Route",
        description: "Uitgebreide 5-daagse route langs de meest Instagram-waardige Nederlandse dorpjes. Van Giethoorn tot Volendam, met overnachtingen in authentieke boerderij B&B's en lokale restaurants.",
        regionId: "region-overijssel", 
        duration: "5 dagen / 4 nachten",
        totalDistance: "520 km",
        difficulty: "gemakkelijk",
        priceRange: "€280-420 per persoon",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3",
        category: "Dorpjes & Fotografie",
        rating: 4.7,
        isPopular: 1,
        affiliateCommission: 7.5
      },
      {
        title: "7-Daagse Nederlandse & Belgische Grand Tour",
        description: "Complete week-lange autoroute door Nederland en België. Kastelen, dorpjes, Belgische brouwerijen en Nederlandse kust. Luxe accommodaties en culinaire hoogtepunten.",
        regionId: "region-belgische-ardennen",
        duration: "7 dagen / 6 nachten", 
        totalDistance: "850 km",
        difficulty: "gemiddeld",
        priceRange: "€650-950 per persoon",
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3",
        category: "Grand Tour",
        rating: 4.9,
        isPopular: 1,
        affiliateCommission: 9.0
      }
    ];

    const routeIds = [
      "multi-day-kastelen-3dag",
      "multi-day-dorpjes-5dag", 
      "multi-day-grand-tour-7dag"
    ];

    multiDayRouteData.forEach((routeData, index) => {
      const id = routeIds[index];
      const route: MultiDayRoute = {
        id,
        ...routeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.multiDayRoutes.set(id, route);

      // Add itinerary days for each route
      if (index === 0) {
        // 3-day castle route itinerary
        this.create3DayCastleItinerary(id);
      } else if (index === 1) {
        // 5-day village route itinerary  
        this.create5DayVillageItinerary(id);
      } else if (index === 2) {
        // 7-day grand tour itinerary
        this.create7DayGrandTourItinerary(id);
      }
    });
  }

  private create3DayCastleItinerary(routeId: string) {
    const accommodations = Array.from(this.accommodations.values());
    const kasteelHotel = accommodations.find(acc => acc.type === "Kasteel Hotel");

    const itineraryData: InsertItineraryDay[] = [
      {
        multiDayRouteId: routeId,
        dayNumber: 1,
        title: "Amsterdam - Muiderslot - Utrecht",
        description: "Start in Amsterdam met bezoek aan Muiderslot, lunch bij Restaurant De Kazerne met kasteelzicht, doorrijden naar Utrecht voor kasteel De Haar en check-in.",
        startLocation: "Amsterdam Centrum",
        endLocation: "Utrecht - Kasteel Hotel", 
        drivingDistance: "120 km",
        estimatedDrivingTime: "2,5 uur rijden",
        accommodationId: kasteelHotel?.id,
        highlights: ["Muiderslot kasteel tour", "Historische vestingwerken", "Kasteel De Haar tuinen"],
        restaurants: ["Restaurant De Kazerne (Muiden)", "Grand Café Karel V (Utrecht)", "Kasteel hotel restaurant"],
        attractions: ["Muiderslot", "Kasteel De Haar", "Utrecht binnenstad"],
        instagramSpots: ["Muiderslot ophaalbrug", "De Haar kasteel façade", "Kasteel tuinen"]
      },
      {
        multiDayRouteId: routeId,
        dayNumber: 2, 
        title: "Utrecht - Gelderland Kastelen Route",
        description: "Verken de kastelen van Gelderland: Kasteel Het Loo, Kasteel Rosendael en Kasteel Middachten. Lunch bij Restaurant De Echoput in het Hoge Veluwe park.",
        startLocation: "Utrecht - Kasteel Hotel",
        endLocation: "Apeldoorn - Kasteel Hotel",
        drivingDistance: "140 km", 
        estimatedDrivingTime: "3 uur rijden",
        accommodationId: kasteelHotel?.id,
        highlights: ["Kasteel Het Loo paleistuinen", "Hoge Veluwe National Park", "Apeldoorn kastelen"],
        restaurants: ["Restaurant De Echoput", "Kasteel Het Loo Orangerie", "Brasserie Apeldoorn"],
        attractions: ["Kasteel Het Loo", "Kasteel Rosendael", "Kasteel Middachten", "Hoge Veluwe"],
        instagramSpots: ["Het Loo paleistuinen", "Rosendael waterval", "Veluwe natuur"]
      },
      {
        multiDayRouteId: routeId,
        dayNumber: 3,
        title: "Gelderland - Amsterdam Terugkeer",
        description: "Laatste kastelen bezoeken, lunch bij Restaurant De Librije (Zwolle) voor culinaire afsluiting, terugkeer naar Amsterdam via pittoreske route.",
        startLocation: "Apeldoorn - Kasteel Hotel", 
        endLocation: "Amsterdam Centrum",
        drivingDistance: "120 km",
        estimatedDrivingTime: "2,5 uur rijden",
        accommodationId: null,
        highlights: ["Michelin ster lunch", "Zwolse binnenstad", "IJsseldelta landschap"],
        restaurants: ["Restaurant De Librije (Zwolle)", "Grand Café Het Wapen van Elburg", "Amsterdam afsluit diner"],
        attractions: ["Zwolle binnenstad", "Elburg vestingstad", "IJssel rivier route"],
        instagramSpots: ["Zwolle Sassenpoort", "Elburg vissershaven", "IJssel zonsondergang"]
      }
    ];

    itineraryData.forEach(day => {
      const dayId = randomUUID();
      const newDay: ItineraryDay = { id: dayId, ...day };
      this.itineraryDays.set(dayId, newDay);
    });
  }

  private create5DayVillageItinerary(routeId: string) {
    const accommodations = Array.from(this.accommodations.values());
    const boerderijBB = accommodations.find(acc => acc.type === "Boerderij B&B");

    const itineraryData: InsertItineraryDay[] = [
      {
        multiDayRouteId: routeId,
        dayNumber: 1,
        title: "Amsterdam - Volendam - Marken", 
        description: "Klassieke Nederlandse dorpjes route: Volendam vissershaven, Marken eiland, lunch bij Restaurant Spaander met verse vis, check-in boerderij B&B.",
        startLocation: "Amsterdam Centrum",
        endLocation: "Volendam - Boerderij B&B",
        drivingDistance: "45 km",
        estimatedDrivingTime: "1,5 uur rijden",
        accommodationId: boerderijBB?.id,
        highlights: ["Volendam vissershaven", "Marken traditionele huizen", "Klederdracht demonstratie"],
        restaurants: ["Restaurant Spaander (Volendam)", "Café de Taanketel (Marken)", "Boerderij restaurant"],
        attractions: ["Volendam haven", "Marken museum", "Kaasmakerij Volendam"],
        instagramSpots: ["Volendam botenhaven", "Marken houten huizen", "Klederdracht foto's"]
      }
      // Continue with days 2-5...
    ];

    itineraryData.forEach(day => {
      const dayId = randomUUID();
      const newDay: ItineraryDay = { id: dayId, ...day };
      this.itineraryDays.set(dayId, newDay);
    });
  }

  private create7DayGrandTourItinerary(routeId: string) {
    // Implementation for 7-day grand tour with mix of accommodations
    const accommodations = Array.from(this.accommodations.values());
    const ardennenHotel = accommodations.find(acc => acc.location.includes("Bouillon"));
    
    const itineraryData: InsertItineraryDay[] = [
      {
        multiDayRouteId: routeId,
        dayNumber: 1,
        title: "Amsterdam - Nederlandse Kastelen Start",
        description: "Begin van de grote rondrit: Amsterdam naar Muiderslot, lunch bij De Kazerne, doorrijden naar Utrecht voor Kasteel De Haar bezoek.",
        startLocation: "Amsterdam Centrum", 
        endLocation: "Utrecht - Kasteel Hotel",
        drivingDistance: "120 km",
        estimatedDrivingTime: "2,5 uur rijden",
        accommodationId: accommodations.find(acc => acc.type === "Kasteel Hotel")?.id,
        highlights: ["Muiderslot tour", "De Haar kasteel", "Utrecht binnenstad"],
        restaurants: ["Restaurant De Kazerne", "Grand Café Karel V", "Kasteel restaurant"],
        attractions: ["Muiderslot", "Kasteel De Haar", "Utrecht Dom"],
        instagramSpots: ["Muiderslot ophaalbrug", "De Haar facade", "Utrecht grachten"]
      }
      // Continue with days 2-7 including Belgium portion...
    ];

    itineraryData.forEach(day => {
      const dayId = randomUUID();
      const newDay: ItineraryDay = { id: dayId, ...day };
      this.itineraryDays.set(dayId, newDay);
    });
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // Regions
  async getAllRegions(): Promise<Region[]> {
    return await db.select().from(regions);
  }

  async getRegionById(id: string): Promise<Region | undefined> {
    const [region] = await db.select().from(regions).where(eq(regions.id, id));
    return region;
  }

  async createRegion(region: InsertRegion): Promise<Region> {
    const [newRegion] = await db.insert(regions).values(region).returning();
    return newRegion;
  }

  // Routes
  async getAllRoutes(): Promise<Route[]> {
    return await db.select().from(routes).orderBy(desc(routes.createdAt));
  }

  async getRouteById(id: string): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route;
  }

  async getRoutesByRegion(regionId: string): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.regionId, regionId));
  }

  async getPopularRoutes(): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.isPopular, 1));
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const [newRoute] = await db.insert(routes).values({
      ...route,
      isUserCreated: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return newRoute;
  }

  async updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route> {
    const [updatedRoute] = await db.update(routes)
      .set({ ...route, updatedAt: new Date() })
      .where(eq(routes.id, id))
      .returning();
    return updatedRoute;
  }

  async deleteRoute(id: string): Promise<void> {
    await db.delete(routes).where(eq(routes.id, id));
  }

  // Route Stops
  async getRouteStops(routeId: string): Promise<RouteStop[]> {
    return await db.select().from(routeStops).where(eq(routeStops.routeId, routeId));
  }

  async createRouteStop(stop: InsertRouteStop): Promise<RouteStop> {
    const [newStop] = await db.insert(routeStops).values(stop).returning();
    return newStop;
  }

  // Audio Tracks
  async getAudioTracksByRoute(routeId: string): Promise<AudioTrack[]> {
    return await db.select().from(audioTracks).where(eq(audioTracks.routeId, routeId));
  }

  async getAudioTrackByStop(stopId: string): Promise<AudioTrack | undefined> {
    const [track] = await db.select().from(audioTracks).where(eq(audioTracks.stopId, stopId));
    return track;
  }

  async createAudioTrack(track: InsertAudioTrack): Promise<AudioTrack> {
    const [newTrack] = await db.insert(audioTracks).values(track).returning();
    return newTrack;
  }

  // Reviews
  async getReviewsByRoute(routeId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.routeId, routeId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  // Photos
  async getPhotosByRoute(routeId: string): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.routeId, routeId));
  }

  async getPhotosByStop(stopId: string): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.stopId, stopId));
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async getPhotoById(id: string): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo;
  }

  // Castle Landmarks
  async getAllCastleLandmarks(): Promise<CastleLandmark[]> {
    return await db.select().from(castleLandmarks);
  }

  async getCastleLandmarkById(id: string): Promise<CastleLandmark | undefined> {
    const [castle] = await db.select().from(castleLandmarks).where(eq(castleLandmarks.id, id));
    return castle;
  }

  async getCastleLandmarksByRoute(routeId: string): Promise<CastleLandmark[]> {
    return await db.select().from(castleLandmarks).where(
      // This is a simplified query. In a real implementation, we'd use a proper join or SQL function
      // For now, we filter in-memory which works for this use case
      eq(castleLandmarks.id, castleLandmarks.id)
    ).then(castles => 
      castles.filter(castle => 
        Array.isArray(castle.routeIds) && castle.routeIds.includes(routeId)
      )
    );
  }

  async createCastleLandmark(castle: InsertCastleLandmark): Promise<CastleLandmark> {
    const [newCastle] = await db.insert(castleLandmarks).values(castle).returning();
    return newCastle;
  }
}

// Create hybrid storage that uses database when available, falls back to memory
export class HybridStorage implements IStorage {
  private memStorage: MemStorage;
  private dbStorage: DatabaseStorage;
  private useDatabase: boolean = false; // Force memory storage for now

  constructor() {
    this.memStorage = new MemStorage();
    this.dbStorage = new DatabaseStorage();
    console.log("HybridStorage initialized - using memory storage with sample data");
  }

  // Route through to appropriate storage - using memory for now
  private getStorage(): IStorage {
    return this.memStorage; // Always use memory storage for sample data
  }

  // Regions
  async getAllRegions(): Promise<Region[]> {
    return await this.memStorage.getAllRegions();
  }

  async getRegionById(id: string): Promise<Region | undefined> {
    return await this.getStorage().getRegionById(id);
  }

  async createRegion(region: InsertRegion): Promise<Region> {
    return await this.getStorage().createRegion(region);
  }

  // Routes  
  async getAllRoutes(): Promise<Route[]> {
    return await this.memStorage.getAllRoutes();
  }

  async getRouteById(id: string): Promise<Route | undefined> {
    return await this.getStorage().getRouteById(id);
  }

  async getRoutesByRegion(regionId: string): Promise<Route[]> {
    return await this.getStorage().getRoutesByRegion(regionId);
  }

  async getPopularRoutes(): Promise<Route[]> {
    return await this.getStorage().getPopularRoutes();
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    return await this.getStorage().createRoute(route);
  }

  async updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route> {
    return await this.getStorage().updateRoute(id, route);
  }

  async deleteRoute(id: string): Promise<void> {
    return await this.getStorage().deleteRoute(id);
  }

  // Route Stops
  async getRouteStops(routeId: string): Promise<RouteStop[]> {
    return await this.getStorage().getRouteStops(routeId);
  }

  async createRouteStop(stop: InsertRouteStop): Promise<RouteStop> {
    return await this.getStorage().createRouteStop(stop);
  }

  // Audio Tracks
  async getAudioTracksByRoute(routeId: string): Promise<AudioTrack[]> {
    return await this.getStorage().getAudioTracksByRoute(routeId);
  }

  async getAudioTrackByStop(stopId: string): Promise<AudioTrack | undefined> {
    return await this.getStorage().getAudioTrackByStop(stopId);
  }

  async createAudioTrack(track: InsertAudioTrack): Promise<AudioTrack> {
    return await this.getStorage().createAudioTrack(track);
  }

  // Reviews
  async getReviewsByRoute(routeId: string): Promise<Review[]> {
    return await this.getStorage().getReviewsByRoute(routeId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    return await this.getStorage().createReview(review);
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    return await this.getStorage().getReviewById(id);
  }

  // Photos
  async getPhotosByRoute(routeId: string): Promise<Photo[]> {
    return await this.getStorage().getPhotosByRoute(routeId);
  }

  async getPhotosByStop(stopId: string): Promise<Photo[]> {
    return await this.getStorage().getPhotosByStop(stopId);
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    return await this.getStorage().createPhoto(photo);
  }

  async getPhotoById(id: string): Promise<Photo | undefined> {
    return await this.getStorage().getPhotoById(id);
  }

  // Castle Landmarks
  async getAllCastleLandmarks(): Promise<CastleLandmark[]> {
    return await this.getStorage().getAllCastleLandmarks();
  }

  async getCastleLandmarkById(id: string): Promise<CastleLandmark | undefined> {
    return await this.getStorage().getCastleLandmarkById(id);
  }

  async getCastleLandmarksByRoute(routeId: string): Promise<CastleLandmark[]> {
    return await this.getStorage().getCastleLandmarksByRoute(routeId);
  }

  async createCastleLandmark(castle: InsertCastleLandmark): Promise<CastleLandmark> {
    return await this.getStorage().createCastleLandmark(castle);
  }
}

export const storage = new HybridStorage();
