import Events from '../view/events-content';
import TripEvensList from '../view/trip-events-list.js';
import SortContentView from '../view/sort-content.js';
import FormEventEdit from '../view/form-event-edit.js';
import EditEvent from '../view/edit-event.js';
import {render, RenderPosition} from '../render.js';

const tripContent = document.querySelector('.trip-events');
const QUANTITY_EVENT = 3;

export default class BoardPresenter {
  tripEvensList = new TripEvensList();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortContentView(), tripContent);
    render(this.tripEvensList, this.boardContainer);
    for (let i = 0; i < QUANTITY_EVENT; i++){
      render(new Events(), this.tripEvensList.getElement());
    }
    render(new FormEventEdit(), this.tripEvensList.getElement(), RenderPosition.AFTERBEGIN);
    render(new EditEvent(), this.tripEvensList.getElement());
  }

}
