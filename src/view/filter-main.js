import AbstractView from '../framework/view/abstract-view.js';

function createTemplateItemFilter(typeFilter, currentFilterType) {
  return (
    `
    <div class="trip-filters__filter">
      <input id="filter-${typeFilter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${typeFilter}" ${typeFilter === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${typeFilter}">${typeFilter}</label>
    </div>
    `
  );

}

function createTripControls({filters, currentFilterType}) {
  return `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createTemplateItemFilter(filter, currentFilterType)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
}

export default class TripControlsView extends AbstractView{
  #filters = null;
  #currentFilterType = null;
  #handlerFilterTypeChange = null;

  constructor ({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handlerFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTripControls({filters: this.#filters, currentFilterType: this.#currentFilterType});
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handlerFilterTypeChange(evt.target.value);
  };
}
