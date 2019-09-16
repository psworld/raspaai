export default title =>
  title
    .replace(/\s+/g, "-")
    // .replace(/\|/g, "and")
    .toLowerCase()
