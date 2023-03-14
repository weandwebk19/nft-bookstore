import CamelcaseKeys from "camelcase-keys";
import SnakecaseKeys from "snakecase-keys";

export const toCamel = (data: any) => {
  return CamelcaseKeys(data, { exclude: [/-/], deep: true });
};

export const toSnake = (data: any) => {
  if (typeof data === "string") {
    return Object.keys(SnakecaseKeys({ [data]: null }))[0];
  }
  return SnakecaseKeys(data, { deep: true });
};
