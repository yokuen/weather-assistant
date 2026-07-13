const createElement = (template) => {
  const newElement = document.createElement('div');

  newElement.innerHTML = template.trim();

  return newElement.firstElementChild;
};

export default class AbstractView {
  #element = null;

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
