const isCurrentWeatherResponse = (responseData) => (
  responseData?.location
  && responseData?.current
  && responseData.current.condition
);

export const adaptCurrentWeather = (responseData) => {
  if (!isCurrentWeatherResponse(responseData)) {
    throw new Error('Weather API вернул неполные данные. Попробуйте позже.');
  }

  return {
    city: responseData.location.name,
    country: responseData.location.country,
    description: responseData.current.condition.text,
    temperature: Math.round(responseData.current.temp_c),
    feelsLike: Math.round(responseData.current.feelslike_c),
    humidity: responseData.current.humidity,
    windSpeed: Math.round(responseData.current.wind_kph),
    localTime: responseData.location.localtime,
  };
};
