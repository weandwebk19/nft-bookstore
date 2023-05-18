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

export const convertHexStringToUint32Array = function(hexString: string) {
  const byteLength = hexString.length / 2;
  const byteArray = Buffer.from(hexString, 'hex');
  const uint32Array = new Uint32Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    uint32Array[i] = (byteArray[i * 4] << 24) +
                      (byteArray[i * 4 + 1] << 16) +
                      (byteArray[i * 4 + 2] << 8) +
                      byteArray[i * 4 + 3];
  }
  return uint32Array;
}
