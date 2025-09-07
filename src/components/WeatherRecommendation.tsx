import React from 'react';
import { Lightbulb, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherData } from '@/services/weatherService';

interface WeatherRecommendationProps {
  weather: WeatherData;
  recommendation: string;
}

const WeatherRecommendation: React.FC<WeatherRecommendationProps> = ({ 
  weather, 
  recommendation 
}) => {
  const getActivitySuggestions = (weather: WeatherData) => {
    const { temp, weather_main } = weather;
    
    if (weather_main === 'Clear' && temp >= 20 && temp <= 30) {
      return [
        'Perfect for hiking',
        'Great for outdoor picnic',
        'Ideal for photography',
        'Beach day vibes'
      ];
    }
    
    if (weather_main === 'Rain' || weather_main === 'Drizzle') {
      return [
        'Cozy indoor reading',
        'Movie marathon time',
        'Hot soup cooking',
        'Board game session'
      ];
    }
    
    if (weather_main === 'Snow') {
      return [
        'Winter photography',
        'Hot chocolate time',
        'Indoor crafts',
        'Warm blanket day'
      ];
    }
    
    if (temp >= 30) {
      return [
        'Stay hydrated',
        'Air conditioning time',
        'Swimming pool visit',
        'Iced drinks recommended'
      ];
    }
    
    if (temp <= 5) {
      return [
        'Layer up warm',
        'Hot drinks essential',
        'Indoor activities',
        'Fireplace time'
      ];
    }
    
    return [
      'Perfect for walking',
      'Great for outdoor sports',
      'Comfortable weather',
      'Enjoy the day'
    ];
  };

  const getWeatherMood = (weather: WeatherData) => {
    const { weather_main, temp } = weather;
    
    if (weather_main === 'Clear' && temp >= 20 && temp <= 28) {
      return { emoji: '☀️', mood: 'Perfect', color: 'text-accent' };
    }
    
    if (weather_main === 'Clouds' && temp >= 15 && temp <= 25) {
      return { emoji: '⛅', mood: 'Pleasant', color: 'text-primary' };
    }
    
    if (weather_main === 'Rain') {
      return { emoji: '🌧️', mood: 'Cozy', color: 'text-sky-deep' };
    }
    
    if (weather_main === 'Snow') {
      return { emoji: '❄️', mood: 'Magical', color: 'text-cloud-dark' };
    }
    
    if (temp >= 30) {
      return { emoji: '🔥', mood: 'Hot', color: 'text-destructive' };
    }
    
    if (temp <= 0) {
      return { emoji: '🧊', mood: 'Freezing', color: 'text-sky-deep' };
    }
    
    return { emoji: '🌤️', mood: 'Nice', color: 'text-primary' };
  };

  const activities = getActivitySuggestions(weather);
  const weatherMood = getWeatherMood(weather);

  return (
    <div className="space-y-6 animate-weather-slide-in">
      <Card variant="glass" className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            AI Weather Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card-glass/50 border border-white/10">
              <div className="text-3xl">{weatherMood.emoji}</div>
              <div className="flex-1">
                <p className="text-lg font-medium">
                  <span className={weatherMood.color}>{weatherMood.mood}</span> weather today!
                </p>
                <p className="text-muted-foreground mt-1">
                  {recommendation}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            Recommended Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg bg-card-glass/30 border border-white/10 hover:bg-card-glass/50 transition-colors"
              >
                <Sparkles className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-sm">{activity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                UV Index: {weather.temp > 25 ? 'High' : weather.temp > 15 ? 'Medium' : 'Low'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Air Quality: {weather.visibility > 8 ? 'Good' : weather.visibility > 5 ? 'Fair' : 'Poor'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Comfort: {weather.humidity > 70 ? 'Humid' : weather.humidity < 30 ? 'Dry' : 'Comfortable'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Weather recommendations powered by AI analysis
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherRecommendation;