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
import HourlySectionView from './view/hourly-section-view.js';
import HourlyItemView from './view/hourly-item-view.js';
import WeatherCardView from './view/weather-card-view.js';
import ForecastDayView from './view/forecast-day-view.js';
import FavoriteCityView from './view/favorite-city-view.js';
import HistoryCityView from './view/history-city-view.js';
import WeatherModel from './model/weather-model.js';
import ForecastModel from './model/forecast-model.js';
import HourlyModel from './model/hourly-model.js';
import SettingsModel from './model/settings-model.js';
import FavoritesModel from './model/favorites-model.js';
import HistoryModel from './model/history-model.js';
import WeatherApiService from './service/weather-api-service.js';
import { clearSection } from './utils/sections.js';
import { getAdviceItems } from './utils/advice.js';
import { loadState, saveState } from './utils/storage.js';
import { formatForecastDate } from './utils/date.js';
import { isCountryOnlyQuery } from './utils/weather.js';
import {
  DEFAULT_UNIT,
  WEATHER_API_KEY,
  WEATHER_API_URL,
  EMPTY_FORECAST_TEXT,
  EMPTY_WEATHER_TEXT,
  EMPTY_HOURLY_TEXT,
  FAVORITES_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  GEOLOCATION_ERROR_TEXT,
  SUGGESTIONS_LIMIT,
  SUGGESTIONS_DELAY,
} from './const.js';

const appElement = document.querySelector('#app');

