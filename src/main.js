import './styles/style.css';
import { clearContainer, render } from './utils/render.js';
import AppShellView from './view/app-shell-view.js';
import SimpleSidebarView from './view/simple-sidebar-view.js';
import SimpleMessageView from './view/simple-message-view.js';
import SearchFormView from './view/search-form-view.js';
import WeatherSectionView from './view/weather-section-view.js';
import ForecastSectionView from './view/forecast-section-view.js';
import WeatherCardView from './view/weather-card-view.js';
import ForecastDayView from './view/forecast-day-view.js';
import WeatherModel from './model/weather-model.js';
import ForecastModel from './model/forecast-model.js';
import SettingsModel from './model/settings-model.js';
import WeatherApiService from './service/weather-api-service.js';
import { clearSection, showEmptyWeather, showEmptyForecast } from './utils/sections.js';
import {
  WEATHER_API_KEY,
  WEATHER_API_URL,
  EMPTY_FORECAST_TEXT,
  EMPTY_WEATHER_TEXT,
} from './const.js';

const appElement = document.querySelector('#app');

if (appElement) {
  const appShellView = new AppShellView();
  render(appShellView, appElement);

  const weatherModel = new WeatherModel();
  const forecastModel = new ForecastModel();
  const settingsModel = new SettingsModel();

  const weatherService = new WeatherApiService(WEATHER_API_URL, WEATHER_API_KEY);

  const searchPanelElement = appShellView.element.querySelector('.search-panel');
  const weatherSectionElement = appShellView.element.querySelector('.weather-section');
  const forecastSectionElement = appShellView.element.querySelector('.forecast-section');
  const favoritesSectionElement = appShellView.element.querySelector('.favorites-section');
  const historySectionElement = appShellView.element.querySelector('.history-section');

  const renderSearch = (message = '') => {
    clearContainer(searchPanelElement);
    render(new SearchFormView(handleSearchSubmit, message), searchPanelElement);
  };

  const renderWeather = () => {
    clearSection(weatherSectionElement);
    const weatherSectionView = new WeatherSectionView();
    render(weatherSectionView, weatherSectionElement);

    if (!weatherModel.weather) {
      render(
        new SimpleMessageView('Погода пока не выбрана', EMPTY_WEATHER_TEXT),
        weatherSectionView.contentElement
      );
      return;
    }

    render(
      new WeatherCardView(weatherModel.weather, settingsModel.unit),
      weatherSectionView.contentElement
    );
  };

  const renderForecast = () => {
    clearSection(forecastSectionElement);
    const forecastSectionView = new ForecastSectionView();
    render(forecastSectionView, forecastSectionElement);

    if (!forecastModel.forecast.length) {
      render(
        new SimpleMessageView('Прогноз пока пуст', EMPTY_FORECAST_TEXT),
        forecastSectionView.contentElement
      );
      return;
    }

    forecastModel.forecast.forEach((forecastDay) => {
      render(new ForecastDayView(forecastDay), forecastSectionView.contentElement);
    });
  };

  const renderAside = () => {
    clearContainer(favoritesSectionElement);
    const favoritesView = new SimpleSidebarView('Избранные города');
    render(favoritesView, favoritesSectionElement);
    render(
      new SimpleMessageView(
        'Избранное пока пусто',
        'Сохраненные города появятся здесь.'
      ),
      favoritesView.contentElement
    );

    clearContainer(historySectionElement);
    const historyView = new SimpleSidebarView('История поиска');
    render(historyView, historySectionElement);
    render(
      new SimpleMessageView(
        'История пока пуста',
        'Выполненные поиски появятся здесь.'
      ),
      historyView.contentElement
    );
  };

  const handleSearchSubmit = async (city) => {
    const cityName = city.trim();

    if (!cityName) {
      renderSearch('Введите название города.');
      return;
    }

    renderSearch('Загрузка...');

    try {
      const responseData = await weatherService.getWeatherWithForecast(cityName);

      weatherModel.setWeather(responseData.currentWeather);
      forecastModel.setForecast(responseData.forecast);

      renderSearch(`Найдено: ${responseData.currentWeather.city}, ${responseData.currentWeather.country}`);
      renderWeather();
      renderForecast();
    } catch (error) {
      weatherModel.setWeather(null);
      forecastModel.setForecast([]);
      renderSearch(error.message);
      renderWeather();
      renderForecast();
    }
  };

  renderSearch();
  renderWeather();
  renderForecast();
  renderAside();
}
