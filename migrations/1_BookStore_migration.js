/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const ListedBookStorage = artifacts.require("ListedBookStorage");
const RentedBookStorage = artifacts.require("RentedBookStorage");

module.exports = function (deployer) {
  deployer.deploy(ListedBookStorage).then(function() {
    return deployer.deploy(RentedBookStorage);
  }).then(function() {
    return Promise.all([
      ListedBookStorage.deployed(),
      RentedBookStorage.deployed()
    ]);
  }).then(function([listedBookStorage, rentedBookStorage]) {
    return deployer.deploy(BookStore, listedBookStorage.address, rentedBookStorage.address);
  });
};