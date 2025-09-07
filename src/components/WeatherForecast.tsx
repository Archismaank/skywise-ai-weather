import React from 'react';
import { Calendar, Droplets, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ForecastDay } from '@/services/weatherService';

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (!forecast.length) {
    return null;
  }

  return (
    <div className="space-y-6 animate-weather-slide-in">
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            7-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {forecast.map((day, index) => (
              <div
                key={day.dt}
                className={`p-4 flex items-center justify-between hover:bg-card-glass/50 transition-colors ${
                  index !== forecast.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="min-w-[80px]">
                    <p className="font-medium">
                      {formatDate(day.dt)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {day.weather_description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather_icon}@2x.png`}
                      alt={day.weather_description}
                      className="w-10 h-10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {day.pop > 0 && (
                    <div className="flex items-center gap-1 text-primary">
                      <Droplets className="h-3 w-3" />
                      <span className="text-xs">{day.pop}%</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Wind className="h-3 w-3" />
                    <span>{Math.round(day.wind_speed)} m/s</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-[100px] justify-end">
                    <span className="text-sm text-muted-foreground">
                      {day.temp_min}°
                    </span>
                    <span className="font-semibold text-lg">
                      {day.temp_max}°
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4 text-center">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-primary/10 mx-auto w-fit">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Humidity</p>
              <p className="text-lg font-semibold">
                {Math.round(forecast.reduce((acc, day) => acc + day.humidity, 0) / forecast.length)}%
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 text-center">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-primary/10 mx-auto w-fit">
              <Wind className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Wind</p>
              <p className="text-lg font-semibold">
                {Math.round(forecast.reduce((acc, day) => acc + day.wind_speed, 0) / forecast.length)} m/s
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 text-center">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-primary/10 mx-auto w-fit">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rainy Days</p>
              <p className="text-lg font-semibold">
                {forecast.filter(day => day.pop > 30).length}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 text-center">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-accent/10 mx-auto w-fit">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clear Days</p>
              <p className="text-lg font-semibold">
                {forecast.filter(day => day.weather_main === 'Clear').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeatherForecast;