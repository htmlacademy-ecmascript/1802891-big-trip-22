import EditPointView from '../view/edit-point.js';
import PointView from '../view/point.js';
import AddPointView from '../view/add-point.js';
import { UserAction, UpdateType } from '../const.js';
import { isDatesEqual } from '../utils/date.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const ModeAddPoint = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export default class RenderPoint {
  #containerPoint = null;

  #pointView = null;
  #pointEditView = null;
  #pointModel = null;
  #addPointView = null;

  #handlerModeChange = null;
  #handlerChangeData = null;

  #pointData = null;
  #mode = Mode.DEFAULT;
  #modeAddPoint = ModeAddPoint.CLOSE;

  constructor(containerListPoint, pointModel, onDateChange, onModeChange, modeAddPoint) {
    this.#containerPoint = containerListPoint;
    this.#pointModel = pointModel;
    this.#handlerChangeData = onDateChange;
    this.#handlerModeChange = onModeChange;
    this.#modeAddPoint = modeAddPoint;
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
      onFormSubmit: this.#handlerFormEditSubmit,
      onCloseEditClick: this.#handlerCloseEdit,
      onDeletePointSubmit: this.#handlerFormDeleteEditSubmit,
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
    if (this.#addPointView !== null) {
      this.#onClosePointAddClick();
    }

    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditView.reset({
        point: this.#pointData,
        checkedOffers: [...this.#pointModel.getOfferById(this.#pointData.typePoint, this.#pointData.offers)],
        offers: [...this.#pointModel.offers],
        destinations: this.#pointModel.destinations
      });
      this.#handlerSwapPointToEditClick();
    }
  }

  #handlerSwapEditToPointClick() {
    replace(this.#pointEditView, this.#pointView);
    this.#handlerModeChange();
    this.#mode = Mode.EDITING;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handlerSwapPointToEditClick() {
    replace(this.#pointView, this.#pointEditView);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditView.reset({
        point: this.#pointData,
        checkedOffers: [...this.#pointModel.getOfferById(this.#pointData.typePoint, this.#pointData.offers)],
        offers: [...this.#pointModel.offers],
        destinations: this.#pointModel.destinations
      });
      this.#handlerSwapPointToEditClick();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  //handlers
  #handlerFormEditSubmit = (update) => {
    const coincidenceTime = isDatesEqual(this.#pointData.startDate, update.startDate) && isDatesEqual(this.#pointData.endDate, update.endDate);
    const coincidencePrice = this.#pointData.price === update.price;

    this.#handlerSwapPointToEditClick();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handlerChangeData(
      UserAction.UPDATE_POINT,
      coincidenceTime && coincidencePrice ? UpdateType.PATCH : UpdateType.MINOR,
      update
    );
  };

  #handlerFormDeleteEditSubmit = (point) => {
    this.#handlerChangeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handlerCloseEdit = () => {
    this.#handlerSwapPointToEditClick();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handlerChangeFavoriteClick = () => {
    this.#handlerChangeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#pointData, isFavourite: !this.#pointData.isFavourite}
    );
  };

  destroy() {
    remove(this.#pointView);
    remove(this.#pointEditView);
  }

  renderPointAdd = () => {
    if (this.#addPointView === null) {
      this.#addPointView = new AddPointView({
        offers: [...this.#pointModel.offers],
        destinations: this.#pointModel.destinations,
        handlerClosePointClick: this.#onClosePointAddClick,
        //onFormSubmit: this.#handlerFormSubmit,
      });
      render(this.#addPointView, this.#containerPoint, RenderPosition.AFTERBEGIN);
    }
  };

  #onClosePointAddClick = () => {
    this.#modeAddPoint = ModeAddPoint.CLOSE;
    remove(this.#addPointView);
    this.#addPointView.reset({
      offers: [...this.#pointModel.offers],
      destinations: this.#pointModel.destinations
    });
    this.#addPointView = null;
  };
}
