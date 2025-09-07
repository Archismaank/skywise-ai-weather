import React from 'react';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherData } from '@/services/weatherService';

interface CurrentWeatherProps {
  weather: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const formatTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
  };

  return (
    <div className="space-y-6 animate-weather-slide-in">
      {/* Main Weather Card */}
      <Card variant="weather" className="overflow-hidden">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span>{weather.name}, {weather.country}</span>
          </div>
          <CardTitle className="text-4xl font-bold">
            {weather.temp}°C
          </CardTitle>
          <p className="text-lg text-muted-foreground capitalize">
            {weather.weather_description}
          </p>
          <p className="text-sm text-muted-foreground">
            Feels like {weather.feels_like}°C
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex justify-center mb-6">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather_icon}@4x.png`}
              alt={weather.weather_description}
              className="w-32 h-32 animate-float"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-sm">
              H: {weather.temp_max}°C
            </Badge>
            <Badge variant="secondary" className="text-sm">
              L: {weather.temp_min}°C
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Thermometer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Feels Like</p>
              <p className="text-lg font-semibold">{weather.feels_like}°C</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wind className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wind</p>
              <p className="text-lg font-semibold">
                {weather.wind_speed} m/s {getWindDirection(weather.wind_deg)}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-lg font-semibold">{weather.humidity}%</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visibility</p>
              <p className="text-lg font-semibold">{weather.visibility} km</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gauge className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pressure</p>
              <p className="text-lg font-semibold">{weather.pressure} hPa</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clouds</p>
              <p className="text-lg font-semibold">{weather.clouds}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sun Times */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Sunrise className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sunrise</p>
              <p className="text-lg font-semibold">
                {formatTime(weather.sunrise, weather.timezone)}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Sunset className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sunset</p>
              <p className="text-lg font-semibold">
                {formatTime(weather.sunset, weather.timezone)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CurrentWeather;