import { Link } from "wouter";
import { Region } from "@shared/schema";
import { Clock } from "lucide-react";

interface RegionCardProps {
  region: Region;
}

export function RegionCard({ region }: RegionCardProps) {
  return (
    <Link href={`/regio/${region.id}`}>
      <div 
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
        data-testid={`card-region-${region.id}`}
      >
        <img 
          src={region.imageUrl} 
          alt={`${region.name} regio`} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-region-${region.id}`}
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-semibold text-gray-900" data-testid={`text-region-name-${region.id}`}>
              {region.name}
            </h4>
            <span 
              className="bg-dutch-orange text-white px-3 py-1 rounded-full text-sm font-medium"
              data-testid={`text-region-routes-${region.id}`}
            >
              {region.routeCount} routes
            </span>
          </div>
          <p className="text-gray-600 mb-4" data-testid={`text-region-description-${region.id}`}>
            {region.description}
          </p>
          <div className="flex items-center text-forest-green">
            <Clock className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium" data-testid={`text-region-duration-${region.id}`}>
              {region.estimatedDuration}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
