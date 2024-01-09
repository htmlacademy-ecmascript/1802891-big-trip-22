import ContentPresenter from './presenter/content-presenter.js';
import PointModel from './model/points-model.js';

const tripContent = document.querySelector('.trip-events');

const pointModel = new PointModel();

const contentPresenter = new ContentPresenter({
  contentContainer: tripContent,
  pointModel,
});

contentPresenter.init();
