/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const ListedBookStorage = artifacts.require("ListedBookStorage");
const BookTemporary = artifacts.require("BookTemporary");
const Timelock = artifacts.require("Timelock");
const ExtendTime = artifacts.require("ExtendTime");
const Error = artifacts.require("Error");
const BookSharingStorage = artifacts.require("BookSharingStorage");
const BookRentingStorage = artifacts.require("BookRentingStorage");

module.exports = function (deployer) {
  deployer.deploy(ListedBookStorage)
  .then(function() {

    return deployer.deploy(ExtendTime);

  }).then(function() {

    return deployer.deploy(Error);

  }).then(function() {

    return deployer.deploy(BookSharingStorage);

  }).then(function() {

    return deployer.deploy(Timelock);

  }).then(function(timelock) {

    return deployer.deploy(BookRentingStorage, timelock.address);

  }).then(function() {

    return Promise.all([
      BookRentingStorage.deployed(),
      BookSharingStorage.deployed()
    ]);

  }).then(function([bookRentingStorage, bookSharingStorage]) {

    return deployer.deploy(BookTemporary, 
                           bookRentingStorage.address, 
                           bookSharingStorage.address);

  }).then(function() {

    return Promise.all([
      ListedBookStorage.deployed(),
      BookTemporary.deployed()
    ]);

  }).then(function([listedBookStorage, bookTemporary]) {

    return deployer.deploy(BookStore, listedBookStorage.address, bookTemporary.address);
  });
};

