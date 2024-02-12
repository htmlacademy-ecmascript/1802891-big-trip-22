import ContentPresenter from './presenter/content-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import PointApiService from './point-api-service.js';

const AUTHORIZATION = 'Basic er034jdzbdw';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';
const tripContent = document.querySelector('.trip-events');

const pointModel = new PointModel({
  pointApiService: new PointApiService(END_POINT, AUTHORIZATION),
  contentContainer: tripContent,
});
const filterModel = new FilterModel();

const contentPresenter = new ContentPresenter({
  contentContainer: tripContent,
  pointModel,
  filterModel,
});

contentPresenter.init();
