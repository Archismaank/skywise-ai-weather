import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface WeatherSearchProps {
  onSearch: (query: string) => void;
  onLocationSearch: () => void;
  isLoading: boolean;
  hasLocationPermission?: boolean;
}

const WeatherSearch: React.FC<WeatherSearchProps> = ({
  onSearch,
  onLocationSearch,
  isLoading,
  hasLocationPermission = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleLocationClick = () => {
    if (hasLocationPermission) {
      onLocationSearch();
    }
  };

  return (
    <Card variant="glass" className="p-6 animate-weather-slide-in">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Search Weather
          </h2>
          <p className="text-muted-foreground">
            Enter a city name or use your current location
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter city name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-white/20"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            variant="weather" 
            disabled={isLoading || !searchQuery.trim()}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card-glass px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Button
          onClick={handleLocationClick}
          variant="glass"
          size="lg"
          disabled={isLoading || !hasLocationPermission}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isLoading ? 'Getting Location...' : 'Use Current Location'}
        </Button>

        {!hasLocationPermission && (
          <p className="text-sm text-warning text-center">
            Location access denied. Please enable location services or search by city name.
          </p>
        )}
      </div>
    </Card>
  );
};

export default WeatherSearch;