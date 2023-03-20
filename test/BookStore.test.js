/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const ListedBookStorage = artifacts.require("ListedBookStorage");
const BookTemporary = artifacts.require("BookTemporary");
const Timelock = artifacts.require("Timelock");

const { ethers } = require("ethers");
const { connect } = require("net");

contract("BookStore", (accounts) => {
  let _contract = null;
  let balance = 100;
  let _listingPrice = ethers.utils.parseEther("0.025").toString();
  let _rentingPrice = ethers.utils.parseEther("0.001").toString();

  before(async () => {
    await ListedBookStorage.deployed();
    await Timelock.deployed();
    await BookTemporary.deployed();
    _contract = await BookStore.deployed(
      ListedBookStorage.address,
      BookTemporary.address
    );
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
      const checkOwnerOfToken = await _contract.isOwnerOfToken(1, accounts[0]);
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

    it("should have not listed", async () => {
      const isListed = await _contract.isListed(1, accounts[0], {
        from: accounts[0]
      });
      assert.equal(isListed, false, "It has been listed.");
    });

    it("should have a created books", async () => {
      const nftBooks = await _contract.getCreatedNFTBooks({
        from: accounts[0]
      });
      assert.equal(nftBooks.length, 1, "It has not created book yet.");
    });
  });

  describe("Set new tokenUri", () => {
    it("should set the new token URI to the existing one", async () => {
      const tokenId = 1;
      const newTokenUri = "https://test.com/newTokenUri";
      const res = await _contract.setTokenUri(tokenId, newTokenUri, {
        from: accounts[0]
      });
      if (res) {
        const actualTokenURI = await _contract.uri(tokenId);
        assert.equal(
          actualTokenURI,
          newTokenUri,
          "tokenURI is not correctly set"
        );
      }
    });
  });

  describe("Sell a book", () => {
    const _nftPrice = ethers.utils.parseEther("0.03").toString();
    const amount = 50;

    before(async () => {
      await _contract.sellBooks(1, _nftPrice, amount, {
        from: accounts[0],
        value: _listingPrice
      });
    });

    it("accounts[0] is the owner of this NFT book", async () => {
      const check = await _contract.isOwnerOfToken(1, accounts[0]);
      assert(check, "accounts[0] does not have this token ID");
    });

    it("should have one listed items on sale", async () => {
      const listedBooks = await _contract.getAllBooksOnSale();
      assert.equal(listedBooks.length, 1, "Invalid length of listed Books");
    });

    it("should have one listed items for seller", async () => {
      const ownedListedBooks = await _contract.getOwnedListedBooks({
        from: accounts[0]
      });
      assert.equal(
        ownedListedBooks.length,
        1,
        "Invalid length of owned listed Books"
      );
    });

    it("should have been listed", async () => {
      const isListed = await _contract.isListed(1, accounts[0], {
        from: accounts[0]
      });
      assert.equal(isListed, true, "It has not been listed.");
    });

    it("should not have created books", async () => {
      const nftBooks = await _contract.getCreatedNFTBooks({
        from: accounts[0]
      });
      assert.equal(nftBooks.length, 0, "It still have not sold yet.");
    });
  });

  describe("Updating books already sold on the market", () => {
    const _nftPrice = ethers.utils.parseEther("0.03").toString();
    const amount = 50;

    before(async () => {
      await _contract.sellBooks(1, _nftPrice, amount, {
        from: accounts[0],
        value: _listingPrice
      });
    });

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

  describe("Get all owned books", () => {
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
  });

  describe("Update listed book", () => {
    const _newNftPrice = ethers.utils.parseEther("0.02").toString();
    before(async () => {
      await _contract.updateBookFromSale(1, _newNftPrice, 80, accounts[0], {
        from: accounts[0]
      });
    });

    it("should have correct amount", async () => {
      const listedBooks = await _contract.getOwnedListedBooks({
        from: accounts[0]
      });
      assert.equal(listedBooks[0].amount, 80, "Invalid length of Nfts");
    });
  });

  describe("Buy books", () => {
    const total = Number(ethers.utils.parseUnits("0.6", "ether")).toString();
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
      const listedBooks = await _contract.getAllBooksOnSale();
      assert.equal(listedBooks[0].amount, 50, "Invalid of amount");
    });

    it("should remove books on sale when buy all books", async () => {
      const total = Number(ethers.utils.parseUnits("1.0", "ether")).toString();
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
        ethers.utils.parseUnits("0.03", "ether")
      ).toString();
      await _contract.sellBooks(1, _nftPrice, 20, {
        from: accounts[0],
        value: _listingPrice
      });
      await _contract.sellBooks(2, _nftPrice, 20, {
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

    it("account[0] is not owner of token URI 1", async () => {
      const total = Number(ethers.utils.parseUnits("0.6", "ether")).toString();
      await _contract.buyBooks(1, accounts[0], 20, {
        from: accounts[1],
        value: total
      });
      const listedBooks = await _contract.getAllBooksOnSale();
      const isOwner = await _contract.isOwnerOfToken(1, accounts[0]);
      assert(!isOwner, "Set owner is wrong");
      assert.equal(listedBooks.length, 1, "Invalid length of ListedBooks");
    });
  });

  describe("Rent books", () => {
    const _nftPrice = ethers.utils.parseEther("0.005").toString();
    const amount = 20;

    before(async () => {
      await _contract.rentBooks(1, _nftPrice, amount, {
        from: accounts[1],
        value: _rentingPrice
      });

      await _contract.rentBooks(2, _nftPrice, amount, {
        from: accounts[0],
        value: _rentingPrice
      });
    });

    it("accounts[1] is the owner of this NFT book", async () => {
      const check = await _contract.isOwnerOfToken(1, accounts[1]);
      assert(check, "accounts[1] does not have this token ID");
    });

    it("accounts[0] is the owner of this NFT book", async () => {
      const check = await _contract.isOwnerOfToken(2, accounts[0]);
      assert(check, "accounts[0] does not have this token ID");
    });

    it("should have two rented items on renting", async () => {
      const rentedBooks = await _contract.getAllBooksOnRenting();
      assert.equal(rentedBooks.length, 2, "Invalid length of rented Books");
      assert.equal(rentedBooks[0].amount, 20, "Invalid length of rented Books");
      assert.equal(rentedBooks[1].amount, 20, "Invalid length of rented Books");
    });

    it("should have 20 rented items and 20 listed items for account[0]", async () => {
      const totalUntradeable = await _contract.getAmountOfAllTypeBooksUntradeable(2, accounts[0]);
      assert.equal(totalUntradeable, 40, "Total Unsellable is invalid");
    });

    it("should have one rented items for renter", async () => {
      const ownedRentedBooks1 = await _contract.getOwnedRentedBooks({
        from: accounts[1]
      });

      const ownedRentedBooks0 = await _contract.getOwnedRentedBooks({
        from: accounts[0]
      });
      assert.equal(
        ownedRentedBooks1.length,
        1,
        "Invalid length of owned rented Books"
      );
      assert.equal(
        ownedRentedBooks0.length,
        1,
        "Invalid length of owned rented Books"
      );
    });

    it("accounts[1] can not sell 100 tokens id 1", async () => {
      const _nftPrice = ethers.utils.parseEther("0.03").toString();
      const amount = 100;
      _listingPrice = ethers.utils.parseEther("0.03").toString();
      try {
        await _contract.sellBooks(1, _nftPrice, amount, {
          from: accounts[1],
          value: _listingPrice
        });
      } catch (error) {
        assert(error, "Set amount listed tokens and rented tokens are wrong");
      }
    });
  });

  describe("Update rented books", () => {
    const _newNftPrice = ethers.utils.parseEther("0.002").toString();
    before(async () => {
      await _contract.updateBookFromRenting(1, _newNftPrice, 5, accounts[1], {
        from: accounts[1]
      });
    });

    it("should have correct amount and newprice amount", async () => {
      const ownedRentedBooks = await _contract.getOwnedRentedBooks({
        from: accounts[1]
      });
      const rentedBooks = await _contract.getAllBooksOnRenting();
      assert.equal(
        ownedRentedBooks[0].amount,
        5,
        "Invalid amount of rented book (token id 2)"
      );
      assert.equal(
        ownedRentedBooks[0].price.toString(),
        2000000000000000,
        "Invalid price of rented book (token id 2)"
      );
      assert.equal(
        rentedBooks[0].amount,
        5,
        "Invalid amount of rented book (token id 2)"
      );
      assert.equal(
        rentedBooks[0].price.toString(),
        2000000000000000,
        "Invalid price of rented book (token id 2)"
      );
    });

    it("should have one rented book on renting", async () => {
      await _contract.updateBookFromRenting(1, _newNftPrice, 0, accounts[1], {
        from: accounts[1]
      });
      const ownedRentedBooks = await _contract.getOwnedRentedBooks({
        from: accounts[1]
      });
      const rentedBooks = await _contract.getAllBooksOnRenting();
      assert.equal(
        ownedRentedBooks.length,
        0,
        "Invalid length of rented book of owner"
      );
      assert.equal(
        rentedBooks.length,
        1,
        "Invalid length of rented book on renting"
      );
      assert.equal(
        rentedBooks[0].renter,
        accounts[0],
        "accounts[0] must be owner of this rented book"
      );
    });

    it("should set new renting price", async () => {
      const newRentingPrice = ethers.utils.parseEther("0.0005").toString();
      await _contract.setRentingPrice(newRentingPrice, { from: accounts[0] });
      const rentingPrice = await _contract.rentingPrice();

      assert.equal(rentingPrice.toString(), newRentingPrice, "Invalid Price");
    });
  });

  describe("Borrow books", () => {
    const value = ethers.utils.parseEther("0.2").toString();
    const price = Number(ethers.utils.parseUnits("0.005", "ether")).toString();
    const amount = 20;
    const rentalDuration = 1209600; // 2 weeks

    before(async () => {
      await _contract.borrowBooks(
        2,
        accounts[0],
        price,
        amount,
        rentalDuration,
        {
          from: accounts[1],
          value: value
        }
      );
    });

    it("accounts[1] is the owner of this NFT book", async () => {
      const check = await _contract.isOwnerOfToken(2, accounts[1]);
      assert(check, "accounts[1] does not have this token ID");
    });

    it("should do not have rented items on renting", async () => {
      const rentedBooks = await _contract.getAllBooksOnRenting();
      assert.equal(rentedBooks.length, 0, "Invalid length of rented Books");
    });

    it("should have one borrowed items for accounts[1]", async () => {
      const ownedBorrowedBooks = await _contract.getOwnedBorrowedBooks({
        from: accounts[1]
      });
      assert.equal(
        ownedBorrowedBooks.length,
        1,
        "Invalid length of owned borrowed Books"
      );
      assert.equal(
        ownedBorrowedBooks[0].amount,
        20,
        "Invalid amount of owned borrowed Books"
      );
    });

    it("accounts[0] can not sell 80 tokens id 2", async () => {
      const _nftPrice = ethers.utils.parseEther("0.03").toString();
      const amount = 80;
      _listingPrice = ethers.utils.parseEther("0.03").toString();
      try {
        await _contract.sellBooks(2, _nftPrice, amount, {
          from: accounts[0],
          value: _listingPrice
        });
      } catch (error) {
        assert(error, "Set amount listed tokens and rented tokens are wrong");
      }

      const amountOwnedBooks = await _contract.getBalanceOfOwnerBook(2, {
        from: accounts[0]
      });
      assert.equal(
        amountOwnedBooks.toString(),
        80,
        "Total Unsellable of account[0] is invalid"
      );

      const amountBooksUntradable1 = await _contract.getAmountOfAllTypeBooksUntradeable(2, accounts[0]);
      assert.equal(amountBooksUntradable1.toString(), 20, "Total Untradeable of account[0] is invalid");

      const amountBooksUntradable2 =
        await _contract.getAmountOfAllTypeBooksUntradeable(2, accounts[1]);
      assert.equal(
        amountBooksUntradable2.toString(),
        20,
        "Total Unsellable of account[1] is invalid"
      );
    });

    it("accounts[1] can not sell tokens id 2", async () => {
      const _nftPrice = ethers.utils.parseEther("0.03").toString();
      const amount = 10;
      _listingPrice = ethers.utils.parseEther("0.03").toString();
      try {
        await _contract.sellBooks(2, _nftPrice, amount, {
          from: accounts[1],
          value: _listingPrice
        });
      } catch (error) {
        assert(error, "Set amount listed tokens and rented tokens are wrong");
      }
    });
  });

  describe("Update borrowed books", () => {
    let _nftPrice = ethers.utils.parseEther("0.005").toString();
    let value = ethers.utils.parseEther("0.2").toString();
    let price = Number(ethers.utils.parseUnits("0.005", "ether")).toString();
    let _rentingPrice = ethers.utils.parseEther("0.0005").toString();
    let beforeStartTime = 0;
    let beforeEndTime = 0;
    let amount = 20;
    let rentalDuration = 1209600; // 2 weeks

    before(async () => {
      const ownedBorrowedBooks = await _contract.getOwnedBorrowedBooks({
        from: accounts[1]
      });
      beforeStartTime = Number(ownedBorrowedBooks[0].startTime);
      beforeEndTime = Number(ownedBorrowedBooks[0].endTime);
      await _contract.rentBooks(2, _nftPrice, amount, {
        from: accounts[0],
        value: _rentingPrice
      });

      await _contract.borrowBooks(
        2,
        accounts[0],
        price,
        amount,
        rentalDuration,
        {
          from: accounts[1],
          value: value
        }
      );
    });

    it("accounts[1] is the owner of this NFT book", async () => {
      const check = await _contract.isOwnerOfToken(2, accounts[1]);
      assert(check, "accounts[1] does not have this token ID");
    });

  });

  describe("Recall Borrowed Books", () => {
    
    it("accounts[0] can not recall borrowed book from accounts[1]", async () => {
      try {
        await _contract.recallBorrowedBooks(2, accounts[0], accounts[1], {
          from: accounts[0]
        });
    
      } catch (err) {
        assert(err, "Recall borrowed books exe wrong logic");
      }

    });

  });

});
