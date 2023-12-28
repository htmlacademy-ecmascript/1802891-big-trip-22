import EditPointView from '../view/edit-point.js';
import PointView from '../view/point.js';
import { render, replace, remove } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class RenderPoint {
  #containerPoint = null;

  #pointView = null;
  #pointEditView = null;
  #pointModel = null;

  #handlerModeChange = null;
  #handlerPointChange = null;

  #pointData = null;
  #mode = Mode.DEFAULT;

  constructor(containerListPoint, pointModel, onDateChange, onModeChange) {
    this.#containerPoint = containerListPoint;
    this.#pointModel = pointModel;
    this.#handlerPointChange = onDateChange;
    this.#handlerModeChange = onModeChange;
  }

  init(point) {
    this.#pointData = point;

    const prevPointView = this.#pointView;
    const prevPointEditView = this.#pointEditView;

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.#handlerSwapPointToEditClick();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    this.#pointView = new PointView({
      point: point,
      checkedOffers: [...this.#pointModel.getOfferById(point.typePoints, point.offers)],
      destinations: this.#pointModel.getDestinationsById(point.destinations),
      onEditPointClick: () => {
        this.#handlerSwapEditToPointClick();
        document.addEventListener('keydown', escKeyDownHandler);
      },
      onFavoriteChangeClick: this.#handlerChangeFavoriteClick,
    });

    this.#pointEditView = new EditPointView({
      point: point,
      checkedOffers: [...this.#pointModel.getOfferById(point.typePoints, point.offers)],
      offers: this.#pointModel.getOfferByType(point.typePoints),
      destinations: this.#pointModel.getDestinationsById(point.destinations),
      onFormSubmit: () => {
        this.#handlerSwapPointToEditClick();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    if (prevPointView === null || prevPointEditView === null) {
      render(this.#pointView, this.#containerPoint);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointView, prevPointView);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditView, prevPointEditView);
    }

    remove(prevPointView);
    remove(prevPointEditView);

    render(this.#pointView, this.#containerPoint);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditPoint() {
    replace(this.#pointEditView, this.#pointView);
    this.#handlerModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointView, this.#pointEditView);
    this.#mode = Mode.DEFAULT;
  }

  #handlerSwapEditToPointClick = () => {
    this.#replacePointToEditPoint();
  };

  #handlerSwapPointToEditClick = () => {
    this.#replaceEditFormToPoint();
  };

  #handlerChangeFavoriteClick = () => {
    this.#handlerPointChange({...this.#pointData, isFavourite: !this.#pointData.isFavourite});
  };

  destroy() {
    remove(this.#pointView);
    remove(this.#pointEditView);
  }
}
