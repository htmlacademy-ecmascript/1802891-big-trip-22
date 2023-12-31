import { getRandomArrayElement } from '../utils/mock-utils.js';
import { nanoid } from 'nanoid';

const mockOrders = [
  {
    typePoints: 'taxi',
    title: 'Geneva',
    startDate: new Date('2023-09-11T10:30:00Z'),
    endDate: new Date('2023-09-11T11:00:00.00Z'),
    price: 145,
    destinations: '1',
    offers: [
      '11',
      '12',
      '13'
    ],
    isFavourite: true,
  },
  {
    typePoints: 'bus',
    title: 'Amsterdam',
    startDate: new Date('2023-12-12T10:30'),
    endDate: new Date('2023-12-12T12:00'),
    price: 65,
    destinations: '2',
    offers: [
      '21',
      '22'
    ],
    isFavourite: false,
  },
  {
    typePoints: 'sightseeing',
    title: 'Moscow',
    startDate: new Date('2023-12-12T23:30'),
    endDate: new Date('2023-12-12T23:40'),
    price: 50,
    destinations: '3',
    offers: [],
    isFavourite: false,
  },
];

function getRandomPoint() {
  return {
    id: nanoid(),
    ...getRandomArrayElement(mockOrders)
  };

}


export { getRandomPoint };

