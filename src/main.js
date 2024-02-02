import ContentPresenter from './presenter/content-presenter.js';
import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const tripContent = document.querySelector('.trip-events');

const pointModel = new PointModel();
const filterModel = new FilterModel();

const contentPresenter = new ContentPresenter({
  contentContainer: tripContent,
  pointModel,
  filterModel
});

contentPresenter.init();
