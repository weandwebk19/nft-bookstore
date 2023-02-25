/* eslint-disable prettier/prettier */

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",     
     port: 7545,            
     network_id: "*" 
    },
  },

  compilers: {
    solc: {
      version: "0.8.17",
      // Setting để tối ưu hóa khi compile contract
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      },
      disableSmtChecker: true, // Tắt chuỗi revert
    }
  }
};
