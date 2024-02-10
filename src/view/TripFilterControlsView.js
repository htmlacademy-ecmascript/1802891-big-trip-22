import AbstractView from '../framework/view/abstract-view.js';

function createTemplateItemFilter(typeFilter, currentFilterType, pointsLength) {
  return (
    `
    <div class="trip-filters__filter">
      <input id="filter-${typeFilter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${typeFilter}" ${typeFilter === currentFilterType ? 'checked' : ''} ${pointsLength === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${typeFilter}">${typeFilter}</label>
    </div>
    `
  );

}

function createTripControls({filters, currentFilterType, pointsTimesLength}) {
  return `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createTemplateItemFilter(filter, currentFilterType, pointsTimesLength[filter])).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
}

export default class TripControlsView extends AbstractView{
  #filters = null;
  #currentFilterType = null;
  #handlerFilterTypeChange = null;
  #pointsTimesLength = null;

  constructor ({filters, currentFilterType, onFilterTypeChange, pointsTimesLength}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handlerFilterTypeChange = onFilterTypeChange;
    this.#pointsTimesLength = pointsTimesLength;

    this.element.addEventListener('change', this.#onSelectTypeFilterChange);
  }

  get template() {
    return createTripControls({filters: this.#filters, currentFilterType: this.#currentFilterType, pointsTimesLength: this.#pointsTimesLength});
  }

  #onSelectTypeFilterChange = (evt) => {
    evt.preventDefault();
    this.#handlerFilterTypeChange(evt.target.value);
  };
}
