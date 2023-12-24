import ContentPresenter from './presenter/content-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import PointModel from './model/points-model.js';

const tripMain = document.querySelector('.trip-main');
const containerFilters = tripMain.querySelector('.trip-controls__filters');
const tripContent = document.querySelector('.trip-events');

const pointModel = new PointModel();
const contentPresenter = new ContentPresenter({
  contentContainer: tripContent,
  pointModel,
});
const headerPresenter = new HeaderPresenter({headerContainer: tripMain, containerFilters});

contentPresenter.init();
headerPresenter.init();
