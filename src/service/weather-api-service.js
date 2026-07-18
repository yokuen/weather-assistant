import { adaptCurrentWeather } from '../adapter/weather-adapter.js';

const API_ERROR_MESSAGES = {
  1006: 'Город не найден. Проверьте название и попробуйте еще раз.',
  2006: 'API-ключ недействителен.',
  2007: 'Лимит запросов к Weather API исчерпан.',
  2008: 'API-ключ временно заблокирован.',
  9999: 'Weather API временно недоступен. Попробуйте позже.',
};

export default class WeatherApiService {
  constructor(baseUrl, apiKey) {
    this._baseUrl = baseUrl.replace(/\/$/, '');
    this._apiKey = apiKey;
  }

  async getCurrentWeather(city) {
    if (!this._apiKey) {
      throw new Error('Добавьте API-ключ');
    }

    const url = new URL(`${this._baseUrl}/current.json`);
    url.search = new URLSearchParams({
      key: this._apiKey,
      q: city,
      aqi: 'no',
      lang: 'ru',
    });

    let response;

    try {
      response = await fetch(url);
    } catch {
      throw new Error('Не удалось подключиться к Weather API. Проверьте интернет-соединение.');
    }

    let responseData = null;

    try {
      responseData = await response.json();
    } catch {
      throw new Error('Weather API вернул некорректный ответ. Попробуйте позже.');
    }

    if (!response.ok) {
      const apiErrorCode = responseData?.error?.code;
      const message = API_ERROR_MESSAGES[apiErrorCode]
        ?? responseData?.error?.message
        ?? 'Не удалось получить данные. Попробуйте еще раз.';

      throw new Error(message);
    }

    return adaptCurrentWeather(responseData);
  }
}
