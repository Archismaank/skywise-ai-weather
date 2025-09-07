import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cloud, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { weatherService, WeatherData, ForecastDay } from '@/services/weatherService';
import WeatherSearch from './WeatherSearch';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherRecommendation from './WeatherRecommendation';
import ThemeToggle from './ThemeToggle';

const WeatherApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(true);

  // Current weather query
  const { 
    data: weatherData, 
    isLoading: isWeatherLoading, 
    error: weatherError,
    refetch: refetchWeather 
  } = useQuery({
    queryKey: ['weather', searchQuery, coordinates],
    queryFn: async () => {
      if (coordinates) {
        return await weatherService.getCurrentWeatherByCoords(coordinates.lat, coordinates.lon);
      } else if (searchQuery) {
        return await weatherService.getCurrentWeather(searchQuery);
      }
      return null;
    },
    enabled: !!(searchQuery || coordinates),
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Forecast query
  const { 
    data: forecastData, 
    isLoading: isForecastLoading 
  } = useQuery({
    queryKey: ['forecast', searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return await weatherService.getForecast(searchQuery);
      }
      return null;
    },
    enabled: !!searchQuery && !!weatherData,
    retry: 2,
    staleTime: 10 * 60 * 1000,
  });

  const handleCitySearch = (city: string) => {
    setSearchQuery(city);
    setCoordinates(null);
  };

  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        setSearchQuery('');
        setHasLocationPermission(true);
        toast({
          title: "Location found",
          description: "Getting weather for your current location...",
        });
      },
      (error) => {
        setHasLocationPermission(false);
        let message = "Unable to access your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const handleRefresh = () => {
    refetchWeather();
    toast({
      title: "Refreshing weather data",
      description: "Getting the latest weather information...",
    });
  };

  // Error handling
  useEffect(() => {
    if (weatherError) {
      toast({
        title: "Weather Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    }
  }, [weatherError]);

  const isLoading = isWeatherLoading || isForecastLoading;
  const recommendation = weatherData ? weatherService.getWeatherRecommendation(weatherData) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-light via-sky-medium to-sky-deep transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
      
      <ThemeToggle />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-card-glass/80 backdrop-blur-lg border border-white/20">
              <Cloud className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              WeatherWise
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your intelligent weather companion with AI-powered recommendations and detailed forecasts
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {!weatherData && !isLoading && (
            <div className="max-w-md mx-auto">
              <WeatherSearch
                onSearch={handleCitySearch}
                onLocationSearch={handleLocationSearch}
                isLoading={isLoading}
                hasLocationPermission={hasLocationPermission}
              />
            </div>
          )}

          {weatherError && (
            <Card variant="glass" className="p-6 text-center max-w-md mx-auto">
              <div className="space-y-4">
                <div className="p-3 rounded-full bg-destructive/10 w-fit mx-auto">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Weather Error
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Unable to fetch weather data. Please check the city name and try again.
                  </p>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {isLoading && (
            <Card variant="glass" className="p-8 text-center max-w-md mx-auto">
              <div className="space-y-4">
                <div className="animate-spin mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="text-muted-foreground">Loading weather data...</p>
              </div>
            </Card>
          )}

          {weatherData && (
            <div className="space-y-8">
              {/* Search bar when weather is shown */}
              <div className="max-w-md mx-auto">
                <WeatherSearch
                  onSearch={handleCitySearch}
                  onLocationSearch={handleLocationSearch}
                  isLoading={isLoading}
                  hasLocationPermission={hasLocationPermission}
                />
              </div>

              {/* Weather Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Weather - Spans 2 columns on lg screens */}
                <div className="lg:col-span-2 space-y-8">
                  <CurrentWeather weather={weatherData} />
                  
                  {forecastData && forecastData.length > 0 && (
                    <WeatherForecast forecast={forecastData} />
                  )}
                </div>

                {/* Recommendations - Right sidebar */}
                <div className="space-y-8">
                  <WeatherRecommendation 
                    weather={weatherData} 
                    recommendation={recommendation}
                  />

                  {/* Refresh Button */}
                  <Card variant="glass" className="p-4">
                    <Button 
                      onClick={handleRefresh} 
                      variant="weather" 
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh Weather
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-8 border-t border-white/10">
          <p className="text-sm text-muted-foreground">
            Powered by OpenWeather API • Built with ❤️ for accurate weather forecasting
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;