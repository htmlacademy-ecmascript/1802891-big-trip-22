import dayjs from 'dayjs';


function getDateDuration(day) {
  return dayjs(day.startDate).diff(dayjs(day.endDate));
}


function sortPointByTime(pointA, pointB) {
  const timeA = getDateDuration(pointA);
  const timeB = getDateDuration(pointB);

  return timeA - timeB;
}

function sortPointByPrice(pointA, pointB) {
  return pointB.price - pointA.price;
}

function sortPointsByDay (pointA, pointB) {
  return dayjs(pointA.startDate) - dayjs(pointB.startDate);
}

export { sortPointByTime, sortPointByPrice, sortPointsByDay};
