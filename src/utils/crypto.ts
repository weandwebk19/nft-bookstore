export const Crypto = {
  lengthOfGenerator: 16,

  sha256: async function (message: string) {
    try {
      // encode as UTF-8
      const msgBuffer = new TextEncoder().encode(message);

      // hash the message
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

      // convert ArrayBuffer to Array
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      // convert bytes to hex string
      return this.convertArrayToHexString(hashArray);
    } catch (error: any) {
      console.error("Error hash(sha256): ", error.message);
    }
  },

  convertArrayToHexString: function (array: Number[]): string {
    return array
      .map((value) => {
        const str = value.toString(16) as string;
        return str.padStart(2, "0");
      })
      .join("");
  },

  encryption: async function (
    message: Uint8Array,
    key: CryptoKey,
    iv: Uint8Array
  ) {
    try {
      const cipherArrayBuffer = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv: iv },
        key,
        message
      );
      return new Uint8Array(cipherArrayBuffer);
    } catch (error: any) {
      console.error("Error encryption: ", error.message);
    }
  },

  decryption: async function (
    message: Uint8Array,
    key: CryptoKey,
    iv: Uint8Array
  ) {
    try {
      const plainArrayBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        key,
        message
      );
      return new Uint8Array(plainArrayBuffer);
    } catch (error: any) {
      console.error("Error decryption: ", error.message);
    }
  },

  generateIVValue: function () {
    try {
      return crypto.getRandomValues(new Uint8Array(this.lengthOfGenerator));
    } catch (error: any) {
      console.error("Error generate IV value: ", error.message);
    }
  },

  generateKey: async function (key: string) {
    try {
      const keyHash = await this.sha256(key);
      const keyHashBuffer = new TextEncoder().encode(keyHash);
      const keyData = await new Uint8Array(keyHashBuffer);
      const rs = await crypto.subtle.importKey(
        "raw",
        keyData.slice(0, 32),
        { name: "AES-CBC" },
        true,
        ["decrypt", "encrypt"]
      );
      return rs;
    } catch (error: any) {
      console.error("Error generate Key: ", error.message);
    }
  }
};
