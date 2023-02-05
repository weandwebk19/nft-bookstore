const NftBookStore = artifacts.require("NftBookStore");

module.exports = function (deployer) {
  deployer.deploy(NftBookStore);
};
