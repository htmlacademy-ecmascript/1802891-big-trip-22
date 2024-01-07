import ContentPresenter from './presenter/content-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import PointModel from './model/points-model.js';

const tripContent = document.querySelector('.trip-events');

const pointModel = new PointModel();

const contentPresenter = new ContentPresenter({
  contentContainer: tripContent,
  pointModel,
});
//const headerPresenter = new HeaderPresenter({headerContainer: tripMain, containerFilters, pointModel});

contentPresenter.init();
//headerPresenter.init();
