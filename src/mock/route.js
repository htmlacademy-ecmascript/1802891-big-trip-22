import { getRandomArrayElement } from '../utils/mock-utils.js';
import { nanoid } from 'nanoid';

const mockOrders = [
  {
    typePoint: 'Taxi',
    startDate: new Date('2023-09-11T10:30:00'),
    endDate: new Date('2023-09-11T11:00:00'),
    price: 145,
    destinationId: '1',
    offers: [
      '11',
      '12',
      '13'
    ],
    isFavourite: true,
  },
  {
    typePoint: 'Bus',
    startDate: new Date('2023-12-12T10:30'),
    endDate: new Date('2023-12-12T12:00'),
    price: 65,
    destinationId: '2',
    offers: [
      '21',
      '22'
    ],
    isFavourite: false,
  },
  {
    typePoint: 'Sightseeing',
    startDate: new Date('2023-12-12T23:30'),
    endDate: new Date('2023-12-12T23:40'),
    price: 50,
    destinationId: '3',
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

