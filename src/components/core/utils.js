export const slugGenerator = title => {
  return (
    title
      .replace(/\s+/g, '-')
      // .replace(/\|/g, "and")
      .toLowerCase()
  );
};

export const getDayName = day => {
  // day is number returned fom js dateObj.getDay() sun=0, mon=1, ... sat=6
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  return days[day];
};

export const getDateFromHours = hrsStr => {
  // hrsStr = '08:00:00', '23:09:00'
  const hrsStrSplit = hrsStr.split(':');
  const dateFromHrs = new Date();
  dateFromHrs.setHours(hrsStrSplit[0], hrsStrSplit[1], 0);
  return dateFromHrs;
};

export const activeDay = offDays => {
  // a list of off days [0, 6]
  const today = new Date().getDay();
  try {
    const isOffDay = JSON.parse(offDays).find(day => day === today);
    if (typeof isOffDay === 'undefined') {
      // Its an active day
      return true;
    } else return false;
  } catch {
    throw new Error('Error parsing offDays');
  }
};

// check if the store is in active time period
export const activeStoreTime = (startTime, endTime) => {
  const startTimeList = startTime.split(':');
  const endTimeList = endTime.split(':');

  const currentDateTime = new Date();

  const startDateTime = new Date();
  startDateTime.setHours(
    parseInt(startTimeList[0]),
    parseInt(startTimeList[1]),
    0
  );

  const endDateTime = new Date();
  endDateTime.setHours(parseInt(endTimeList[0]), parseInt(endTimeList[1]), 0);

  return currentDateTime > startDateTime && currentDateTime < endDateTime;
};

// check is the store is open now or not
export const getIsStoreOpenNow = (openAt, closeAt, offDays, isOpenToday) => {
  const isActiveStoreTime = activeStoreTime(openAt, closeAt);
  const isActiveStoreDay = activeDay(offDays);

  const isStoreOpenNow = isActiveStoreTime && isActiveStoreDay && isOpenToday;

  return isStoreOpenNow;
};

// newPageInfo for veryFirstProductAdded
export const newPageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: true,
  endCursor: true,
  __typename: 'PageInfo'
};

export const emptyPageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  endCursor: null,
  __typename: 'PageInfo'
};

export function getJsonFriendlyString(string) {
  return string.replace(/\'/g, '"');
}

const singularOrPlural = noOfItems => {
  if (noOfItems === 1) {
    return '';
  } else if (noOfItems > 1) {
    return 's';
  }
  return '';
};

export default singularOrPlural;
