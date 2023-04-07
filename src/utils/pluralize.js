const pluralize = (count, noun, suffix = "s") =>
  `${count} ${noun}${count !== 1 && count !== 0 ? suffix : ""}`;

export default pluralize;
