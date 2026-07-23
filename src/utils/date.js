const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsedDate = new Date(value.replace(' ', 'T'));
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatLocalTime = (value) => {
  const date = parseDate(value);

  if (!date) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatForecastDate = (value) => {
  const date = parseDate(value);

  if (!date) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(date);
};

export const formatAstroTime = (value) => {
  const match = value?.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);

  if (!match) {
    return value;
  }

  const [, hours, minutes, period] = match;
  let normalizedHours = Number(hours) % 12;

  if (period.toUpperCase() === 'PM') {
    normalizedHours += 12;
  }

  return `${String(normalizedHours).padStart(2, '0')}:${minutes}`;
};
