const pluralize = (count, noun, locale = "en", suffix = "s") =>
  `${count} ${noun}${
    locale === "vi" ? "" : count !== 1 && count !== 0 ? suffix : ""
  }`;

export default pluralize;
