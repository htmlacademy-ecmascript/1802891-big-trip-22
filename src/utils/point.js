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
  return pointB.price - pointA.price;
}

export { sortPointByTime, sortPointByPrice};
