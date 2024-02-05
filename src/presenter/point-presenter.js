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

  constructor(containerListPoint, pointModel, onDateChange, onModeChange) {
    this.#containerPoint = containerListPoint;
    this.#pointModel = pointModel;
    this.#handlerChangeData = onDateChange;
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
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointView);
    remove(prevPointEditView);

    render(this.#pointView, this.#containerPoint);
  }

  resetView(modePatch) {
    if (this.#addPointView !== null) {
      this.#onClosePointAddClick();
      const newPointButton = document.querySelector('.trip-main__event-add-btn');
      newPointButton.disabled = false;
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

    if (modePatch) {
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
        onFormSubmit: this.#onSaveNewPointSubmit,
      });
      render(this.#addPointView, this.#containerPoint, RenderPosition.AFTERBEGIN);
    }
  };

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointView.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditView.shake(resetFormState);
  }

  setSavingEditPoint() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditView.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setSavingNewPoint() {
    this.#addPointView.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditView.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  #onClosePointAddClick = () => {
    remove(this.#addPointView);
    this.#addPointView.reset({
      offers: [...this.#pointModel.offers],
      destinations: this.#pointModel.destinations
    });
    this.#addPointView = null;
  };

  #onSaveNewPointSubmit = (point) => {
    this.#handlerChangeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
