import dayjs from 'dayjs';


function getDateDuration(day) {
  return dayjs(day.startDate).diff(dayjs(day.endDate));
}


function sortPointByTime(pointA, pointB) {
  const timeA = getDateDuration(pointA);
  const timeB = getDateDuration(pointB);

  return timeB - timeA;
}

function sortPointByPrice(pointA, pointB) {
  return pointA.price - pointB.price;
}

function sortPointsByDay (pointA, pointB) {
  return dayjs(pointA.startDate) - dayjs(pointB.startDate);
}

export { sortPointByTime, sortPointByPrice, sortPointsByDay};
