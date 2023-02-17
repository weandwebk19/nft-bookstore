const BookStoreV1 = artifacts.require("BookStoreV1");

module.exports = function (deployer) {
  deployer.deploy(BookStoreV1);
};
