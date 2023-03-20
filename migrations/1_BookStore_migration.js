/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const ListedBookStorage = artifacts.require("ListedBookStorage");
const BookTemporary = artifacts.require("BookTemporary");
const Timelock = artifacts.require("Timelock");

module.exports = function (deployer) {
  deployer.deploy(ListedBookStorage).then(function() {
    return deployer.deploy(Timelock);
  }).then(function() {
    return deployer.deploy(BookTemporary);
  }).then(function() {
    return Promise.all([
      ListedBookStorage.deployed(),
      BookTemporary.deployed()
    ]);
  }).then(function([listedBookStorage, bookTemporary]) {
    return deployer.deploy(BookStore, listedBookStorage.address, bookTemporary.address);
  });
};

// /* eslint-disable prettier/prettier */
// const BookStore = artifacts.require("BookStore");
// const ListedBookStorage = artifacts.require("ListedBookStorage");
// const BookTemporary = artifacts.require("BookTemporary");
// const Timelock = artifacts.require("Timelock");

// module.exports = function (deployer) {
//   deployer.deploy(ListedBookStorage).then(function() {
//     return deployer.deploy(Timelock);
//   }).then(function([timelock]) {
//     return deployer.deploy(BookTemporary(timelock.address));
//   }).then(function() {
//     return Promise.all([
//       ListedBookStorage.deployed(),
//       BookTemporary.deployed()
//     ]);
//   }).then(function([listedBookStorage, bookTemporary]) {
//     return deployer.deploy(BookStore, listedBookStorage.address, bookTemporary.address);
//   });
// };