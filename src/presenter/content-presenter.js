import TripEvensListView from '../view/list-point-view.js';
import SortPointView from '../view/trip-sort-points-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { sortPointByTime, sortPointByPrice, sortPointsByDay } from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { remove, render } from '../framework/render.js';
import HeaderPresenter from './header-presenter.js';
import { RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class ContentPresenter {
  #tripList = new TripEvensListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #pointPresenter = null;
  #headerPresenter = null;
  #sortPointView = null;

  #contentContainer = null;
  #pointModel = null;
  #filterModel = null;
  #currentTypeSort = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #filteredPoints = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
    this.#filteredPoints = filter[this.#filterType](point);

    switch (this.#currentTypeSort) {
      case SortType.TIME:
        return this.#filteredPoints.sort(sortPointByTime);
      case SortType.PRICE:
        return this.#filteredPoints.sort(sortPointByPrice);
      case SortType.DAY:
        return this.#filteredPoints.sort(sortPointsByDay);
    }

    return this.#pointModel.points;
  }

  init() {
    this.#pointModel.init()
      .finally(() => {
        this.#renderHeader();
      });
    this.#renderContents();
  }

  #renderNoPoint = () => {
    this.#noPointComponent = new NoPointView({
      isErrorServer: false,
      filterType: this.#filterType,
    });
    render(this.#noPointComponent, this.#contentContainer);
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
  }

  #renderContents = (resetSortType = false) => {
    render(this.#tripList, this.#contentContainer);
    if (this.#isLoading && !this.#pointModel.isErrorServer) {
      this.#clearContent();
      this.#renderLoading();
      return;
    }

    if (resetSortType) {
      this.#currentTypeSort = SortType.DAY;
    }

    if (this.points.length === 0 && !this.#pointModel.isErrorServer) {
      this.#renderNoPoint();
      this.#pointPresenter = new PointPresenter(this.#tripList.element, this.#pointModel, this.#handleViewAction, this.#handlerModeChange, this.#noPointComponent, this.#renderNoPoint, this.points, this.#renderContents);
      return;
    }

    if (this.#headerPresenter !== null) {
      this.#headerPresenter.renderInfoComponents();
    }

    this.#renderSortPointsComponent();
    this.#renderPoints(this.points);
  };

  #renderHeader() {
    this.#headerPresenter = new HeaderPresenter({
      handlerOpenAddPoint: this.#handlerOpenAddPoint,
      filtersModel: this.#filterModel,
      pointModel: this.#pointModel,
      points: this.points
    });
    this.#headerPresenter.init();
    this.#headerPresenter.initFilters();
  }


  #renderPoints(points) {
    for (const dataPoint of points) {
      this.#pointPresenter = new PointPresenter(this.#tripList.element, this.#pointModel, this.#handleViewAction, this.#handlerModeChange, this.points);
      this.#pointPresenter.init(dataPoint);

      this.#pointPresenters.set(dataPoint.id, this.#pointPresenter);
    }
  }

  #renderSortPointsComponent() {
    this.#sortPointView = new SortPointView(
      this.#handlerSortTypePoints,
      this.#currentTypeSort,
    );

    render(this.#sortPointView, this.#contentContainer, RenderPosition.AFTERBEGIN);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSavingEditPoint();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointPresenter.setSavingNewPoint();
        try {
          await this.#pointModel.addPoints(updateType, update);
        } catch(err) {
          this.#pointPresenter.setAbortingNewPoint();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoints(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        this.#pointPresenters.get(data.id).resetView(true);
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
        if (this.#pointModel.isErrorServer) {
          this.#clearContent();
        }else {
          this.#renderContents();
        }
        break;
    }
  };

  #clearContent({resetSortType = false} = {}) {
    if (this.#pointPresenters.size === 0) {
      this.#pointPresenter?.onCloseNewPoint();
    }
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#headerPresenter !== null) {
      this.#headerPresenter.removeInfoComponents();
    }


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
    const newPointButton = document.querySelector('.trip-main__event-add-btn');

    if (this.#currentTypeSort === sortType) {
      return;
    }

    if (newPointButton.disabled === true) {
      newPointButton.disabled = false;
    }

    this.#clearContent();
    this.#currentTypeSort = sortType;
    this.#renderPoints(this.points);
    this.#renderSortPointsComponent();
    this.#headerPresenter.renderInfoComponents();
  };

  #handlerOpenAddPoint = () => {
    if (this.#noPointComponent !== null) {
      remove(this.#noPointComponent);
      this.#pointPresenter.renderPointAdd();
    }
    this.#handlerModeChange();
    this.#currentTypeSort = SortType.DAY;
    this.#filterType = FilterType.EVERYTHING;
    if (this.#sortPointView !== null && this.points.length !== 0) {
      remove(this.#sortPointView);
      this.#renderSortPointsComponent();
    }
    this.#headerPresenter.removeFilters();
    this.#headerPresenter.initFilters();
    this.#pointPresenter.renderPointAdd();
  };
}
