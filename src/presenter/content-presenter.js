import TripEvensListView from '../view/trip-list.js';
import SortPointView from '../view/sort-point.js';
import NoPointView from '../view/list-point-empty.js';
import PointPresenter from './point-presenter.js';
import { sortPointByTime, sortPointByPrice } from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { remove, render } from '../framework/render.js';
import HeaderPresenter from './header-presenter.js';
import { RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';

const ModeAddPoint = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export default class contentPresenter {
  #tripList = new TripEvensListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #pointPresenter = null;
  #headerPresenter = null;
  #sortPointView = null;

  #contentContainer = null;
  #pointModel = null;
  #filterModel = null;
  #modeAddPoint = ModeAddPoint.CLOSE;
  #currentTypeSort = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #pointPresenters = new Map();

  constructor({contentContainer, pointModel, filterModel }) {
    this.#contentContainer = contentContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const point = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](point);

    switch (this.#currentTypeSort) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointByPrice);
    }

    return this.#pointModel.points;
  }

  init() {
    this.#renderContents();
    this.#pointModel.init()
      .finally(() => {
        this.#renderHeader();
      });
  }

  #renderNoPoint() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType,
    });
    render(this.#noPointComponent, this.#contentContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
  }

  #renderContents() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#pointModel.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    this.#renderSortPoints();
    render(this.#tripList, this.#contentContainer);
    this.#renderPoints(this.#pointModel.points);
  }

  #renderHeader() {
    this.#headerPresenter = new HeaderPresenter({
      handlerOpenAddPoint: this.#handlerOpenAddPoint,
      filtersModel: this.#filterModel,
      pointModel: this.#pointModel,
    });
    this.#headerPresenter.init();
    this.#headerPresenter.initFilters();
  }


  #renderPoints(points) {
    for (const dataPoint of points) {
      this.#pointPresenter = new PointPresenter(this.#tripList.element, this.#pointModel, this.#handleViewAction, this.#handlerModeChange, this.#modeAddPoint);
      this.#pointPresenter.init(dataPoint);

      this.#pointPresenters.set(dataPoint.id, this.#pointPresenter);
    }
  }

  #renderSortPoints() {
    this.#sortPointView = new SortPointView(
      this.#handlerSortTypePoints,
      this.#currentTypeSort,
    );

    render(this.#sortPointView, this.#contentContainer, RenderPosition.AFTERBEGIN);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoints(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoints(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearContent();
        this.#renderContents();
        break;
      case UpdateType.MAJOR:
        this.#clearContent();
        this.#renderContents({resetSortType: true});
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContents();
        break;
    }
  };

  #clearContent({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#loadingComponent);
    remove(this.#sortPointView);
    remove(this.#noPointComponent);

    if (resetSortType) {
      this.#currentTypeSort = SortType.DAY;
    }
  }

  #handlerModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlerSortTypePoints = (sortType) => {
    if (this.#currentTypeSort === sortType) {
      return;
    }
    this.#clearContent();
    this.#currentTypeSort = sortType;
    this.#renderPoints(this.points);
    this.#renderSortPoints();
  };

  #handlerOpenAddPoint = () => {
    this.#handlerModeChange();
    this.#pointPresenter.renderPointAdd();
  };
}
