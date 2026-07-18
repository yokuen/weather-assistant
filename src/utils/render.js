export const render = (component, container) => {
  container.append(component.element);
};

export const clearContainer = (container) => {
  container.innerHTML = '';
};
