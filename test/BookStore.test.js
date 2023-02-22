/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const { ethers } = require("ethers");

contract("BookStore", (accounts) => {
  let _contract = null;
  // let _bookVersionPrice = ethers.utils.parseEther("0.3").toString();
  let balance = 100;
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await BookStore.deployed();
  })

  describe("Mint book", () => {
    const tokenURI = "https://test.com/1";
    before(async () => {
      await _contract.mintBook(tokenURI, balance,  {
        from: accounts[0],
        value: _listingPrice
      })
    });

    it("owner of the first token should be address[0]", async () => {
      const checkOwnerOfToken = await _contract.isOwnerOfToken(1, {from: accounts[0]});
      assert(checkOwnerOfToken, "Owner of token is not matching address[0]");
    })

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.uri(1);
      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
    })

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintBook(tokenURI, balance, {
          from: accounts[0]
        })
      } catch(error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    })

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftBook(1);
      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.balance, balance, "Nft balance is not correct");
      assert.equal(nftItem.author, accounts[0], "Author is not account[0]");
    })
  })

  describe("Sell a book with a true amount and it is NOT already exists on market", () => {

    const _nftPrice = ethers.utils.parseEther("0.3").toString();
    const amount = 50;

    before(async () => {
      await _contract.sellBooks(
         1,
        _nftPrice,
        amount,
        { from: accounts[0], value: _listingPrice}
      )
    })

    it("accounts[0] is the owner of this NFT book", async () => {
      const check = await _contract.isOwnerOfToken(1, { from: accounts[0]});
      assert(check, "accounts[0] does not have this token ID");
    })

    it("should have one listed items", async () => {
      const listedNfts = await _contract.getAllBooksOnSale();
      assert.equal(listedNfts.length, 1, "Invalid length of Nfts");
    })

  })

  describe("Increase the number of books already sold on the market", () => {

    const _nftPrice = ethers.utils.parseEther("0.3").toString();
    const amount = 50;

    before(async () => {
      await _contract.sellBooks(
         1,
        _nftPrice,
        amount,
        { from: accounts[0], value: _listingPrice}
      )
    })

    it("should don't have enough books to sell", async () => {
      const check = await _contract.checkQuantityToSell(150, 1);
      assert.equal(check, false, "Amount is invalid");
    })

    it("should have one listed items", async () => {
      const listedNfts = await _contract.getAllBooksOnSale();
      assert.equal(listedNfts.length, 1, "Invalid length of Nfts");
    })

    it("should have correct new amount", async () => {
      const listedNfts = await _contract.getAllBooksOnSale();
      const amount = listedNfts[0].amount;
      assert.equal(amount, 100, "Invalid length of Nfts");
    })

  })

  describe("Get all owned books and all listed books on sale", () => {

    const tokenURI = "https://test.com/2";
    before(async () => {
      await _contract.mintBook(tokenURI, balance,  {
        from: accounts[0],
        value: _listingPrice
      })
    });

    it("should have two books in owner book's list", async () => {
      const ownedNFTBooks = await _contract.getOwnedNFTBooks({from: accounts[0]});
      assert.equal(ownedNFTBooks.length, 2, "The number of books in possession of the book is not valid");
    })

    it("should have one listed items", async () => {
      const listedNfts = await _contract.getAllBooksOnSale();
      assert.equal(listedNfts.length, 1, "Invalid length of Nfts");
    })

  })

  describe("Remove listed book", () => {

    const _nftPrice = Number(ethers.utils.parseUnits("0.3", "ether")).toString();
    before(async () => {
      await _contract.removeListedBookFromSale(1, _nftPrice,  20,  {
        from: accounts[0]
      })
    });

    it("should don't have listed items", async () => {
      const listedBook =  await _contract.getListedBook(0);
      assert.equal(listedBook.amount, 80, "Invalid length of Nfts");
    })

  })

});
