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

export function convertTimestampToString(timestamp: number): string {

  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year}  ${hours}:${minutes}`;
}
