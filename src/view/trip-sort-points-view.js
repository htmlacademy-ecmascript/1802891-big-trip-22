import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createTripSortContent(currentTypeSort) {
  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.DAY}" type="radio" name="trip-sort" value="sort-${SortType.DAY}" ${currentTypeSort === SortType.DAY ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-day" data-sort-type="${SortType.DAY}">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.TIME}" type="radio" name="trip-sort" value="sort-${SortType.TIME}" ${currentTypeSort === SortType.TIME ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-time" data-sort-type="${SortType.TIME}">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.PRICE}" type="radio" name="trip-sort" value="sort-${SortType.PRICE}" ${currentTypeSort === SortType.PRICE ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-price" data-sort-type="${SortType.PRICE}">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>
  `;
}

export default class TripSortPointsView extends AbstractView{
  #handlerSortByTypePoints = null;
  #currentTypeSort = null;
  constructor(onSortTypePointsChange, currentTypeSort) {
    super();
    this.#handlerSortByTypePoints = onSortTypePointsChange;
    this.#currentTypeSort = currentTypeSort;

    this.element.addEventListener('change', this.#onSortPointsByTypeChange);
  }

  get template() {
    return createTripSortContent(this.#currentTypeSort);
  }

  #onSortPointsByTypeChange = (evt) => {
    if (evt.target.closest('.trip-sort__item ')) {
      this.#handlerSortByTypePoints(evt.target.dataset.sortType);
    }
  };
}
