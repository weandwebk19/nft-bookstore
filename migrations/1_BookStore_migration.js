/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const BookSellingStorage = artifacts.require("BookSellingStorage");
const BookTemporary = artifacts.require("BookTemporary");
const Timelock = artifacts.require("Timelock");
const ExtendTime = artifacts.require("ExtendTime");
const Error = artifacts.require("Error");
const BookSharingStorage = artifacts.require("BookSharingStorage");
const BookRentingStorage = artifacts.require("BookRentingStorage");
const ListRealOwners = artifacts.require("ListRealOwners");
const SecretKeyStorage = artifacts.require("SecretKeyStorage");
module.exports = function (deployer) {
  deployer
    .deploy(BookSellingStorage)
    .then(function () {
      return deployer.deploy(ExtendTime);
    })
    .then(function () {
      return deployer.deploy(Error);
    })
    .then(function () {
      return deployer.deploy(Timelock);
    })
    .then(async function (timelock) {
      await deployer.deploy(BookSharingStorage, timelock.address);
      return deployer.deploy(BookRentingStorage, timelock.address);
    })
    .then(function () {
      return Promise.all([
        BookRentingStorage.deployed(),
        BookSharingStorage.deployed()
      ]);
    })
    .then(function ([bookRentingStorage, bookSharingStorage]) {
      return deployer.deploy(
        BookTemporary,
        bookRentingStorage.address,
        bookSharingStorage.address
      );
    })
    .then(function () {
      return Promise.all([
        BookSellingStorage.deployed(),
        BookTemporary.deployed()
      ]);
    })
    .then(async function ([bookSellingStorage, bookTemporary]) {
      await deployer.deploy(ListRealOwners);
      await deployer.deploy(SecretKeyStorage);
      return deployer.deploy(
        BookStore,
        bookSellingStorage.address,
        bookTemporary.address,
        ListRealOwners.address,
        SecretKeyStorage.address
      );
    });
};
