import EditPointView from '../view/edit-point.js';
import PointView from '../view/point.js';
import AddPointView from '../view/add-point.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class RenderPoint {
  #containerPoint = null;

  #pointView = null;
  #pointEditView = null;
  #addPointView = null;
  #pointModel = null;

  #handlerModeChange = null;
  #handlerPointUpdate = null;

  #pointData = null;
  #mode = Mode.DEFAULT;

  constructor(containerListPoint, pointModel, onDateChange, onModeChange) {
    this.#containerPoint = containerListPoint;
    this.#pointModel = pointModel;
    this.#handlerPointUpdate = onDateChange;
    this.#handlerModeChange = onModeChange;
  }

  init(point) {
    this.#pointData = point;

    const prevPointView = this.#pointView;
    const prevPointEditView = this.#pointEditView;

    this.#pointView = new PointView({
      point: point,
      checkedOffers: [...this.#pointModel.getOfferById(point.typePoint, point.offers)],
      destination: this.#pointModel.getDestinationsById(point.destinationId),
      onEditPointClick: () => {
        this.#handlerSwapEditToPointClick();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteChangeClick: this.#handlerChangeFavoriteClick,
    });

    this.#pointEditView = new EditPointView({
      point: point,
      checkedOffers: [...this.#pointModel.getOfferById(point.typePoint, point.offers)],
      offers: [...this.#pointModel.offers],
      destinations: this.#pointModel.destinations,
      onFormSubmit: this.#handlerFormSubmit,
      onCloseEditClick: this.#handlerCloseEdit,
    });

    this.#addPointView = new AddPointView({
      offers: [...this.#pointModel.offers],
      destinations: this.#pointModel.destinations,
      handlerClosePointClick: this.#onClosePointAddClick,
      //onFormSubmit: this.#handlerFormSubmit,
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
    this.#pointEditView.reset({
      point: this.#pointData,
      checkedOffers: [...this.#pointModel.getOfferById(this.#pointData.typePoint, this.#pointData.offers)],
      offers: [...this.#pointModel.offers],
      destinations: this.#pointModel.destinations
    });
    this.#onClosePointAddClick();
  }

  #replacePointToEditPoint() {
    replace(this.#pointEditView, this.#pointView);
    this.#handlerModeChange();
    this.#mode = Mode.EDITING;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditFormToPoint() {
    replace(this.#pointView, this.#pointEditView);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#handlerSwapPointToEditClick();
      this.#pointEditView.reset({
        point: this.#pointData,
        checkedOffers: [...this.#pointModel.getOfferById(this.#pointData.typePoint, this.#pointData.offers)],
        offers: [...this.#pointModel.offers],
        destinations: this.#pointModel.destinations
      });
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  //handlers
  #handlerFormSubmit = (point) => {
    this.#handlerSwapPointToEditClick();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    //this.#handlerPointUpdate(point);
  };

  #handlerCloseEdit = () => {
    this.#handlerSwapPointToEditClick();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handlerSwapEditToPointClick = () => {
    this.#replacePointToEditPoint();
  };

  #handlerSwapPointToEditClick = () => {
    this.#replaceEditFormToPoint();
  };

  #handlerChangeFavoriteClick = () => {
    this.#handlerPointUpdate({...this.#pointData, isFavourite: !this.#pointData.isFavourite});
  };

  destroy() {
    remove(this.#pointView);
    remove(this.#pointEditView);
  }

  renderPointAdd = () => {
    render(this.#addPointView, this.#containerPoint, RenderPosition.AFTERBEGIN);
  };

  #onClosePointAddClick = () => {
    remove(this.#addPointView);
    this.#addPointView.reset({
      offers: [...this.#pointModel.offers],
      destinations: this.#pointModel.destinations
    });
  };
}
