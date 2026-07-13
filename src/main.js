import './styles/style.css';
import { render } from './utils/render.js';
import AppShellView from './view/app-shell-view.js';
import SearchFormView from './view/search-form-view.js';
import WeatherSectionView from './view/weather-section-view.js';
import ForecastSectionView from './view/forecast-section-view.js';
import SimpleSidebarView from './view/simple-sidebar-view.js';

const appElement = document.querySelector('#app');

if (appElement) {
  const appShellView = new AppShellView();
  render(appShellView, appElement);

  const searchPanelElement = appShellView.element.querySelector('.search-panel');
  const weatherSectionElement = appShellView.element.querySelector('.weather-section');
  const forecastSectionElement = appShellView.element.querySelector('.forecast-section');
  const favoritesSectionElement = appShellView.element.querySelector('.favorites-section');
  const historySectionElement = appShellView.element.querySelector('.history-section');

  render(new SearchFormView(), searchPanelElement);
  render(new WeatherSectionView(), weatherSectionElement);
  render(new ForecastSectionView(), forecastSectionElement);
  render(new SimpleSidebarView('Избранные города', 'Избранное'), favoritesSectionElement);
  render(new SimpleSidebarView('История поиска', 'История'), historySectionElement);
}
