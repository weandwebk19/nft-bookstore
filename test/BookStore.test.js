/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const BookSellingStorage = artifacts.require("BookSellingStorage");
const BookTemporary = artifacts.require("BookTemporary");
const Timelock = artifacts.require("Timelock");
const Error = artifacts.require("Error");
const ExtendTime = artifacts.require("ExtendTime");
const BookRentingStorage = artifacts.require("BookRentingStorage");
const BookSharingStorage = artifacts.require("BookSharingStorage");
const ListRealOwners = artifacts.require("ListRealOwners");
const SecretKeyStorage = artifacts.require("SecretKeyStorage");

const { ethers } = require("ethers");
contract("BookStore", (accounts) => {
  let _contract = null;
  let _bookSellingStorage = null;
  let balance = 100;
  let _listingPrice = ethers.utils.parseEther("0.025").toString();
  let _lendingPrice = ethers.utils.parseEther("0.001").toString();
  let _sharingPrice = ethers.utils.parseEther("0.0005").toString();
  let _convertPrice = ethers.utils.parseEther("0.000005").toString();

  before(async () => {
    _bookSellingStorage = await BookSellingStorage.deployed();
    await Error.deployed();
    await Timelock.deployed();
    await ExtendTime.deployed();
    _bookSharingStorage = await BookSharingStorage.deployed(Timelock.address);
    _bookRentingStorage = await BookRentingStorage.deployed(Timelock.address);
    await ListRealOwners.deployed();
    await SecretKeyStorage.deployed();
    _bookTemporary = await BookTemporary.deployed(
      BookRentingStorage.address,
      BookSharingStorage.address
    );
    _contract = await BookStore.deployed(
      BookSellingStorage.address,
      BookTemporary.address,
      ListRealOwners.address,
      SecretKeyStorage.address
    );
  });

  describe("Mint book", () => {
    const tokenURI = "https://test.com/1";
    const privateKey = "privatekeyForTesting";
    const iv = "ivForTesting";
    before(async () => {
      await _contract.mintBook(tokenURI, balance, privateKey, iv, {
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

    it("should have one secret key for account[0]", async () => {
      const secretKey = await _contract.getSecretKey.call(1);
      assert.equal(secretKey.length, 2, "Length of secret key is incorrect");
      assert.equal(secretKey[0], iv, "Initial vector is incorrect");
      assert.equal(secretKey[1], privateKey, "Private key is incorrect");
    });

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintBook(tokenURI, balance, privateKey, iv, {
          from: accounts[0]
        });
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    });

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftBook(1);
      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.quantity, balance, "Nft balance is not correct");
      assert.equal(nftItem.author, accounts[0], "Author is not account[0]");
    });

    it("should have not listed", async () => {
      const isListing = await _bookSellingStorage.isListing(1, accounts[0]);
      assert.equal(isListing, false, "It has been listed.");
    });

    it("amount of used book should equal the first balance.", async () => {
      const amount = await _contract.getAmountUnUsedBook(1, {
        from: accounts[0]
      });
      assert.equal(amount, balance, "It has not equal the first balance.");
    });

    it("account[0] is real owner of token id 1", async () => {
      const realOwners = await _contract.getAllRealOwnerOfTokenId(1);
      assert.equal(realOwners.length, 1, "Set real owner is wrong");
      assert.equal(realOwners[0], accounts[0], "Set real owner is wrong");
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
      const listedBooks = await _bookSellingStorage.getAllListedBooks();
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
      const isListing = await _bookSellingStorage.isListing(1, accounts[0], {
        from: accounts[0]
      });
      assert.equal(isListing, true, "It has not been listed.");
    });

    it("amount of used book should be decreased.", async () => {
      const amountUnUsed = await _contract.getAmountUnUsedBook(1, {
        from: accounts[0]
      });
      assert.equal(amountUnUsed, balance - amount, "It has not decreased.");
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
      const listedBooks = await _bookSellingStorage.getAllListedBooks();
      assert.equal(listedBooks.length, 1, "Invalid length of Nfts");
    });

    it("should have correct new amount", async () => {
      const listedBooks = await _bookSellingStorage.getAllListedBooks();
      const amount = listedBooks[0].amount;
      assert.equal(amount, 100, "Invalid length of Nfts");
    });
  });

  describe("Get all owned books", () => {
    const tokenURI = "https://test.com/2";
    const privateKey = "privatekeyForTesting";
    const iv = "ivForTesting";
    before(async () => {
      await _contract.mintBook(tokenURI, balance, privateKey, iv, {
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
      const listedBooks = await _bookSellingStorage.getAllListedBooks();
      assert.equal(listedBooks[0].amount, 50, "Invalid of amount");
    });

    it("should have one purchased items for buyer", async () => {
      const ownedPurchasedBooks = await _bookSellingStorage.getOwnedPurchasedBooks({
        from: accounts[1]
      });
      assert.equal(
        ownedPurchasedBooks.length,
        1,
        "Invalid length of owned purchased Books"
      );
    });

    it("should remove books on sale when buy all books", async () => {
      const total = Number(ethers.utils.parseUnits("1.0", "ether")).toString();
      await _contract.buyBooks(1, accounts[0], 50, {
        from: accounts[1],
        value: total
      });

      const listedBooks = await _bookSellingStorage.getAllListedBooks();
      assert.equal(listedBooks.length, 0, "Invalid length of Nfts");
    });

    it("account[1] is real owner of token id 1", async () => {
      const realOwners = await _contract.getAllRealOwnerOfTokenId(1);
      assert.equal(realOwners.length, 2, "Set real owner is wrong");
      assert.equal(realOwners[0], accounts[0], "Set real owner is wrong");
      assert.equal(realOwners[1], accounts[1], "Set real owner is wrong");
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
      const listedBooks = await _bookSellingStorage.getAllListedBooks();

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
      const listedBooks = await _bookSellingStorage.getAllListedBooks();
      const isOwner = await _contract.isOwnerOfToken(1, accounts[0]);
      assert(!isOwner, "Set owner is wrong");
      assert.equal(listedBooks.length, 1, "Invalid length of ListedBooks");
    });

    it("account[0] is not real owner of token id 1", async () => {
      const realOwners = await _contract.getAllRealOwnerOfTokenId(1);
      assert.equal(realOwners.length, 1, "Set real owner is wrong");
      assert.equal(realOwners[0], accounts[1], "Set real owner is wrong");
    });
  });

  describe("Lend books", () => {
    const _nftPrice = ethers.utils.parseEther("0.005").toString();
    const amount = 20;

    before(async () => {
      await _contract.lendBooks(1, _nftPrice, amount, {
        from: accounts[1],
        value: _lendingPrice
      });

      await _contract.lendBooks(2, _nftPrice, amount, {
        from: accounts[0],
        value: _lendingPrice
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

    it("should have two lend items on lending", async () => {
      const lendBooks = await _bookRentingStorage.getAllLendBooks();
      assert.equal(lendBooks.length, 2, "Invalid length of lend Books");
      assert.equal(lendBooks[0].amount, 20, "Invalid length of lend Books");
      assert.equal(lendBooks[1].amount, 20, "Invalid length of lend Books");
    });

    it("should have 20 lend items and 20 listed items for account[0]", async () => {
      const totalUntradeable =
        await _contract.getAmountOfAllTypeBooksUntradeable(2, {
          from: accounts[0]
        });
      assert.equal(totalUntradeable, 40, "Total Unsellable is invalid");
    });

    it("amount of used book should be decreased.", async () => {
      const totalUntradeable =
        await _contract.getAmountOfAllTypeBooksUntradeable(2, {
          from: accounts[0]
        });

      const amountUnUsed = await _contract.getAmountUnUsedBook(2, {
        from: accounts[0]
      });
      assert.equal(
        amountUnUsed,
        balance - totalUntradeable,
        "It has not decreased."
      );
    });

    it("should have one lend items for renter", async () => {
      const ownedLendBooks1 = await _contract.getOwnedLendingBooks({
        from: accounts[1]
      });

      const ownedLendBooks0 = await _contract.getOwnedLendingBooks({
        from: accounts[0]
      });
      assert.equal(
        ownedLendBooks1.length,
        1,
        "Invalid length of owned lend Books"
      );
      assert.equal(
        ownedLendBooks0.length,
        1,
        "Invalid length of owned lend Books"
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
        assert(error, "Set amount listed tokens and lend tokens are wrong");
      }
    });
  });

  describe("Update lend books", () => {
    const _newNftPrice = ethers.utils.parseEther("0.002").toString();
    before(async () => {
      await _contract.updateBookFromRenting(1, _newNftPrice, 5, accounts[1], {
        from: accounts[1]
      });
    });

    it("should have correct amount and newprice amount", async () => {
      const ownedLendBooks = await _contract.getOwnedLendingBooks({
        from: accounts[1]
      });
      const lendBooks = await _bookRentingStorage.getAllLendBooks();
      assert.equal(
        ownedLendBooks[0].amount,
        5,
        "Invalid amount of lend book (token id 2)"
      );
      assert.equal(
        ownedLendBooks[0].price.toString(),
        2000000000000000,
        "Invalid price of lend book (token id 2)"
      );
      assert.equal(
        lendBooks[0].amount,
        5,
        "Invalid amount of lend book (token id 2)"
      );
      assert.equal(
        lendBooks[0].price.toString(),
        2000000000000000,
        "Invalid price of lend book (token id 2)"
      );
    });

    it("should have one lend book on lending", async () => {
      await _contract.updateBookFromRenting(1, _newNftPrice, 0, accounts[1], {
        from: accounts[1]
      });
      const ownedLendBooks = await _contract.getOwnedLendingBooks({
        from: accounts[1]
      });
      const lendBooks = await _bookRentingStorage.getAllLendBooks();
      assert.equal(
        ownedLendBooks.length,
        0,
        "Invalid length of lend book of owner"
      );
      assert.equal(
        lendBooks.length,
        1,
        "Invalid length of lend book on lending"
      );
      assert.equal(
        lendBooks[0].renter,
        accounts[0],
        "accounts[0] must be owner of this lend book"
      );
    });

    it("should set new lending price", async () => {
      const newLendingPrice = ethers.utils.parseEther("0.0005").toString();
      await _contract.setLendingPrice(newLendingPrice, { from: accounts[0] });
      const lendingPrice = await _contract.lendingPrice();

      assert.equal(lendingPrice.toString(), newLendingPrice, "Invalid Price");
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

    it("should do not have lend items on lending", async () => {
      const lendBooks = await _bookRentingStorage.getAllLendBooks();
      assert.equal(lendBooks.length, 0, "Invalid length of lend Books");
    });

    it("should have one borrowed items for accounts[1]", async () => {
      const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
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

    it("should have one borrowed items on borrowing", async () => {
      const allBorrowedBooks = await _bookRentingStorage.getAllBorrowedBooks();
      assert.equal(
        allBorrowedBooks.length,
        1,
        "Invalid length of all borrowed Books"
      );
      assert.equal(
        allBorrowedBooks[0].amount,
        20,
        "Invalid amount of first borrowed Books "
      );

      assert.equal(
        allBorrowedBooks[0].renter,
        accounts[0],
        "Renter is invalid"
      );

      assert.equal(
        allBorrowedBooks[0].borrower,
        accounts[1],
        "Borrower is invalid"
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
        assert(error, "Set amount listed tokens and lend tokens are wrong");
      }

      const amountOwnedBooks = await _contract.getBalanceOfOwnerBook(2, {
        from: accounts[0]
      });
      assert.equal(
        amountOwnedBooks.toString(),
        80,
        "Total Unsellable of account[0] is invalid"
      );

      const amountBooksUntradable1 =
        await _contract.getAmountOfAllTypeBooksUntradeable(2, {
          from: accounts[0]
        });
      assert.equal(
        amountBooksUntradable1.toString(),
        20,
        "Total Untradeable of account[0] is invalid"
      );

      const amountBooksUntradable2 =
        await _contract.getAmountOfAllTypeBooksUntradeable(2, {
          from: accounts[1]
        });

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
        assert(error, "Set amount listed tokens and lend tokens are wrong");
      }
    });

    it("account[1] is not real owner of token id 2", async () => {
      const realOwners = await _contract.getAllRealOwnerOfTokenId(2);
      assert.equal(realOwners.length, 1, "Set real owner is wrong");
      assert.equal(realOwners[0], accounts[0], "Set real owner is wrong");
    });
  });

  describe("Recall Borrowed Books", () => {
    it("accounts[0] can not recall borrowed book from accounts[1]", async () => {
      const res = await _contract.recallBorrowedBooks.call(1, {
        from: accounts[0]
      });
      assert.equal(
        res.toString().localeCompare("false"),
        0,
        "Recall Borrowed Books execution is wrong"
      );
    });

    it("accounts[0] can not recall all yoursellf borrowed book from everyone", async () => {
      const total = await _contract.recallAllBorrowedBooks.call({
        from: accounts[0]
      });
      assert.equal(
        total.toString(),
        0,
        "Recall All Borrowed Books execution is wrong"
      );
    });
  });

  describe("Extend time for Borrowed Books", () => {
    const extendedTime = 604800; // add more 1 weeks

    before(async () => {
      const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
        from: accounts[1]
      });
      await _contract.requestExtendTimeOfBorrowedBooks(
        2,
        accounts[0],
        ownedBorrowedBooks[0].startTime,
        ownedBorrowedBooks[0].endTime,
        ownedBorrowedBooks[0].amount,
        extendedTime,
        {
          from: accounts[1]
        }
      );
    });

    it("should have one Request extend time for accounts[1]", async () => {
      const allReq = await _bookRentingStorage.getAllOwnedRequest({
        from: accounts[0]
      });

      assert.equal(allReq.length, 1, "No request exists");
      assert.equal(
        allReq[0].sender,
        accounts[1],
        "accounts[1] is not sender of request"
      );
      assert.equal(allReq[0].id, 1, "id of borrowed book is wrong");
      assert.equal(allReq[0].isAccept, false, "Status of request is invalid");
    });

    it("should create a already exist Request", async () => {
      try {
        const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
          from: accounts[1]
        });
        await _contract.requestExtendTimeOfBorrowedBooks.call(
          2,
          accounts[0],
          ownedBorrowedBooks[0].startTime,
          ownedBorrowedBooks[0].endTime,
          ownedBorrowedBooks[0].amount,
          extendedTime,
          {
            from: accounts[1]
          }
        );
      } catch (err) {
        assert(err, "Request is created is invalid");
      }
    });

    // it("update extend time for request of borrowed book id 1 ", async () => {
    //   const newExtendedTime = 1209600;
    //   const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
    //     from: accounts[1]
    //   });
    //   await _contract.updateRequestOfBorrowedBooks(
    //     2,
    //     accounts[0],
    //     ownedBorrowedBooks[0].startTime,
    //     ownedBorrowedBooks[0].endTime,
    //     ownedBorrowedBooks[0].amount,
    //     newExtendedTime,
    //     {
    //       from: accounts[1]
    //     }
    //   );

    //   const allReq = await _bookRentingStorage.getAllOwnedRequest({
    //     from: accounts[0]
    //   });
    //   assert.equal(allReq.length, 1, "No request exists");
    //   assert.equal(
    //     allReq[0].sender,
    //     accounts[1],
    //     "accounts[1] is not sender of request"
    //   );
    //   assert.equal(allReq[0].id, 1, "id of borrowed book is wrong");
    //   assert.equal(
    //     allReq[0].time,
    //     newExtendedTime,
    //     "new extended time is invalid"
    //   );
    //   assert.equal(allReq[0].isAccept, false, "Status of request is invalid");
    // });

    it("account[0] reject request for extension of time from accounts[1] ", async () => {
      await _contract.doAcceptRequest(1, accounts[1], false, {
        from: accounts[0]
      });

      const allReq = await _bookRentingStorage.getAllOwnedRequest({
        from: accounts[0]
      });

      assert.equal(allReq.length, 0, "No request exists");

      const allRes = await _bookRentingStorage.getAllOwnedResponse({
        from: accounts[1]
      });

      assert.equal(allRes.length, 0, "Set response is wrong");
    });

    it("account[0] accept request for extension of time from accounts[1] ", async () => {
      const extendedTime = 604800; // add more 1 weekss
      const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
        from: accounts[1]
      });
      await _contract.requestExtendTimeOfBorrowedBooks(
        2, // TokenId
        accounts[0],
        ownedBorrowedBooks[0].startTime,
        ownedBorrowedBooks[0].endTime,
        ownedBorrowedBooks[0].amount,
        extendedTime,
        {
          from: accounts[1]
        }
      );
      const allReqBefore = await _bookRentingStorage.getAllOwnedRequest({
        from: accounts[0]
      });
      assert.equal(
        allReqBefore.length,
        1,
        "Set request is wrong before accept"
      );
      assert.equal(
        allReqBefore[0].isAccept,
        false,
        "Set status of request is wrong before accept"
      );

      await _contract.doAcceptRequest(
        1, // Id of borrowed book
        accounts[1],
        true,
        {
          from: accounts[0]
        }
      );

      const allReqAfter = await _bookRentingStorage.getAllOwnedRequest({
        from: accounts[0]
      });
      assert.equal(allReqAfter.length, 1, "Set request is wrong after accept");
      assert.equal(
        allReqAfter[0].isAccept,
        true,
        "Set status of request is wrong after accept"
      );

      const allRes = await _bookRentingStorage.getAllOwnedResponse({
        from: accounts[1]
      });
      assert.equal(allRes.length, 1, "Set response is wrong");
    });

    // Tested the rejection case and it was successful.
    // This is a test in case the response is accepted
    it("account[0] accept transfer to accounts[1] for extend time of borrowed books", async () => {
      const extendedTime = 604800; // add more 1 weeks
      const value = ethers.utils.parseEther("0.1").toString();
      const ownedBorrowedBooksBefore = await _bookRentingStorage.getOwnedBorrowedBooks({
        from: accounts[1]
      });

      await _contract.transferForSendedRequest(1, accounts[0], true, {
        from: accounts[1],
        value: value
      });

      const ownedBorrowedBooksAfter = await _bookRentingStorage.getOwnedBorrowedBooks({
        from: accounts[1]
      });
      assert(
        ownedBorrowedBooksAfter.length == 1 &&
          ownedBorrowedBooksBefore.length == 1,
        "Borrowed books of acccount[1] is wrong"
      );
      assert(
        ownedBorrowedBooksAfter[0].startTime >
          ownedBorrowedBooksBefore[0].startTime,
        "Start time of borrowed books is wrong"
      );
      assert(
        ownedBorrowedBooksAfter[0].endTime -
          ownedBorrowedBooksBefore[0].endTime ==
          extendedTime,
        "End time time of borrowed books is wrong"
      );

      const allReq = await _bookRentingStorage.getAllOwnedRequest({
        from: accounts[0]
      });
      assert.equal(allReq.length, 0, "Cancle request is wrong");

      const allRes = await _bookRentingStorage.getAllOwnedResponse({
        from: accounts[1]
      });
      assert.equal(allRes.length, 0, "Cancle response is wrong");
    });
  });

  describe("Share books", () => {
    const amount = 10;
    const _nftPrice = ethers.utils.parseEther("0.001").toString();

    before(async () => {
      await _contract.shareBooks(1, _nftPrice, amount, {
        from: accounts[1],
        value: _sharingPrice
      });
    });

    it("should have one Book on sharing for accounts[1]", async () => {
      const allBooksOnSharing = await _bookSharingStorage.getAllBooksOnSharing();
      assert.equal(allBooksOnSharing.length, 1, "No books on sharing");
      assert.equal(
        allBooksOnSharing[0].sharer,
        accounts[1],
        "Sharer is invalid"
      );
      assert.equal(
        allBooksOnSharing[0].amount.toString(),
        10,
        "Amount of Books on sharing is invalid"
      );
    });

    it("should have one owned Book on sharing for accounts[1]", async () => {
      const allOwnedBooks = await _bookSharingStorage.getAllOwnedBooksOnSharing({
        from: accounts[1]
      });
      assert.equal(allOwnedBooks.length, 1, "No books on sharing");
      assert.equal(allOwnedBooks[0].sharer, accounts[1], "Sharer is invalid");
      assert.equal(
        allOwnedBooks[0].amount.toString(),
        10,
        "Amount of Books on sharing is invalid"
      );
    });

    it("accounts[1] should not share borrowed books id 1", async () => {
      try {
        await _contract.shareBooks(1, _nftPrice, amount, {
          from: accounts[1],
          value: _sharingPrice
        });
        assert(true, "Set books on sharing is wrong");
      } catch (e) {
        assert(e, "Set books on sharing is wrong");
      }
    });
  });

  describe("Update books on sharing", () => {
    const newAmount = 15;
    const _newNftPrice = ethers.utils.parseEther("0.011").toString();

    before(async () => {
      await _contract.updateBooksOnSharing(1, _newNftPrice, newAmount, {
        from: accounts[1]
      });
    });

    it("should have one Book on sharing for accounts[1]", async () => {
      const allBooksOnSharing = await _bookSharingStorage.getAllBooksOnSharing();
      assert.equal(allBooksOnSharing.length, 1, "No books on sharing");
      assert.equal(
        allBooksOnSharing[0].sharer,
        accounts[1],
        "Sharer is invalid"
      );
      assert.equal(
        allBooksOnSharing[0].amount.toString(),
        15,
        "New amount of Books on sharing is invalid"
      );
      assert.equal(
        allBooksOnSharing[0].price.toString(),
        11000000000000000,
        "New price of Books on sharing is invalid"
      );
    });

    it("should have one owned Book on sharing for accounts[1]", async () => {
      const allOwnedBooks = await _bookSharingStorage.getAllOwnedBooksOnSharing({
        from: accounts[1]
      });

      assert.equal(allOwnedBooks.length, 1, "No books on sharing");
      assert.equal(allOwnedBooks[0].sharer, accounts[1], "Sharer is invalid");
      assert.equal(
        allOwnedBooks[0].amount.toString(),
        15,
        "New amount of Books on sharing is invalid"
      );
      assert.equal(
        allOwnedBooks[0].price.toString(),
        11000000000000000,
        "New price of Books on sharing is invalid"
      );
    });

    it("accounts[1] should not update invalid amount for books on sharing", async () => {
      try {
        await _contract.updateBooksOnSharing(1, _newNftPrice, 25, {
          from: accounts[1]
        });
        assert(false, "Set books on sharing is wrong");
      } catch (e) {
        assert(e, "Set books on sharing is wrong");
      }
    });
  });

  describe("Take books on sharing", () => {
    let value = ethers.utils.parseEther("0.011").toString();

    before(async () => {
      await _contract.takeBooksOnSharing(1, {
        from: accounts[2],
        value: value
      });
    });

    it("should have one Book on sharing for accounts[1]", async () => {
      const allBooksOnSharing = await _bookSharingStorage.getAllBooksOnSharing();
      assert.equal(allBooksOnSharing.length, 1, "No books on sharing");
      assert.equal(
        allBooksOnSharing[0].sharer,
        accounts[1],
        "Sharer is invalid"
      );
      assert.equal(
        allBooksOnSharing[0].amount.toString(),
        14,
        "Amount of Books on sharing is invalid"
      );
    });

    it("should have one owned Book on sharing for accounts[1]", async () => {
      const allOwnedBooks = await _bookSharingStorage.getAllOwnedBooksOnSharing({
        from: accounts[1]
      });

      assert.equal(allOwnedBooks[0].sharer, accounts[1], "Sharer is invalid");
      assert.equal(
        allOwnedBooks[0].amount.toString(),
        14,
        "Amount of Books on sharing is invalid"
      );
    });

    it("should have one Shared book for accounts[2]", async () => {
      const allSharedBooks = await _bookSharingStorage.getAllSharedBook();
      assert.equal(allSharedBooks.length, 1, "No books on sharing");
      assert.equal(allSharedBooks[0].sharer, accounts[1], "Sharer is invalid");
      assert.equal(
        allSharedBooks[0].sharedPer,
        accounts[2],
        "Shared person is invalid"
      );
      assert.equal(
        allSharedBooks[0].amount.toString(),
        1,
        "Amount of Books on sharing is invalid"
      );
    });

    it("should have one owned Shared book for accounts[2]", async () => {
      const allOwnedSharedBooks = await _bookSharingStorage.getAllOwnedSharedBook({
        from: accounts[2]
      });
      assert.equal(allOwnedSharedBooks.length, 1, "No books on sharing");
      assert.equal(
        allOwnedSharedBooks[0].sharer,
        accounts[1],
        "Sharer is invalid"
      );
      assert.equal(
        allOwnedSharedBooks[0].sharedPer,
        accounts[2],
        "Shared person is invalid"
      );
      assert.equal(
        allOwnedSharedBooks[0].amount.toString(),
        1,
        "Amount of Books on sharing is invalid"
      );
    });

    it("accounts[1] and accounts[2] is temporary owner of token Id 2 with correct amount", async () => {
      const quantityTokenId2OfAcc1 = await _contract.getBalanceOfOwnerBook(2, {
        from: accounts[1]
      });
      const quantityTokenId2OfAcc2 = await _contract.getBalanceOfOwnerBook(2, {
        from: accounts[2]
      });

      assert.equal(
        quantityTokenId2OfAcc1.toString(),
        19,
        "Set books on sharing is wrong"
      );
      assert.equal(
        quantityTokenId2OfAcc2.toString(),
        1,
        "Set books on sharing is wrong"
      );
    });

    it("should have correct amount of untradable token id 2 of accounts[0], accounts[1], accounts[2]", async () => {
      const amountOfAllTypeBooksUntradeable0 =
        await _contract.getAmountOfAllTypeBooksUntradeable(2, {
          from: accounts[0]
        });
      const amountOfAllTypeBooksUntradeable1 =
        await _contract.getAmountOfAllTypeBooksUntradeable(2, {
          from: accounts[1]
        });
      const amountOfAllTypeBooksUntradeable2 =
        await _contract.getAmountOfAllTypeBooksUntradeable(2, {
          from: accounts[2]
        });

      assert.equal(
        amountOfAllTypeBooksUntradeable0.toString(),
        20,
        "Set amount of all type books untradeable of accounts[0] is wrong"
      );
      assert.equal(
        amountOfAllTypeBooksUntradeable1.toString(),
        19,
        "Set amount of all type books untradeable of accounts[1] is wrong"
      );
      assert.equal(
        amountOfAllTypeBooksUntradeable2.toString(),
        1,
        "Set amount of all type books untradeable of accounts[2] is wrong"
      );
    });

    it("account[2] is not real owner of token id 2", async () => {
      const realOwners = await _contract.getAllRealOwnerOfTokenId(2);
      assert.equal(realOwners.length, 1, "Set real owner is wrong");
      assert.equal(realOwners[0], accounts[0], "Set real owner is wrong");
    });
  });

  describe("Convert Books on sharing to Borrowed book", () => {
    const amountOfConvertion = 10;

    before(async () => {
      const extendedTime = 604800; // add more 1 weekss
      const value = ethers.utils.parseEther("0.025").toString();
      const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
        from: accounts[1]
      });
      await _contract.requestExtendTimeOfBorrowedBooks(
        2, // TokenId
        accounts[0],
        ownedBorrowedBooks[0].startTime,
        ownedBorrowedBooks[0].endTime,
        ownedBorrowedBooks[0].amount,
        extendedTime,
        {
          from: accounts[1]
        }
      );

      await _contract.doAcceptRequest(
        1, // Id of borrowed book
        accounts[1],
        true,
        {
          from: accounts[0]
        }
      );

      await _contract.transferForSendedRequest(1, accounts[0], true, {
        from: accounts[1],
        value: value
      });
    });

    it("should two borrowed books after convert", async () => {
      await _bookTemporary.convertBookOnSharingToBorrowedBook(
        1,
        amountOfConvertion,
        {
          from: accounts[1],
          value: _convertPrice
        }
      );

      const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
        from: accounts[1]
      });
      assert.equal(
        ownedBorrowedBooks.length,
        2,
        "Length of owned borrowed books is invalid"
      );
      assert.equal(
        ownedBorrowedBooks[0].amount,
        5,
        "Amount of owned borrowed books id 1 is invalid"
      );
      assert.equal(
        ownedBorrowedBooks[1].amount,
        amountOfConvertion,
        "Amount of owned borrowed books id 2 is invalid"
      );
    });

    it("should 4 books on sharing for accounts[1] after convertion", async () => {
      const allOwnedBooksOnSharing = await _bookSharingStorage.getAllOwnedBooksOnSharing({
        from: accounts[1]
      });
      assert.equal(allOwnedBooksOnSharing.length, 1, "No books on sharing");
      assert.equal(
        allOwnedBooksOnSharing[0].amount.toString(),
        14 - amountOfConvertion,
        "Amount of Books on sharing is invalid"
      );
    });
  });

  describe("Extend specify amount for Borrowed Books", () => {
    const extendedTime = 604800; // add more 1 weeks
    const extendedAmount = 5; // add more 1 weeks
    const value = ethers.utils.parseEther("0.025").toString();

    before(async () => {
      const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
        from: accounts[1]
      });
      await _contract.requestExtendTimeOfBorrowedBooks(
        2,
        accounts[0],
        ownedBorrowedBooks[1].startTime,
        ownedBorrowedBooks[1].endTime,
        extendedAmount,
        extendedTime,
        {
          from: accounts[1]
        }
      );
    });

    it("should three owned borrowed books for accounts[1]", async () => {
      await _contract.doAcceptRequest(
        2, // Id of borrowed book
        accounts[1],
        true,
        {
          from: accounts[0]
        }
      );

      await _contract.transferForSendedRequest(2, accounts[0], true, {
        from: accounts[1],
        value: value
      });
      const ownedBorrowedBooks = await _bookRentingStorage.getOwnedBorrowedBooks({
        from: accounts[1]
      });

      assert.equal(
        ownedBorrowedBooks.length,
        3,
        "length of owned borrowed books's list"
      );
      assert.equal(
        ownedBorrowedBooks[0].amount,
        5,
        "Amount of borrowed book 1 is invalid"
      );
      assert.equal(
        ownedBorrowedBooks[1].amount,
        5,
        "Amount of borrowed book 2 is invalid"
      );
      assert.equal(
        ownedBorrowedBooks[2].amount,
        5,
        "Amount of borrowed book 3 is invalid"
      );
    });
  });

  describe("Recall Books On Sharing", () => {
    it("accounts[0] can not recall books on sharing from accounts[1]", async () => {
      const res = await _contract.recallBooksOnSharing.call(1, {
        from: accounts[0]
      });
      assert.equal(
        res.toString().localeCompare("false"),
        0,
        "Recall Books On Sharing execution is wrong"
      );
    });

    it("accounts[0] can not recall all yoursellf books on sharing from everyone", async () => {
      const total = await _contract.recallAllBooksOnSharing.call({
        from: accounts[0]
      });
      assert.equal(total.toString(), 0, "Recall All books on sharing is wrong");
    });
  });

  describe("Recall Shared Books", () => {
    it("accounts[0] can not recall shared books from accounts[2]", async () => {
      const res = await _contract.recallSharedBooks.call(1, {
        from: accounts[0]
      });
      assert.equal(
        res.toString().localeCompare("false"),
        0,
        "Recall shared books execution is wrong"
      );
    });

    it("accounts[0] can not recall all yoursellf shared books from everyone", async () => {
      const total = await _contract.recallAllSharedBooks.call({
        from: accounts[0]
      });
      assert.equal(total.toString(), 0, "Recall All shared books is wrong");
    });
  });

  describe("Book readable by user", () => {
    it("accounts[0] can read book with token Id 2 and can no with token id 1", async () => {
      const res0 = await _contract.isBookReadableByUser.call(2, {
        from: accounts[0]
      });
      const res1 = await _contract.isBookReadableByUser.call(1, {
        from: accounts[0]
      });
      assert.equal(
        res0.toString(),
        "true",
        "Account[0]'s Reading permisstion for token id 2 is wrong"
      );
      assert.equal(
        res1.toString(),
        "false",
        "Account[0]'s Reading permisstion for token id 1 is wrong"
      );
    });

    it("accounts[1] can read book with both token Id 1,2", async () => {
      const res0 = await _contract.isBookReadableByUser.call(1, {
        from: accounts[1]
      });
      const res1 = await _contract.isBookReadableByUser.call(2, {
        from: accounts[1]
      });
      assert.equal(
        res0.toString(),
        "true",
        "Account[1]'s Reading permisstion for token id 1 is wrong"
      );
      assert.equal(
        res1.toString(),
        "true",
        "Account[1]'s Reading permisstion for token id 2 is wrong"
      );
    });

    it("accounts[2] can read book with token Id 2 and can no with token id 1", async () => {
      const res0 = await _contract.isBookReadableByUser.call(2, {
        from: accounts[2]
      });
      const res1 = await _contract.isBookReadableByUser.call(1, {
        from: accounts[2]
      });
      assert.equal(
        res0.toString(),
        "true",
        "Account[2]'s Reading permisstion for token id 2 is wrong"
      );
      assert.equal(
        res1.toString(),
        "false",
        "Account[2]'s Reading permisstion for token id 1 is wrong"
      );
    });

  });
});
