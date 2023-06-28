const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");
module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      // host: "192.168.71.2",
      port: 7545,
      network_id: "*"
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(keys.PRIVATE_KEY, keys.INFURA_SEPOLIA_URL),
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 20000000000,
      confirmations: 2,
      networkCheckTimeout: 20000,
      timeoutBlocks: 500
    }
  },

  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 50
        }
      },
      disableSmtChecker: true
    }
  }
};
