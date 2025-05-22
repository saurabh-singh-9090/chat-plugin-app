import React from 'react';
import { Plugin } from '../types';
import axios from 'axios';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

class WeatherPlugin implements Plugin {
  name = 'weather';
  triggers = [/weather in (\w+)/i, /what('s| is) the weather (like )?in (\w+)/i];

  async execute(input: string): Promise<WeatherData> {
    // Extract city name from input
    let city = '';
    if (input.startsWith('/weather')) {
      city = input.substring(9).trim();
    } else {
      // Extract from natural language
      const match = input.match(/weather in (\w+)/i) || 
                   input.match(/what('s| is) the weather (like )?in (\w+)/i);
      
      if (match) {
        // Handle the different capture group patterns
        if (match[3]) { // from the second pattern with 'like' optional group
          city = match[3];
        } else if (match[1]) { // from the first pattern
          city = match[1];
        }
      }
    }
    
    if (!city) {
      throw new Error('Please specify a city');
    }
    
    try {
      // Step 1: Geocode the city name using Open-Meteo Geocoding API
      const geocodingResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: city,
          count: 1,
          language: 'en',
          format: 'json'
        }
      });
      
      if (!geocodingResponse.data.results || geocodingResponse.data.results.length === 0) {
        throw new Error(`City "${city}" not found`);
      }
      
      const locationData = geocodingResponse.data.results[0];
      const { latitude, longitude, name, country } = locationData;
      
      // Step 2: Get weather data using the coordinates
      const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m'
        }
      });
      
      const currentWeather = weatherResponse.data.current;
      
      // Map weather code to description
      const description = this.getWeatherDescription(currentWeather.weather_code);
      
      return {
        location: `${name}${country ? ', ' + country : ''}`,
        temperature: currentWeather.temperature_2m,
        description,
        humidity: currentWeather.relative_humidity_2m,
        windSpeed: currentWeather.wind_speed_10m
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Couldn't fetch weather for ${city}: ${errorMessage}`);
    }
  }
  
  // Convert Open-Meteo weather codes to human-readable descriptions
  getWeatherDescription(code: number): string {
    const weatherCodes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    
    return weatherCodes[code] || 'Unknown';
  }

  renderResponse(data: WeatherData): React.ReactElement {
    return (
      <div className="weather-card">
        <h3>Weather in {data.location}</h3>
        <div className="weather-details">
          <p><strong>Temperature:</strong> {data.temperature}°C</p>
          <p><strong>Condition:</strong> {data.description}</p>
          <p><strong>Humidity:</strong> {data.humidity}%</p>
          <p><strong>Wind:</strong> {data.windSpeed} km/h</p>
        </div>
      </div>
    );
  }
}

export default WeatherPlugin;
