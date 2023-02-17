const BookStore = artifacts.require("BookStore");
const { ethers } = require("ethers");

contract("BookStore", (accounts) => {
  let _contract = null;
  let _bookVersionPrice = ethers.utils.parseEther("0.3").toString();
  let _bookVersionQuantity = 100;
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await BookStore.deployed();
  });

  describe("Publish", () => {
    before(async () => {
      await _contract.createBook(_bookVersionPrice, _bookVersionQuantity, {
        from: accounts[0],
        value: _listingPrice
      });
    });
    it("test base uri", async () => {
      const baseURI = await _contract.uri(1);
      console.log(baseURI);
      assert.equal(
        baseURI,
        "https://example.com/api/{id}.json",
        "Uri is not correct"
      );
    });
  });
});
