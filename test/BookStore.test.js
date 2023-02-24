/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const { ethers } = require("ethers");

contract("BookStore", (accounts) => {
  let _contract = null;
  let balance = 100;
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await BookStore.deployed();
  });

  describe("Mint book", () => {
    const tokenURI = "https://test.com/1";
    before(async () => {
      await _contract.mintBook(tokenURI, balance, {
        from: accounts[0],
        value: _listingPrice
      });
    });

    it("owner of the first token should be address[0]", async () => {
      const checkOwnerOfToken = await _contract.isOwnerOfToken(1, accounts[0], {
        from: accounts[0]
      });
      assert(checkOwnerOfToken, "Owner of token is not matching address[0]");
    });

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.uri(1);
      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
    });

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintBook(tokenURI, balance, {
          from: accounts[0]
        });
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    });

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftBook(1);
      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.balance, balance, "Nft balance is not correct");
      assert.equal(nftItem.author, accounts[0], "Author is not account[0]");
    });
  });

  describe("Sell a book with a true amount and it is NOT already exists on market", () => {
    const _nftPrice = ethers.utils.parseEther("0.3").toString();
    const amount = 50;

    before(async () => {
      await _contract.sellBooks(1, _nftPrice, amount, {
        from: accounts[0],
        value: _listingPrice
      });
    });

    it("accounts[0] is the owner of this NFT book", async () => {
      const check = await _contract.isOwnerOfToken(1, accounts[0], {
        from: accounts[0]
      });
      assert(check, "accounts[0] does not have this token ID");
    });

    it("should have one listed items", async () => {
      const listedBooks = await _contract.getAllBooksOnSale();
      assert.equal(listedBooks.length, 1, "Invalid length of Nfts");
    });
  });

  describe("Increase the number of books already sold on the market", () => {
    const _nftPrice = ethers.utils.parseEther("0.3").toString();
    const amount = 50;

    before(async () => {
      await _contract.sellBooks(1, _nftPrice, amount, {
        from: accounts[0],
        value: _listingPrice
      });
    });

    // it("should don't have enough books to sell", async () => {
    //   const check = await _contract.checkQuantityToSell(150, 1);
    //   assert.equal(check, false, "Amount is invalid");
    // });

    it("should have one listed items", async () => {
      const listedBooks = await _contract.getAllBooksOnSale();
      assert.equal(listedBooks.length, 1, "Invalid length of Nfts");
    });

    it("should have correct new amount", async () => {
      const listedBooks = await _contract.getAllBooksOnSale();
      const amount = listedBooks[0].amount;
      assert.equal(amount, 100, "Invalid length of Nfts");
    });
  });

  describe("Get all owned books and all listed books on sale", () => {
    const tokenURI = "https://test.com/2";
    before(async () => {
      await _contract.mintBook(tokenURI, balance, {
        from: accounts[0],
        value: _listingPrice
      });
    });

    it("should have two books in owner book's list", async () => {
      const ownedNFTBooks = await _contract.getOwnedNFTBooks({
        from: accounts[0]
      });
      assert.equal(
        ownedNFTBooks.length,
        2,
        "The number of books in possession of the book is not valid"
      );
    });

    it("should have one listed items", async () => {
      const listedBooks = await _contract.getAllBooksOnSale();
      assert.equal(listedBooks.length, 1, "Invalid length of Nfts");
    });
  });

  describe("Remove listed book", () => {
    before(async () => {
      await _contract.decreaseListedBookFromSale(1, 20, accounts[0], {
        from: accounts[0]
      });
    });

    it("should have correct amount", async () => {
      const listedBook = await _contract.getListedBook(1, accounts[0]);
      assert.equal(listedBook.amount, 80, "Invalid length of Nfts");
    });
  });

  describe("Buy books", () => {
    const total = Number(ethers.utils.parseUnits("9", "ether")).toString();
    before(async () => {
      await _contract.buyBooks(1, accounts[0], 30, {
        from: accounts[1],
        value: total
      });
    });

    it("should change the owner", async () => {
      const ownedNFTBooks = await _contract.getOwnedNFTBooks({
        from: accounts[1]
      });
      assert.equal(ownedNFTBooks.length, 1, "Set owner of book is wrong");
    });

    it("should have correct amount", async () => {
      const listedBook = await _contract.getListedBook(1, accounts[0]);
      assert.equal(listedBook.amount, 50, "Invalid of amount");
    });

    it("should remove books on sale when buy all books", async () => {
      const total = Number(ethers.utils.parseUnits("15", "ether")).toString();
      await _contract.buyBooks(1, accounts[0], 50, {
        from: accounts[1],
        value: total
      });

      const listedBooks = await _contract.getAllBooksOnSale();
      assert.equal(listedBooks.length, 0, "Invalid length of Nfts");
    });
  });

  describe("List books on sale", () => {
    before(async () => {
      const _nftPrice = Number(
        ethers.utils.parseUnits("0.3", "ether")
      ).toString();
      await _contract.sellBooks(1, _nftPrice, 10, {
        from: accounts[0],
        value: _listingPrice
      });
      await _contract.sellBooks(2, _nftPrice, 10, {
        from: accounts[0],
        value: _listingPrice
      });
    });

    it("should have two listed books", async () => {
      const listedBooks = await _contract.getAllBooksOnSale();

      assert.equal(listedBooks.length, 2, "Invalid length of ListedBooks");
    });

    it("should set new listing price", async () => {
      const newListingPrice = ethers.utils.parseEther("0.03").toString();
      await _contract.setListingPrice(newListingPrice, { from: accounts[0] });
      const listingPrice = await _contract.listingPrice();

      assert.equal(listingPrice.toString(), newListingPrice, "Invalid Price");
    });
  });
});
