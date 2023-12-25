import PointView from '../view/point.js';
import TripEvensListView from '../view/trip-list.js';
import SortContentView from '../view/sort-content.js';
import AddOrderView from '../view/add-point.js';
import NoPoint from '../view/list-point-empty.js';
import EditPointView from '../view/edit-point.js';
import { render, replace } from '../framework/render.js';

export default class contentPresenter {
  #evensList = new TripEvensListView();

  #contentContainer = null;
  #pointModel = null;

  constructor({contentContainer, pointModel}) {
    this.#contentContainer = contentContainer;
    this.#pointModel = pointModel;
  }


  init() {
    this.dataPoints = [...this.#pointModel.points];
    this.#renderBoardPoints();
  }

  #renderBoardPoints() {
    if (this.dataPoints.length === 0) {
      render(new NoPoint, this.#contentContainer);
      return;
    }


    render(new SortContentView(), this.#contentContainer);
    render(this.#evensList, this.#contentContainer);

    for (const dataPoint of this.dataPoints) {
      this.#renderPoint(dataPoint);
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point: point,
      checkedOffers: [...this.#pointModel.getOfferById(point.typePoints, point.offers)],
      destinations: this.#pointModel.getDestinationsById(point.destinations),
      onEditPointClick: () => {
        replacePointToEditPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPoint = new EditPointView({
      point: point,
      checkedOffers: [...this.#pointModel.getOfferById(point.typePoints, point.offers)],
      offers: this.#pointModel.getOfferByType(point.typePoints),
      destinations: this.#pointModel.getDestinationsById(point.destinations),
      onFormSubmit: () => {
        replaceEditFormToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      },
      onCloseFormClick: () => {
        replaceEditFormToPoint();
      }
    });

    function replacePointToEditPoint() {
      replace(editPoint, pointComponent);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, editPoint);
    }

    render(pointComponent, this.#evensList.element);
  }

}
