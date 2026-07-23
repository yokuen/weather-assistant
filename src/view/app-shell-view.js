import AbstractView from './abstract-view.js';

export default class AppShellView extends AbstractView {
  get template() {
    return `
      <div class="page">
        <header class="page-header">
          <button
            class="page-header__logo"
            type="button"
            aria-label="Сбросить выбранный город"
          >
            Погодный ассистент
          </button>
        </header>

        <main class="page-main">
          <section class="search-panel card"></section>

          <section class="layout">
            <div class="layout__main">
              <section class="weather-section"></section>
              <section class="hourly-section"></section>
              <section class="forecast-section"></section>
              <section class="advice-section"></section>
            </div>

            <aside class="layout__side">
              <section class="favorites-section"></section>
              <section class="history-section"></section>
            </aside>
          </section>
        </main>
      </div>
    `;
  }
}
