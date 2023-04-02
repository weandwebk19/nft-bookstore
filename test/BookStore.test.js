/* eslint-disable prettier/prettier */
const BookStore = artifacts.require("BookStore");
const ListedBookStorage = artifacts.require("ListedBookStorage");
const BookTemporary = artifacts.require("BookTemporary");
const Timelock = artifacts.require("Timelock");
const ExtendTime = artifacts.require("ExtendTime");
const SharedBookStorage = artifacts.require("SharedBookStorage");

const { ethers } = require("ethers");
contract("BookStore", (accounts) => {
  let _contract = null;
  let balance = 100;
  let _listingPrice = ethers.utils.parseEther("0.025").toString();
  let _rentingPrice = ethers.utils.parseEther("0.001").toString();
  let _sharingPrice = ethers.utils.parseEther("0.0005").toString();

  before(async () => {
    await ListedBookStorage.deployed();
    await Timelock.deployed();
    await ExtendTime.deployed();
    await SharedBookStorage.deployed();
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
      assert.equal(nftItem.quantity, balance, "Nft balance is not correct");
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

    it("amount of used book should equal the first balance.", async () => {
      const amount = await _contract.getAmountUnUsedBook(1, {
        from: accounts[0]
      });
      assert.equal(amount, balance, "It has not equal the first balance.");
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
      await _contract.leaseBooks(1, _nftPrice, amount, {
        from: accounts[1],
        value: _rentingPrice
      });

      await _contract.leaseBooks(2, _nftPrice, amount, {
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

    it("should have one borrowed items on borrowing", async () => {
      const allBorrowedBooks = await _contract.getAllBorrowedBooks();
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
        assert(error, "Set amount listed tokens and rented tokens are wrong");
      }
    });
  });

  describe("Recall Borrowed Books", () => {
    it("accounts[0] can not recall borrowed book from accounts[1]", async () => {
      const res = await _contract.recallBorrowedBooks.call(
        2,
        accounts[0],
        accounts[1],
        {
          from: accounts[0]
        }
      );
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
      await _contract.requestExtendTimeOfBorrowedBooks(
        2,
        accounts[0],
        extendedTime,
        {
          from: accounts[1]
        }
      );
    });

    it("should have one Request extend time for accounts[1]", async () => {
      const allReq = await _contract.getAllOwnedRequestsOnExtending({
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
        await _contract.requestExtendTimeOfBorrowedBooks.call(
          2,
          accounts[0],
          extendedTime,
          {
            from: accounts[1]
          }
        );
      } catch (err) {
        assert(err, "Request is created is invalid");
      }
    });

    it("update extend time for request of borrowed book id 1 ", async () => {
      const newExtendedTime = 1209600;
      await _contract.updateRequestExtendTimeOfBorrowedBooks(
        2,
        accounts[0],
        newExtendedTime,
        {
          from: accounts[1]
        }
      );

      const allReq = await _contract.getAllOwnedRequestsOnExtending({
        from: accounts[0]
      });
      assert.equal(allReq.length, 1, "No request exists");
      assert.equal(
        allReq[0].sender,
        accounts[1],
        "accounts[1] is not sender of request"
      );
      assert.equal(allReq[0].id, 1, "id of borrowed book is wrong");
      assert.equal(
        allReq[0].time,
        newExtendedTime,
        "new extended time is invalid"
      );
      assert.equal(allReq[0].isAccept, false, "Status of request is invalid");
    });

    it("account[0] reject request for extension of time from accounts[1] ", async () => {
      await _contract.doAcceptRequest(1, accounts[1], false, {
        from: accounts[0]
      });

      const allReq = await _contract.getAllOwnedRequestsOnExtending({
        from: accounts[0]
      });

      assert.equal(allReq.length, 0, "No request exists");

      const allRes = await _contract.getAllOwnedResponsesOnExtending({
        from: accounts[1]
      });

      assert.equal(allRes.length, 0, "Set response is wrong");
    });

    it("account[0] accept request for extension of time from accounts[1] ", async () => {
      const extendedTime = 604800; // add more 1 weekss
      await _contract.requestExtendTimeOfBorrowedBooks(
        2, // TokenId
        accounts[0],
        extendedTime,
        {
          from: accounts[1]
        }
      );
      const allReqBefore = await _contract.getAllOwnedRequestsOnExtending({
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

      const allReqAfter = await _contract.getAllOwnedRequestsOnExtending({
        from: accounts[0]
      });
      assert.equal(allReqAfter.length, 1, "Set request is wrong after accept");
      assert.equal(
        allReqAfter[0].isAccept,
        true,
        "Set status of request is wrong after accept"
      );

      const allRes = await _contract.getAllOwnedResponsesOnExtending({
        from: accounts[1]
      });
      assert.equal(allRes.length, 1, "Set response is wrong");
    });

    // Tested the rejection case and it was successful.
    // This is a test in case the response is accepted
    it("account[1] accept transfer to accounts[1] for extend time of borrowed books", async () => {
      const extendedTime = 604800; // add more 1 weeks
      const value = ethers.utils.parseEther("0.1").toString();
      const ownedBorrowedBooksBefore = await _contract.getOwnedBorrowedBooks({
        from: accounts[1]
      });

      await _contract.transferForSendedRequest(1, accounts[0], true, {
        from: accounts[1],
        value: value
      });

      const ownedBorrowedBooksAfter = await _contract.getOwnedBorrowedBooks({
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

      const allReq = await _contract.getAllOwnedRequestsOnExtending({
        from: accounts[0]
      });
      assert.equal(allReq.length, 0, "Cancle request is wrong");

      const allRes = await _contract.getAllOwnedResponsesOnExtending({
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
      const allBooksOnSharing = await _contract.getAllBooksOnSharing();
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
      const allOwnedBooks = await _contract.getAllOwnedBooksOnSharing({
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
      const allBooksOnSharing = await _contract.getAllBooksOnSharing();
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
      const allOwnedBooks = await _contract.getAllOwnedBooksOnSharing({
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
        assert(true, "Set books on sharing is wrong");
      } catch (e) {
        assert(e, "Set books on sharing is wrong");
      }
    });
  });

  describe("Take books on sharing", () => {
    let ammount = 10;
    let value = ethers.utils.parseEther("0.11").toString();

    before(async () => {
      await _contract.takeBooksOnSharing(1, accounts[1], ammount, {
        from: accounts[2],
        value: value
      });
    });

    it("should have one Book on sharing for accounts[1]", async () => {
      const allBooksOnSharing = await _contract.getAllBooksOnSharing();
      assert.equal(allBooksOnSharing.length, 1, "No books on sharing");
      assert.equal(
        allBooksOnSharing[0].sharer,
        accounts[1],
        "Sharer is invalid"
      );
      assert.equal(
        allBooksOnSharing[0].amount.toString(),
        5,
        "Amount of Books on sharing is invalid"
      );
    });

    it("should have one owned Book on sharing for accounts[1]", async () => {
      const allOwnedBooks = await _contract.getAllOwnedBooksOnSharing({
        from: accounts[1]
      });

      assert.equal(allOwnedBooks[0].sharer, accounts[1], "Sharer is invalid");
      assert.equal(
        allOwnedBooks[0].amount.toString(),
        5,
        "Amount of Books on sharing is invalid"
      );
    });

    it("should have one Shared book for accounts[2]", async () => {
      const allSharedBooks = await _contract.getAllSharedBook();
      assert.equal(allSharedBooks.length, 1, "No books on sharing");
      assert.equal(allSharedBooks[0].sharer, accounts[1], "Sharer is invalid");
      assert.equal(
        allSharedBooks[0].sharedPer,
        accounts[2],
        "Shared person is invalid"
      );
      assert.equal(
        allSharedBooks[0].amount.toString(),
        10,
        "Amount of Books on sharing is invalid"
      );
    });

    it("should have one owned Shared book for accounts[2]", async () => {
      const allOwnedSharedBooks = await _contract.getAllOwnedSharedBook({
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
        10,
        "Amount of Books on sharing is invalid"
      );
    });

    it("accounts[2] should not take invalid amount for books on sharing", async () => {
      try {
        await _contract.takeBooksOnSharing(1, accounts[1], 10, {
          from: accounts[2]
        });
        assert(true, "Set shared books is wrong");
      } catch (e) {
        assert(e, "Set shared books is wrong");
      }
    });

    it("accounts[2] takes all books on sharing of account[1]", async () => {
      ammount = 5;
      let value = ethers.utils.parseEther("0.055").toString();

      await _contract.takeBooksOnSharing(1, accounts[1], ammount, {
        from: accounts[2],
        value: value
      });

      const allBooksOnSharing = await _contract.getAllBooksOnSharing();
      assert.equal(
        allBooksOnSharing.length,
        0,
        "Set books on sharing is wrong"
      );

      const allOwnedBooks = await _contract.getAllOwnedBooksOnSharing({
        from: accounts[1]
      });
      assert.equal(
        allOwnedBooks.length,
        0,
        "Set owned books on sharing is wrong"
      );

      const allSharedBooks = await _contract.getAllSharedBook();
      assert.equal(allSharedBooks.length, 1, "No books on sharing");
      assert.equal(
        allSharedBooks[0].amount.toString(),
        15,
        "Amount of Books on sharing is invalid"
      );

      const allOwnedSharedBooks = await _contract.getAllOwnedSharedBook({
        from: accounts[2]
      });
      assert.equal(allOwnedSharedBooks.length, 1, "No books on sharing");
      assert.equal(
        allOwnedSharedBooks[0].amount.toString(),
        15,
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
        5,
        "Set books on sharing is wrong"
      );
      assert.equal(
        quantityTokenId2OfAcc2.toString(),
        15,
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
        5,
        "Set amount of all type books untradeable of accounts[1] is wrong"
      );
      assert.equal(
        amountOfAllTypeBooksUntradeable2.toString(),
        15,
        "Set amount of all type books untradeable of accounts[2] is wrong"
      );
    });
  });
});
