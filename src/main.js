import './styles/style.css';
import { render } from './utils/render.js';
import AppShellView from './view/app-shell-view.js';
import SearchFormView from './view/search-form-view.js';
import WeatherSectionView from './view/weather-section-view.js';
import ForecastSectionView from './view/forecast-section-view.js';
import SimpleSidebarView from './view/simple-sidebar-view.js';
import WeatherCardView from './view/weather-card-view.js';
import ForecastDayView from './view/forecast-day-view.js';
import SidebarCityView from './view/sidebar-city-view.js';
import WeatherModel from './model/weather-model.js';
import ForecastModel from './model/forecast-model.js';
import FavoritesModel from './model/favorites-model.js';
import HistoryModel from './model/history-model.js';
import SettingsModel from './model/settings-model.js';

const appElement = document.querySelector('#app');

if (appElement) {
  const weatherModel = new WeatherModel();
  const forecastModel = new ForecastModel();
  const favoritesModel = new FavoritesModel();
  const historyModel = new HistoryModel();
  const settingsModel = new SettingsModel();

  weatherModel.setWeather({
    city: 'Екатеринбург',
    country: 'Россия',
    description: 'Переменная облачность',
    temperature: 21,
    feelsLike: 23,
    humidity: 68,
    windSpeed: 14,
    localTime: 'Четверг, 9 июля, 14:20',
  });

  forecastModel.setForecast([
    {
      dayLabel: 'Пятница',
      condition: 'Солнечно',
      minTemperature: 15,
      maxTemperature: 24,
    },
    {
      dayLabel: 'Суббота',
      condition: 'Облачно',
      minTemperature: 14,
      maxTemperature: 21,
    },
    {
      dayLabel: 'Воскресенье',
      condition: 'Небольшой дождь',
      minTemperature: 12,
      maxTemperature: 18,
    },
  ]);

  favoritesModel.setCities([
    { city: 'Москва', country: 'Россия' },
    { city: 'Казань', country: 'Россия' },
  ]);

  historyModel.setItems([
    { city: 'Сочи', country: 'Россия' },
    { city: 'Тюмень', country: 'Россия' },
    { city: 'Пермь', country: 'Россия' },
  ]);

  const appShellView = new AppShellView();
  render(appShellView, appElement);

  const searchPanelElement = appShellView.element.querySelector('.search-panel');
  const weatherSectionElement = appShellView.element.querySelector('.weather-section');
  const forecastSectionElement = appShellView.element.querySelector('.forecast-section');
  const favoritesSectionElement = appShellView.element.querySelector('.favorites-section');
  const historySectionElement = appShellView.element.querySelector('.history-section');

  render(new SearchFormView(), searchPanelElement);

  const weatherSectionView = new WeatherSectionView();
  render(weatherSectionView, weatherSectionElement);
  render(
    new WeatherCardView(weatherModel.weather, settingsModel.unit),
    weatherSectionView.contentElement
  );

  const forecastSectionView = new ForecastSectionView();
  render(forecastSectionView, forecastSectionElement);
  forecastModel.forecast.forEach((forecastDay) => {
    render(
      new ForecastDayView(forecastDay, settingsModel.unit),
      forecastSectionView.contentElement
    );
  });

  const favoritesView = new SimpleSidebarView('Избранные города');
  render(favoritesView, favoritesSectionElement);
  favoritesModel.cities.forEach((city) => {
    render(new SidebarCityView(city), favoritesView.contentElement);
  });

  const historyView = new SimpleSidebarView('История поиска');
  render(historyView, historySectionElement);
  historyModel.items.forEach((city) => {
    render(new SidebarCityView(city), historyView.contentElement);
  });
}
