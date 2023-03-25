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

export const toNumber = (data?: any) => {
  if (!data) {
    return data;
  }
  if (typeof data === "object") {
    let result = { ...data };
    for (const key in data) {
      if (data[key]._isBigNumber === true) {
        result[key] = data[key].toNumber();
      }
    }
    return result;
  }
};
