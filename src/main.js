import ContentPresenter from './presenter/content-presenter.js';
import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointApiService from './point-api-service.js';

const tripContent = document.querySelector('.trip-events');
const AUTHORIZATION = 'Basic er034jdzbdw';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const pointModel = new PointModel({
  pointApiService: new PointApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FilterModel();

const contentPresenter = new ContentPresenter({
  contentContainer: tripContent,
  pointModel,
  filterModel,
});

contentPresenter.init();
