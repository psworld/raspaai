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

export const activeDay = offDays => {
  // a list of off days [0, 6]
  const today = new Date().getDay();

  try {
    JSON.parse(offDays).find(day => day === today);
    return false;
  } catch {
    return true;
  }
};

// check if the store is in active time period
export const activeStoreTime = (startTime, endTime) => {
  const currentDateTime = new Date();
  const startDateTime = new Date(
    `${currentDateTime.getFullYear()}-${currentDateTime.getMonth() +
      1}-${currentDateTime.getDate()}T${startTime}+05:30`
  );
  const endDateTime = new Date(
    `${currentDateTime.getFullYear()}-${currentDateTime.getMonth() +
      1}-${currentDateTime.getDate()}T${endTime}+05:30`
  );

  return startDateTime < currentDateTime && currentDateTime < endDateTime;
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
