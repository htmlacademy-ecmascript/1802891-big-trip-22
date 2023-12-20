import PointView from '../view/point.js';
import TripEvensListView from '../view/events-list.js';
import SortContentView from '../view/sort-content.js';
import AddOrderView from '../view/add-point.js';
import EditPointView from '../view/edit-point.js';
import {render, RenderPosition} from '../framework/render.js';

const QUANTITY_EVENT = 3;

export default class contentPresenter {
  #evensList = new TripEvensListView();
  // #pointComponent = new PointView();

  #contentContainer = null;
  #pointModel = null;

  constructor({contentContainer, pointModel}) {
    this.#contentContainer = contentContainer;
    this.#pointModel = pointModel;
  }


  init() {
    this.contentPoints = [...this.#pointModel.points];
    render(new SortContentView(), this.#contentContainer);
    render(this.#evensList, this.#contentContainer);

    for (let i = 0; i < QUANTITY_EVENT; i++){
      render(new PointView({
        point: this.contentPoints[i],
        checkedOffers: [...this.#pointModel.getOfferById(this.contentPoints[i].typePoints, this.contentPoints[i].offers)],
        destinations: this.#pointModel.getDestinationsById(this.contentPoints[i].destinations)
      }
      ), this.#evensList.element);
    }

    render(new AddOrderView({
      point: this.contentPoints[0],
      checkedOffers: [...this.#pointModel.getOfferById(this.contentPoints[0].typePoints, this.contentPoints[0].offers)],
      offers: this.#pointModel.getOfferByType(this.contentPoints[0].typePoints),
      destinations: this.#pointModel.getDestinationsById(this.contentPoints[0].destinations)
    }), this.#evensList.element, RenderPosition.AFTERBEGIN);

    render(new EditPointView({
      point: this.contentPoints[0],
      checkedOffers: [...this.#pointModel.getOfferById(this.contentPoints[0].typePoints, this.contentPoints[0].offers)],
      offers: this.#pointModel.getOfferByType(this.contentPoints[0].typePoints),
      destinations: this.#pointModel.getDestinationsById(this.contentPoints[0].destinations)
    }), this.#evensList.element);
  }
}
