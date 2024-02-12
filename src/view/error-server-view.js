import AbstractView from '../framework/view/abstract-view';

function createErrorServerTemplate() {
  return `
    <p class="trip-events__msg">
      Failed to load latest route information
    </p>
  `;
}

export default class ErrorServerView extends AbstractView {
  get template() {
    return createErrorServerTemplate();
  }
}
