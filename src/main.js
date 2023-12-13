import FilterView from './view/filter-main.js';
import ContentPresenter from './presenter/content-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import OrderModel from './model/orders-model.js';
import {render} from './render.js';

const tripMain = document.querySelector('.trip-main');
const containerFilters = tripMain.querySelector('.trip-controls__filters');
const tripContent = document.querySelector('.trip-events');

const orderModel = new OrderModel();
const contentPresenter = new ContentPresenter({
  contentContainer: tripContent,
  orderModel,
});
const headerPresenter = new HeaderPresenter({headerContainer: tripMain});


render(new FilterView(), containerFilters);

contentPresenter.init();
headerPresenter.init();
