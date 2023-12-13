import { getRandomArrayElement } from '../view/utils.js';
import { typeRoutes } from '../view/const.js';

const mockOrders = [
  {
    id: 1,
    dueData: new Date('2023-09-11'),
    typeOrders: getRandomArrayElement(typeRoutes),
    title: 'Geneva',
    startTime: '2023-09-11T10:30',
    endTime: '2023-09-11T11:00',
    price: '145',
    pictures: 'https://loremflickr.com/248/152?random=3',
    description: 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.',
    offers: [
      {
        id:2,
        title: 'Add meal',
        price: '12',
        isActive: true,
      },
      {
        id:1,
        title: 'Add luggage',
        price: '50',
        isActive: false,
      }
    ],
    isFavourite: true,
  },
  {
    dueData: new Date('2023-08-12'),
    typeOrders: getRandomArrayElement(typeRoutes),
    title: 'Amsterdam',
    startTime: '2023-12-12T10:30',
    endTime: '2023-12-12T12:00',
    price: '65',
    services: ['Add luggage +€ 50', 'Add meal +€ 15'],
    isFavourite: false,
  },
  {
    dueData: new Date('2023-07-12'),
    typeOrders: getRandomArrayElement(typeRoutes),
    title: 'Moscow',
    startTime: '2023-30-12T23:30',
    endTime: '2023-30-12T23:40',
    price: '50',
    services: ['Add luggage +€ 50'],
    isFavourite: false,
  },
];

function getRandomOrder() {
  return getRandomArrayElement(mockOrders);
}


export { getRandomOrder};

