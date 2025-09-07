import axios from 'axios';

const API_KEY = '09c3352f6cff1f6632663386481a6031';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  clouds: number;
  dt: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

export interface ForecastDay {
  dt: number;
  temp_min: number;
  temp_max: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  humidity: number;
  wind_speed: number;
  clouds: number;
  pop: number; // Probability of precipitation
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

class WeatherService {
  private async makeRequest(url: string) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const data = await this.makeRequest(url);
    
    return {
      name: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      weather_main: data.weather[0].main,
      weather_description: data.weather[0].description,
      weather_icon: data.weather[0].icon,
      clouds: data.clouds.all,
      dt: data.dt,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
    };
  }

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const data = await this.makeRequest(url);
    
    return {
      name: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      weather_main: data.weather[0].main,
      weather_description: data.weather[0].description,
      weather_icon: data.weather[0].icon,
      clouds: data.clouds.all,
      dt: data.dt,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
    };
  }

  async getForecast(city: string): Promise<ForecastDay[]> {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const data = await this.makeRequest(url);
    
    // Group by day and get daily forecast
    const dailyForecast: ForecastDay[] = [];
    const processedDays = new Set();
    
    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!processedDays.has(dayKey) && dailyForecast.length < 7) {
        processedDays.add(dayKey);
        dailyForecast.push({
          dt: item.dt,
          temp_min: Math.round(item.main.temp_min),
          temp_max: Math.round(item.main.temp_max),
          weather_main: item.weather[0].main,
          weather_description: item.weather[0].description,
          weather_icon: item.weather[0].icon,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          clouds: item.clouds.all,
          pop: Math.round(item.pop * 100),
        });
      }
    }
    
    return dailyForecast;
  }

  async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    try {
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&exclude=minutely,hourly,daily`;
      const data = await this.makeRequest(url);
      
      return data.alerts || [];
    } catch (error) {
      // OneCall API might not be available for free tier
      console.warn('Weather alerts not available:', error);
      return [];
    }
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getWeatherRecommendation(weather: WeatherData): string {
    const { temp, weather_main, wind_speed, humidity } = weather;
    
    if (weather_main === 'Rain' || weather_main === 'Drizzle') {
      return "Don't forget your umbrella! It's a great day to stay cozy indoors with a warm drink.";
    }
    
    if (weather_main === 'Snow') {
      return "Bundle up warm! Perfect weather for hot cocoa and winter activities.";
    }
    
    if (weather_main === 'Thunderstorm') {
      return "Stay safe indoors! It's a powerful storm out there. Perfect time for indoor activities.";
    }
    
    if (temp >= 25) {
      return "Beautiful weather! Perfect for outdoor activities. Don't forget sunscreen and stay hydrated.";
    }
    
    if (temp <= 0) {
      return "It's freezing out there! Layer up and limit outdoor exposure. Stay warm!";
    }
    
    if (wind_speed > 10) {
      return "It's quite windy! Secure loose items and be careful when walking or driving.";
    }
    
    if (humidity > 80) {
      return "High humidity today! Stay cool and hydrated. Light, breathable clothing recommended.";
    }
    
    return "Great weather today! Perfect for any outdoor plans you might have.";
  }
}

export const weatherService = new WeatherService();