export const slugGenerator = title => {
  return (
    title
      .replace(/\s+/g, '-')
      // .replace(/\|/g, "and")
      .toLowerCase()
  );
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
