import { localizeCountryName } from '../utils/weather.js';

const normalizeIcon = (iconUrl) => iconUrl?.startsWith('//') ? `https:${iconUrl}` : iconUrl;

const createHourlyItem = (hourItem) => ({
  time: hourItem.time.split(' ')[1],
  condition: hourItem.condition.text,
  conditionIcon: normalizeIcon(hourItem.condition.icon),
  temperature: Math.round(hourItem.temp_c),
  chanceOfRain: hourItem.chance_of_rain,
});

const createCurrentWeather = (responseData) => ({
  city: responseData.location.name,
  country: localizeCountryName(responseData.location.country),
  description: responseData.current.condition.text,
  conditionIcon: normalizeIcon(responseData.current.condition.icon),
  temperature: Math.round(responseData.current.temp_c),
  feelsLike: Math.round(responseData.current.feelslike_c),
  humidity: responseData.current.humidity,
  windSpeed: Math.round(responseData.current.wind_kph),
  uv: responseData.current.uv,
  chanceOfRain: responseData.forecast.forecastday[0].day.daily_chance_of_rain,
  localTime: responseData.location.localtime,
});

const createForecastDay = (forecastDay) => ({
  dayLabel: forecastDay.date,
  condition: forecastDay.day.condition.text,
  conditionIcon: normalizeIcon(forecastDay.day.condition.icon),
  minTemperature: Math.round(forecastDay.day.mintemp_c),
  maxTemperature: Math.round(forecastDay.day.maxtemp_c),
  averageTemperature: Math.round(forecastDay.day.avgtemp_c),
  averageHumidity: Math.round(forecastDay.day.avghumidity),
  chanceOfRain: forecastDay.day.daily_chance_of_rain,
  maxWind: Math.round(forecastDay.day.maxwind_kph),
  uv: forecastDay.day.uv,
  sunrise: forecastDay.astro.sunrise,
  sunset: forecastDay.astro.sunset,
  hours: forecastDay.hour.map(createHourlyItem),
});

export const adaptForecastResponse = (responseData) => {
  const forecast = responseData.forecast.forecastday.map(createForecastDay);

  return {
    currentWeather: createCurrentWeather(responseData),
    forecast,
    hourly: forecast[0]?.hours.slice(0, 8) ?? [],
  };
};

export const adaptSearchResponse = (responseData) =>
  responseData.map((city) => ({
    id: city.id,
    name: city.name,
    region: city.region,
    country: localizeCountryName(city.country),
    latitude: city.lat,
    longitude: city.lon,
  }));
