/* eslint-disable prettier/prettier */
export const convertArrayToHexString = function(array: Number[]): string {
  return array
    .map((value) => {
      const str = value.toString(16) as string;
      return str.padStart(2, "0");
    })
    .join("");
}

export const convertHexStringToUint8Array = function(hexString : string): Uint8Array {
  if (hexString) {
    const array = hexString!.match(/.{1,2}/g)!.map((hex) => parseInt(hex, 16));
    const uint8Array = new Uint8Array(array);
    return uint8Array;
  }
  return new Uint8Array;
}