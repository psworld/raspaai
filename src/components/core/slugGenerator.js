export default title =>
  title
    .replace(/\s+/g, '-')
    // .replace(/\|/g, "and")
    .toLowerCase();

// deprecate this slug generator slowly
