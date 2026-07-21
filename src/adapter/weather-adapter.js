const createCurrentWeather = (responseData) => ({
  city: responseData.location.name,
  country: responseData.location.country,
  description: responseData.current.condition.text,
  temperature: Math.round(responseData.current.temp_c),
  feelsLike: Math.round(responseData.current.feelslike_c),
  humidity: responseData.current.humidity,
  windSpeed: Math.round(responseData.current.wind_kph),
  localTime: responseData.location.localtime,
});

const createForecastDay = (forecastDay) => ({
  dayLabel: forecastDay.date,
  condition: forecastDay.day.condition.text,
  minTemperature: Math.round(forecastDay.day.mintemp_c),
  maxTemperature: Math.round(forecastDay.day.maxtemp_c),
});

const createHourlyItem = (hourItem) => ({
  time: hourItem.time.split(' ')[1],
  condition: hourItem.condition.text,
  temperature: Math.round(hourItem.temp_c),
  chanceOfRain: hourItem.chance_of_rain,
});

export const adaptForecastResponse = (responseData) => ({
  currentWeather: createCurrentWeather(responseData),
  forecast: responseData.forecast.forecastday.map(createForecastDay),
  hourly: responseData.forecast.forecastday[0].hour.map(createHourlyItem).slice(0, 8),
});
