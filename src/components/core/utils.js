import React, { useEffect } from 'react';
import SimpleCrypto from 'simple-crypto-js';

const _SECRET_KEY = `${process.env.GATSBY_SECRET_KEY}`;
var simpleCrypto = new SimpleCrypto(_SECRET_KEY);

export function encryptText(text) {
  let encText = simpleCrypto.encrypt(text);
  return encText;
}

export function decryptText(encText) {
  let text = simpleCrypto.decrypt(encText);
  return text;
}

/**
 * Set the initial values of formik props in parent component
 * @param {Object} formikProps The initial values provide by formik props
 * @param {Function} setFormikProps Set state method for setting initialValues
 */
export const SetFormikProps = ({ formikProps, setFormikProps }) => {
  useEffect(() => {
    setFormikProps(formikProps);
  }, []);
  return <></>;
};

/**
 * Find the detailed differences between two images list
 * @param  {Array} originalImages The original image list
 * @param  {Array} updatedImages The updated images
 * @return {Object} The images that have been changed, deleted or added in the updatedImages
 */
export function detailedImagesDiff(originalImages, updatedImages) {
  // By changed we mean position change of image
  const detailedDiff = { added: [], changed: [], deleted: [] };

  // check for new and position changed images
  for (let i = 0; i < updatedImages.length; i++) {
    const img = updatedImages[i];
    const imgId = img.node.id;
    const originalImage = originalImages.find(e => e.node.id === imgId);

    if (!originalImage) {
      // New added image
      detailedDiff.added.push(img);
    } else {
      // Check for changed position
      if (originalImage.node.position !== img.node.position) {
        // position changed
        detailedDiff.changed.push(img);
      }
    }
  }
  // check for deleted images
  for (let i = 0; i < originalImages.length; i++) {
    const originalImage = originalImages[i];
    const originalImageId = originalImage.node.id;

    const newImg = updatedImages.find(e => e.node.id === originalImageId);
    if (!newImg) {
      // image is deleted
      detailedDiff.deleted.push(originalImage);
    }
  }

  return detailedDiff;
}

/**
 * Find the differences between two objects and push to a new object
 * @param  {Object} originalObject The original object
 * @param  {Object} updatedObject The updated object which bases original object
 * @return {Object} The values that have been changed in the updated object
 */
export function updatedDiff(originalObject, updatedObject) {
  // Make sure an object to compare is provided
  if (
    !updatedObject ||
    Object.prototype.toString.call(updatedObject) !== '[object Object]'
  ) {
    return originalObject;
  }

  // Variables
  var diffs = {};
  var key;

  // Methods
  /**
   * Check if two arrays are equal
   * @param  {Array}   arr1 The first array
   * @param  {Array}   arr2 The second array
   * @return {Boolean}      If true, both arrays are equal
   */
  var arraysMatch = function(arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
  };

  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  var compare = function(item1, item2, key) {
    // Get the object type
    var type1 = Object.prototype.toString.call(item1);
    var type2 = Object.prototype.toString.call(item2);

    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[key] = null;
      return;
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      var objDiff = updatedDiff(item1, item2);
      if (Object.keys(objDiff).length > 1) {
        diffs[key] = objDiff;
      }
      return;
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2;
      }
    }
  };

  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in originalObject) {
    if (originalObject.hasOwnProperty(key)) {
      compare(originalObject[key], updatedObject[key], key);
    }
  }

  // Loop through the second object and find missing items
  for (key in updatedObject) {
    if (updatedObject.hasOwnProperty(key)) {
      if (!originalObject[key] && originalObject[key] !== updatedObject[key]) {
        diffs[key] = updatedObject[key];
      }
    }
  }

  // Return the object of differences
  return diffs;
}

export function getXQuantity(quantity) {
  if (quantity !== 1) {
    return `${quantity}x`;
  }
}

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
