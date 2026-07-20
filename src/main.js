import './styles/style.css';
import { clearContainer, render } from './utils/render.js';
import AppShellView from './view/app-shell-view.js';
import SimpleSidebarView from './view/simple-sidebar-view.js';
import HistorySidebarView from './view/history-sidebar-view.js';
import SimpleMessageView from './view/simple-message-view.js';
import SearchFormView from './view/search-form-view.js';
import WeatherSectionView from './view/weather-section-view.js';
import ForecastSectionView from './view/forecast-section-view.js';
import AdviceSectionView from './view/advice-section-view.js';
import AdviceItemView from './view/advice-item-view.js';
import WeatherCardView from './view/weather-card-view.js';
import ForecastDayView from './view/forecast-day-view.js';
import FavoriteCityView from './view/favorite-city-view.js';
import HistoryCityView from './view/history-city-view.js';
import WeatherModel from './model/weather-model.js';
import ForecastModel from './model/forecast-model.js';
import SettingsModel from './model/settings-model.js';
import FavoritesModel from './model/favorites-model.js';
import HistoryModel from './model/history-model.js';
import WeatherApiService from './service/weather-api-service.js';
import { clearSection } from './utils/sections.js';
import { getAdviceItems } from './utils/advice.js';
import { loadState, saveState } from './utils/storage.js';
import {
  DEFAULT_UNIT,
  WEATHER_API_KEY,
  WEATHER_API_URL,
  EMPTY_FORECAST_TEXT,
  EMPTY_WEATHER_TEXT,
  FAVORITES_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
} from './const.js';

const appElement = document.querySelector('#app');

if (appElement) {
  const appShellView = new AppShellView();
  render(appShellView, appElement);

  const weatherModel = new WeatherModel();
  const forecastModel = new ForecastModel();
  const settingsModel = new SettingsModel(loadState(SETTINGS_STORAGE_KEY, DEFAULT_UNIT));
  const favoritesModel = new FavoritesModel(loadState(FAVORITES_STORAGE_KEY, []));
  const historyModel = new HistoryModel(loadState(HISTORY_STORAGE_KEY, []));

  const weatherService = new WeatherApiService(WEATHER_API_URL, WEATHER_API_KEY);

  const searchPanelElement = appShellView.element.querySelector('.search-panel');
  const weatherSectionElement = appShellView.element.querySelector('.weather-section');
  const forecastSectionElement = appShellView.element.querySelector('.forecast-section');
  const adviceSectionElement = appShellView.element.querySelector('.advice-section');
  const favoritesSectionElement = appShellView.element.querySelector('.favorites-section');
  const historySectionElement = appShellView.element.querySelector('.history-section');

  const persistFavorites = () => {
    saveState(FAVORITES_STORAGE_KEY, favoritesModel.cities);
  };

  const persistHistory = () => {
    saveState(HISTORY_STORAGE_KEY, historyModel.items);
  };

  const persistSettings = () => {
    saveState(SETTINGS_STORAGE_KEY, settingsModel.unit);
  };

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
      new WeatherCardView({
        weather: weatherModel.weather,
        unit: settingsModel.unit,
        isFavorite: favoritesModel.hasCity(weatherModel.weather.city),
        onFavoriteToggle: handleFavoriteToggle,
        onUnitChange: handleUnitChange,
      }),
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
      render(new ForecastDayView(forecastDay, settingsModel.unit), forecastSectionView.contentElement);
    });
  };

  const renderAdvice = () => {
    clearSection(adviceSectionElement);
    const adviceSectionView = new AdviceSectionView();
    render(adviceSectionView, adviceSectionElement);

    if (!weatherModel.weather) {
      render(
        new SimpleMessageView(
          'Советы появятся после поиска',
          'Когда город будет найден, здесь появятся простые рекомендации на день.'
        ),
        adviceSectionView.contentElement
      );
      return;
    }

    const adviceItems = getAdviceItems(weatherModel.weather);
    adviceItems.forEach((adviceItem) => {
      render(new AdviceItemView(adviceItem), adviceSectionView.contentElement);
    });
  };

  const renderFavorites = () => {
    clearContainer(favoritesSectionElement);
    const favoritesView = new SimpleSidebarView('Избранные города');
    render(favoritesView, favoritesSectionElement);

    if (!favoritesModel.cities.length) {
      render(
        new SimpleMessageView(
          'Избранное пока пусто',
          'Добавьте город из главной карточки, чтобы открыть его снова в один клик.'
        ),
        favoritesView.contentElement
      );
      return;
    }

    favoritesModel.cities.forEach((city) => {
      render(
        new FavoriteCityView(city, handleRepeatSearch, handleFavoriteRemove),
        favoritesView.contentElement
      );
    });
  };

  const renderHistory = () => {
    clearContainer(historySectionElement);
    const historyView = new HistorySidebarView(handleHistoryClear);
    render(historyView, historySectionElement);

    if (!historyModel.items.length) {
      render(
        new SimpleMessageView(
          'История пока пустая',
          'После успешного поиска здесь появятся последние найденные города.'
        ),
        historyView.contentElement
      );
      return;
    }

    historyModel.items.forEach((city) => {
      render(new HistoryCityView(city, handleRepeatSearch), historyView.contentElement);
    });
  };

  const runSearch = async (cityName) => {
    renderSearch('Загрузка...');

    try {
      const responseData = await weatherService.getWeatherWithForecast(cityName);
      const { currentWeather, forecast } = responseData;

      weatherModel.setWeather(currentWeather);
      forecastModel.setForecast(forecast);
      historyModel.addItem({
        city: currentWeather.city,
        country: currentWeather.country,
      });
      persistHistory();

      renderSearch(`Найдено: ${currentWeather.city}, ${currentWeather.country}`);
      renderWeather();
      renderForecast();
      renderAdvice();
      renderHistory();
    } catch (error) {
      weatherModel.setWeather(null);
      forecastModel.setForecast([]);
      renderSearch(error.message);
      renderWeather();
      renderForecast();
      renderAdvice();
    }
  };

  async function handleSearchSubmit(city) {
    const cityName = city.trim();

    if (!cityName) {
      renderSearch('Введите название города.');
      return;
    }

    await runSearch(cityName);
  }

  async function handleRepeatSearch(city) {
    await runSearch(city.city);
  }

  function handleFavoriteToggle(weather) {
    favoritesModel.toggleCity({
      city: weather.city,
      country: weather.country,
    });
    persistFavorites();
    renderWeather();
    renderFavorites();
  }

  function handleFavoriteRemove(city) {
    favoritesModel.removeCity(city.city);
    persistFavorites();
    renderWeather();
    renderFavorites();
  }

  function handleHistoryClear() {
    historyModel.clear();
    persistHistory();
    renderHistory();
  }

  function handleUnitChange(unit) {
    settingsModel.setUnit(unit);
    persistSettings();
    renderWeather();
    renderForecast();
  }

  renderSearch();
  renderWeather();
  renderForecast();
  renderAdvice();
  renderFavorites();
  renderHistory();
}
