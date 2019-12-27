export const slugGenerator = title => {
  return (
    title
      .replace(/\s+/g, '-')
      // .replace(/\|/g, "and")
      .toLowerCase()
  );
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

const singularOrPlural = noOfItems => {
  if (noOfItems === 1) {
    return '';
  } else if (noOfItems > 1) {
    return 's';
  }
  return '';
};

export default singularOrPlural;