if (appElement) {
  const appShellView = new AppShellView();
  render(appShellView, appElement);

  const weatherModel = new WeatherModel();
  const forecastModel = new ForecastModel();
  const hourlyModel = new HourlyModel();
  const settingsModel = new SettingsModel(loadState(SETTINGS_STORAGE_KEY, DEFAULT_UNIT));
  const favoritesModel = new FavoritesModel(loadState(FAVORITES_STORAGE_KEY, []));
  const historyModel = new HistoryModel(loadState(HISTORY_STORAGE_KEY, []));

  const weatherService = new WeatherApiService(WEATHER_API_URL, WEATHER_API_KEY);
  let suggestions = [];
  let searchValue = '';
  let suggestionsTimerId = null;

  const searchPanelElement = appShellView.element.querySelector('.search-panel');
  const logoButtonElement = appShellView.element.querySelector('.page-header__logo');
  const weatherSectionElement = appShellView.element.querySelector('.weather-section');
  const hourlySectionElement = appShellView.element.querySelector('.hourly-section');
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

  const renderSearch = (message = '', shouldFocus = false) => {
    clearContainer(searchPanelElement);
    render(
      new SearchFormView({
        onSubmit: handleSearchSubmit,
        onGeolocationClick: handleGeolocationClick,
        onInput: handleSearchInput,
        onSuggestionClick: handleSuggestionClick,
        message,
        suggestions,
        value: searchValue,
      }),
      searchPanelElement
    );

    if (shouldFocus) {
      const inputElement = searchPanelElement.querySelector('.search-panel__input');
      inputElement.focus();
      inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
    }
  };

  const getDisplayedWeather = () => {
    const currentWeather = weatherModel.weather;
    const selectedDay = forecastModel.selectedDay;
    const currentDay = forecastModel.forecast[0];

    if (!currentWeather || !selectedDay || selectedDay.dayLabel === currentDay?.dayLabel) {
      return currentWeather;
    }

    return {
      ...currentWeather,
      description: selectedDay.condition,
      conditionIcon: selectedDay.conditionIcon,
      temperature: selectedDay.averageTemperature,
      humidity: selectedDay.averageHumidity,
      windSpeed: selectedDay.maxWind,
      uv: selectedDay.uv,
      chanceOfRain: selectedDay.chanceOfRain,
      forecastDate: selectedDay.dayLabel,
      minTemperature: selectedDay.minTemperature,
      maxTemperature: selectedDay.maxTemperature,
      sunrise: selectedDay.sunrise,
      sunset: selectedDay.sunset,
    };
  };

  const getHourlyItems = (forecastDay) => {
    if (!forecastDay?.hours?.length) {
      return [];
    }

    const isToday = forecastDay.dayLabel === forecastModel.forecast[0]?.dayLabel;

    if (!isToday) {
      return forecastDay.hours.filter((_, index) => index % 3 === 0).slice(0, 8);
    }

    const localHour = Number(weatherModel.weather?.localTime?.split(' ')[1]?.split(':')[0]);
    const upcomingHours = Number.isFinite(localHour)
      ? forecastDay.hours.filter((hourItem) => Number(hourItem.time.split(':')[0]) >= localHour)
      : forecastDay.hours;

    return (upcomingHours.length ? upcomingHours : forecastDay.hours).slice(0, 8);
  };

  const renderWeather = () => {
    clearSection(weatherSectionElement);
    const displayedWeather = getDisplayedWeather();
    const sectionTitle = displayedWeather?.forecastDate
      ? `Прогноз на ${formatForecastDate(displayedWeather.forecastDate)}`
      : 'Погода сейчас';
    const weatherSectionView = new WeatherSectionView(sectionTitle);
    render(weatherSectionView, weatherSectionElement);

    if (!displayedWeather) {
      render(
        new SimpleMessageView('Погода пока не выбрана', EMPTY_WEATHER_TEXT),
        weatherSectionView.contentElement
      );
      return;
    }

    render(
      new WeatherCardView({
        weather: displayedWeather,
        unit: settingsModel.unit,
        isFavorite: favoritesModel.hasCity(displayedWeather.city),
        onFavoriteToggle: handleFavoriteToggle,
        onUnitChange: handleUnitChange,
      }),
      weatherSectionView.contentElement
    );
  };

  const renderHourly = () => {
    clearSection(hourlySectionElement);
    const isToday = !forecastModel.selectedDay
      || forecastModel.selectedDay.dayLabel === forecastModel.forecast[0]?.dayLabel;
    const hourlySectionView = new HourlySectionView(
      isToday ? 'Ближайшие часы на сегодня' : 'Погода по часам для выбранного дня'
    );
    render(hourlySectionView, hourlySectionElement);

    if (!hourlyModel.items.length) {
      render(
        new SimpleMessageView('Почасовой прогноз пока пуст', EMPTY_HOURLY_TEXT),
        hourlySectionView.contentElement
      );
      return;
    }

    hourlyModel.items.forEach((hourItem) => {
      render(new HourlyItemView(hourItem, settingsModel.unit), hourlySectionView.contentElement);
    });
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
      render(
        new ForecastDayView({
          forecastDay,
          unit: settingsModel.unit,
          onDaySelect: handleDaySelect,
          isActive: forecastModel.selectedDay?.dayLabel === forecastDay.dayLabel,
        }),
        forecastSectionView.contentElement
      );
    });
  };

  const renderAdvice = () => {
    clearSection(adviceSectionElement);
    const adviceSectionView = new AdviceSectionView();
    render(adviceSectionView, adviceSectionElement);

    const displayedWeather = getDisplayedWeather();

    if (!displayedWeather) {
      render(
        new SimpleMessageView(
          'Советы появятся после поиска',
          'Когда город будет найден, здесь появятся простые рекомендации на день.'
        ),
        adviceSectionView.contentElement
      );
      return;
    }

    getAdviceItems(displayedWeather).forEach((adviceItem) => {
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

  const applyResponseData = (responseData, selectedCityName = '') => {
    const currentWeather = selectedCityName
      ? { ...responseData.currentWeather, city: selectedCityName }
      : responseData.currentWeather;
    const { forecast } = responseData;

    weatherModel.setWeather(currentWeather);
    forecastModel.setForecast(forecast);
    forecastModel.setSelectedDay(forecast[0] ?? null);
    hourlyModel.setItems(getHourlyItems(forecast[0]));
    historyModel.addItem({
      city: currentWeather.city,
      country: currentWeather.country,
    });
    persistHistory();
    suggestions = [];
    searchValue = currentWeather.city;

    renderSearch(`Найдено: ${currentWeather.city}, ${currentWeather.country}`);
    renderWeather();
    renderHourly();
    renderForecast();
    renderAdvice();
    renderHistory();
  };

  const clearWeatherData = () => {
    weatherModel.setWeather(null);
    forecastModel.setForecast([]);
    forecastModel.setSelectedDay(null);
    hourlyModel.setItems([]);
    renderWeather();
    renderHourly();
    renderForecast();
    renderAdvice();
  };

  const runSearch = async (query, selectedCityName = '') => {
    searchValue = selectedCityName || query;
    renderSearch('Загрузка...');

    try {
      const responseData = await weatherService.getWeatherWithForecast(query);

      if (isCountryOnlyQuery(query, responseData.currentWeather)) {
        clearWeatherData();
        renderSearch(
          `Найдено название страны «${responseData.currentWeather.country}». Введите название города.`
        );
        return;
      }

      applyResponseData(responseData, selectedCityName);
    } catch (error) {
      clearWeatherData();
      renderSearch(error.message);
    }
  };

  async function handleSearchSubmit(city) {
    window.clearTimeout(suggestionsTimerId);
    const cityName = city.trim();
    searchValue = cityName;

    if (!cityName) {
      renderSearch('Введите название города.');
      return;
    }

    await runSearch(cityName);
  }

  async function handleRepeatSearch(city) {
    searchValue = city.city;
    await runSearch(city.city, city.city);
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
    renderHourly();
    renderForecast();
    renderAdvice();
  }

  function handleGeolocationClick() {
    if (!navigator.geolocation) {
      renderSearch(GEOLOCATION_ERROR_TEXT);
      return;
    }

    renderSearch('Определяем местоположение...');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const responseData = await weatherService.getWeatherByCoordinates(
            coords.latitude,
            coords.longitude
          );
          applyResponseData(responseData);
        } catch (error) {
          clearWeatherData();
          renderSearch(error.message);
        }
      },
      () => {
        renderSearch(GEOLOCATION_ERROR_TEXT);
      }
    );
  }

  function handleDaySelect(forecastDay) {
    forecastModel.setSelectedDay(forecastDay);
    hourlyModel.setItems(getHourlyItems(forecastDay));
    renderWeather();
    renderHourly();
    renderForecast();
    renderAdvice();
  }

  function handleSearchInput(value) {
    searchValue = value;
    const query = value.trim();
    window.clearTimeout(suggestionsTimerId);

    if (query.length < 2) {
      suggestions = [];
      renderSearch('', true);
      return;
    }

    suggestionsTimerId = window.setTimeout(async () => {
      try {
        const foundCities = await weatherService.searchCities(query);

        if (searchValue.trim() !== query) {
          return;
        }

        suggestions = foundCities.slice(0, SUGGESTIONS_LIMIT);
        renderSearch('', true);
      } catch {
        if (searchValue.trim() !== query) {
          return;
        }

        suggestions = [];
        renderSearch('', true);
      }
    }, SUGGESTIONS_DELAY);
  }

  async function handleSuggestionClick(suggestion) {
    window.clearTimeout(suggestionsTimerId);
    searchValue = suggestion.name;
    await runSearch(`${suggestion.latitude},${suggestion.longitude}`, suggestion.name);
  }

  function handleLogoClick() {
    window.clearTimeout(suggestionsTimerId);
    suggestions = [];
    searchValue = '';
    clearWeatherData();
    renderSearch();
  }

  logoButtonElement.addEventListener('click', handleLogoClick);

  renderSearch();
  renderWeather();
  renderHourly();
  renderForecast();
  renderAdvice();
  renderFavorites();
  renderHistory();
}
