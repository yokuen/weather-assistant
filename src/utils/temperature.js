const toFahrenheit = (celsius) => Math.round((celsius * 9) / 5 + 32);

export const formatTemperature = (value, unit) => {
  const preparedValue = unit === 'fahrenheit' ? toFahrenheit(value) : value;
  const suffix = unit === 'fahrenheit' ? '°F' : '°C';

  return `${preparedValue}${suffix}`;
};
