const BookStore = artifacts.require("BookStore");

module.exports = function (deployer) {
  deployer.deploy(BookStore);
};
