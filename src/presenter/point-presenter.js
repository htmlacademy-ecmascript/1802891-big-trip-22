import EditPointView from '../view/edit-point.js';
import PointView from '../view/point.js';
import { render, replace } from '../framework/render.js';

export default class RenderPoint {
  #containerPoint = null;

  #pointComponent = null;
  #pointEditComponent = null;
  #pointModel = null;
  #point = null;
  constructor(containerListPoint, pointModel) {
    this.#containerPoint = containerListPoint;
    this.#pointModel = pointModel;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

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

    const pointEditComponent = new EditPointView({
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

    // if (prevPointComponent === null || prevPointEditComponent === null) {
    //   render(this.#pointComponent, this.#containerPoint);
    //   return;
    // }

    // if (this.#containerPoint.contains(prevPointComponent.element)) {
    //   replace(this.#pointEditComponent, prevPointComponent);
    // }

    function replacePointToEditPoint() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#containerPoint);
  }

}
