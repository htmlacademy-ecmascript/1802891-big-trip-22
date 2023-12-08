import FilterView from './view/filter-main.js';
import BoardPresenter from './presenter/board-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import {render} from './render.js';

const tripMain = document.querySelector('.trip-main');
const containerFilters = tripMain.querySelector('.trip-controls__filters');
const tripContent = document.querySelector('.trip-events');


const boardPresenter = new BoardPresenter({boardContainer: tripContent});
const headerPresenter = new HeaderPresenter({boardContainer: tripMain});

// render(new TripInfo(), siteTripMain);
render(new FilterView(), containerFilters);

boardPresenter.init();
headerPresenter.init();
