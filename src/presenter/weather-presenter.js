import { clearContainer, render } from '../utils/render.js';
import SearchFormView from '../view/search-form-view.js';
import WeatherSectionView from '../view/weather-section-view.js';
import WeatherCardView from '../view/weather-card-view.js';
import SimpleMessageView from '../view/simple-message-view.js';

export default class WeatherPresenter {
  #searchContainer = null;
  #weatherContainer = null;
  #weatherModel = null;
  #settingsModel = null;
  #weatherService = null;

  constructor({ searchContainer, weatherContainer, weatherModel, settingsModel, weatherService }) {
    this.#searchContainer = searchContainer;
    this.#weatherContainer = weatherContainer;
    this.#weatherModel = weatherModel;
    this.#settingsModel = settingsModel;
    this.#weatherService = weatherService;
  }

  init() {
    this.#renderSearch();
    this.#renderWeather();
  }

  #renderSearch(options = {}) {
    clearContainer(this.#searchContainer);
    render(new SearchFormView(this.#handleSearchSubmit, options), this.#searchContainer);
  }

  #renderWeather() {
    clearContainer(this.#weatherContainer);

    const weatherSectionView = new WeatherSectionView();
    render(weatherSectionView, this.#weatherContainer);

    if (!this.#weatherModel.weather) {
      render(
        new SimpleMessageView(
          'Погода пока не выбрана',
          'После поиска здесь появится карточка текущей погоды.'
        ),
        weatherSectionView.contentElement
      );
      return;
    }

    render(
      new WeatherCardView(this.#weatherModel.weather, this.#settingsModel.unit),
      weatherSectionView.contentElement
    );
  }

  #handleSearchSubmit = async (city) => {
    const cityName = city.trim();

    if (!cityName) {
      this.#renderSearch({ message: 'Введите название города.' });
      return;
    }

    this.#renderSearch({ city: cityName, isLoading: true });

    try {
      const weather = await this.#weatherService.getCurrentWeather(cityName);
      this.#weatherModel.setWeather(weather);

      this.#renderSearch({
        message: `Найдено: ${weather.city}, ${weather.country}`,
        city: cityName,
      });
      this.#renderWeather();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Произошла неизвестная ошибка. Попробуйте еще раз.';

      this.#renderSearch({ message, city: cityName });
    }
  };
}
