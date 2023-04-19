// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./sell/BookSellingStorage.sol";
import "./rent/BookRentingStorage.sol";
import "./share/BookSharingStorage.sol";
import "./BookTemporary.sol";
import "./ListRealOwners.sol";

contract BookStore is ERC1155URIStorage, Ownable {
  using Counters for Counters.Counter;

  struct NFTBook {
    uint256 tokenId;
    address author;
    uint256 quantity;
  }

  event NFTBookCreated(uint256 tokenId, address author, uint256 quantity);

  BookSellingStorage private _bookSellingStorage;
  BookTemporary private _bookTemporary;
  BookRentingStorage private _bookRentingStorage;
  BookSharingStorage private _bookSharingStorage;
  ListRealOwners private _listRealOwners;

  uint MAX_BALANCE = 500;
  uint MIN_TIME = 604800; // Rental period is at least one week
  uint public listingPrice = 0.025 ether;
  uint public lendingPrice = 0.001 ether;
  uint public sharingPrice = 0.0005 ether;
  uint public convertPrice = 0.000005 ether;

  Counters.Counter private _tokenIds;

  mapping(uint => NFTBook) _idToNFTBook;
  mapping(string => bool) private _usedTokenURIs;

  mapping(address => mapping(uint => uint)) private _ownedTokens;
  mapping(address => uint) private _totalOwnedToken;

  constructor(
    BookSellingStorage bookSellingStorage,
    BookTemporary bookTemporary,
    ListRealOwners listRealOwners
  ) ERC1155("https://example.com/api/{id}.json") {
    _bookSellingStorage = bookSellingStorage;
    _bookTemporary = bookTemporary;
    _bookRentingStorage = _bookTemporary.getBookRentingStorage();
    _bookSharingStorage = bookTemporary.getBookSharingStorage();
    _listRealOwners = listRealOwners;
  }

  function getUri(uint tokenId) public view returns (string memory) {
    return ERC1155URIStorage.uri(tokenId);
  }

  function setListingPrice(uint newPrice) external onlyOwner {
    if (newPrice == 0) {
      revert Error.InvalidPriceError(newPrice);
    }
    listingPrice = newPrice;
  }

  function setLendingPrice(uint newPrice) external onlyOwner {
    if (newPrice == 0) {
      revert Error.InvalidPriceError(newPrice);
    }
    lendingPrice = newPrice;
  }

  function setSharingPrice(uint newPrice) external onlyOwner {
    if (newPrice == 0) {
      revert Error.InvalidPriceError(newPrice);
    }
    sharingPrice = newPrice;
  }

  function isListing(uint tokenId, address seller) public view returns (bool) {
    return _bookSellingStorage.isListing(tokenId, seller);
  }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

    // Mint book
    if (from == address(0) && to != address(0)) {
      uint tokenId = ids[0];
      _addTokenToOwnerEnumeration(to, tokenId);
    }

    // Buy books/ Borrow books / Share books
    if (from != address(0) && to != address(0) && to != from) {
      uint tokenId = ids[0];
      _addTokenToOwnerEnumeration(to, tokenId);
      if (ERC1155.balanceOf(from, tokenId) == 0) {
        _removeTokenFromOwnerEnumeration(from, tokenId);
      }
    }
  }

  function getAllRealOwnerOfTokenId(
    uint tokenId
  ) public view returns (address[] memory) {
    return _listRealOwners.getAllRealOwnerOfTokenId(tokenId);
  }

  function _afterTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override {
    super._afterTokenTransfer(operator, from, to, ids, amounts, data);
    uint realQuantity;
    // Mint book
    if (from == address(0) && to != address(0)) {
      uint tokenId = ids[0];
      realQuantity =
        ERC1155.balanceOf(to, tokenId) -
        _bookTemporary.getAmountOfUnsalableBooksInTemporary(tokenId, to);
      _listRealOwners.updateRealOwnerOfTokenIdIfNeed(realQuantity, tokenId, to);
    }

    // Buy books/ Borrow books / Share books
    if (from != address(0) && to != address(0) && to != from) {
      uint tokenId = ids[0];
      realQuantity =
        ERC1155.balanceOf(to, tokenId) -
        _bookTemporary.getAmountOfUnsalableBooksInTemporary(tokenId, to);
      _listRealOwners.updateRealOwnerOfTokenIdIfNeed(realQuantity, tokenId, to);
      realQuantity =
        ERC1155.balanceOf(from, tokenId) -
        _bookTemporary.getAmountOfUnsalableBooksInTemporary(tokenId, from);
      _listRealOwners.updateRealOwnerOfTokenIdIfNeed(
        realQuantity,
        tokenId,
        from
      );
    }
  }

  function getBalanceOfOwnerBook(uint tokenId) public view returns (uint) {
    if (!isOwnerOfToken(tokenId, msg.sender)) {
      revert Error.InvalidOwnerError(tokenId, msg.sender);
    }

    return ERC1155.balanceOf(msg.sender, tokenId);
  }

  function _addTokenToOwnerEnumeration(address owner, uint tokenId) private {
    if (!isOwnerOfToken(tokenId, owner)) {
      uint length = _totalOwnedToken[owner];
      _ownedTokens[owner][length] = tokenId;
      _totalOwnedToken[owner]++;
    }
  }

  function _removeTokenFromOwnerEnumeration(
    address owner,
    uint tokenId
  ) private {
    uint lastTokenIndex = _totalOwnedToken[owner] - 1;

    for (uint i = 0; i < lastTokenIndex + 1; i++) {
      if (tokenId == _ownedTokens[owner][i]) {
        _ownedTokens[owner][i] = _ownedTokens[owner][lastTokenIndex];
      }
    }

    _totalOwnedToken[owner]--;
    delete _ownedTokens[owner][lastTokenIndex];
  }

  function getNftBook(uint tokenId) public view returns (NFTBook memory) {
    return _idToNFTBook[tokenId];
  }

  function getListedBook(
    uint tokenId,
    address seller
  ) public view returns (BookSellingStorage.BookSelling memory) {
    return _bookSellingStorage.getListedBook(tokenId, seller);
  }

  function getListedBookById(
    uint idListedBook
  ) public view returns (BookSellingStorage.BookSelling memory) {
    return _bookSellingStorage.getListedBookById(idListedBook);
  }

  function isTokenURIExist(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI];
  }

  function mintBook(
    string memory tokenURI,
    uint256 quantity
  ) public payable returns (uint) {
    if (isTokenURIExist(tokenURI)) {
      revert Error.InvalidTokenUriError(tokenURI);
    }
    if (quantity == 0 || quantity > MAX_BALANCE) {
      revert Error.InvalidAmountError(quantity);
    }
    if (msg.value != listingPrice) {
      revert Error.InvalidPriceError(msg.value);
    }

    _tokenIds.increment();
    uint newTokenId = _tokenIds.current();

    _mint(msg.sender, newTokenId, quantity, "");
    _setURI(newTokenId, tokenURI);
    _createNftBook(newTokenId, quantity);

    _usedTokenURIs[tokenURI] = true;
    return newTokenId;
  }

  function _createNftBook(uint tokenId, uint256 quantity) private {
    _idToNFTBook[tokenId] = NFTBook(tokenId, msg.sender, quantity);
    emit NFTBookCreated(tokenId, msg.sender, quantity);
  }

  function isOwnerOfToken(
    uint tokenId,
    address owner
  ) public view returns (bool) {
    return ERC1155.balanceOf(owner, tokenId) > 0;
  }

  function getOwnedNFTBooks() public view returns (NFTBook[] memory) {
    uint ownedItemsCount = _totalOwnedToken[msg.sender];
    NFTBook[] memory books = new NFTBook[](ownedItemsCount);

    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      NFTBook memory book = _idToNFTBook[tokenId];

      books[i] = book;
    }

    return books;
  }

  function getOwnedListedBooks()
    public
    view
    returns (BookSellingStorage.BookSelling[] memory)
  {
    uint ownedListedBookCount = _bookSellingStorage.getTotalOwnedListedBook(
      msg.sender
    );
    uint ownedItemsCount = _totalOwnedToken[msg.sender];
    BookSellingStorage.BookSelling[]
      memory books = new BookSellingStorage.BookSelling[](ownedListedBookCount);

    uint currentIndex = 0;
    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      BookSellingStorage.BookSelling memory book = _bookSellingStorage
        .getListedBook(tokenId, msg.sender);
      if (book.tokenId != 0 && book.seller != address(0)) {
        books[currentIndex] = book;
        currentIndex++;
      }
    }

    return books;
  }

  function getOwnedPurchasedBooks()
    public
    view
    returns (BookSellingStorage.BookSelling[] memory)
  {
    return _bookSellingStorage.getOwnedPurchasedBooks(msg.sender);
  }

  function getOwnedLendingBooks()
    public
    view
    returns (BookRentingStorage.LendBook[] memory)
  {
    uint ownedLendBookCount = _bookRentingStorage.getTotalOwnedLendBook(
      msg.sender
    );
    uint ownedItemsCount = _totalOwnedToken[msg.sender];
    BookRentingStorage.LendBook[]
      memory books = new BookRentingStorage.LendBook[](ownedLendBookCount);

    uint currentIndex = 0;
    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      BookRentingStorage.LendBook memory book = _bookRentingStorage.getLendBook(
        tokenId,
        msg.sender
      );
      if (book.tokenId != 0 && book.renter != address(0)) {
        books[currentIndex] = book;
        currentIndex++;
      }
    }

    return books;
  }

  function getOwnedBorrowedBooks()
    public
    view
    returns (BookRentingStorage.BorrowedBook[] memory)
  {
    BookRentingStorage.BorrowedBook[] memory borrowedBooks = _bookRentingStorage
      .getOwnedBorrowedBooks(msg.sender);
    return borrowedBooks;
  }

  function getAmountUnUsedBook(uint256 tokenId) public view returns (uint) {
    return
      getBalanceOfOwnerBook(tokenId) -
      getAmountOfAllTypeBooksUntradeable(tokenId);
  }

  function getAmountOfAllTypeBooksUntradeable(
    uint256 tokenId
  ) public view returns (uint) {
    return
      _bookSellingStorage.getAmountOfListedBooks(tokenId, msg.sender) +
      _bookTemporary.getAmountOfAllTypeBooksInTemporary(tokenId, msg.sender);
  }

  function sellBooks(
    uint256 tokenId,
    uint price,
    uint256 amount
  ) public payable {
    if (!isOwnerOfToken(tokenId, msg.sender)) {
      revert Error.InvalidOwnerError(tokenId, msg.sender);
    }
    if (
      getAmountOfAllTypeBooksUntradeable(tokenId) + amount >
      ERC1155.balanceOf(msg.sender, tokenId) ||
      amount == 0
    ) {
      revert Error.InvalidAmountError(amount);
    }
    if (msg.value != listingPrice) {
      revert Error.InvalidPriceError(msg.value);
    }
    _bookSellingStorage.sellListedBooks(tokenId, price, amount, msg.sender);
  }

  function lendBooks(
    uint256 tokenId,
    uint price,
    uint256 amount
  ) public payable {
    if (!isOwnerOfToken(tokenId, msg.sender)) {
      revert Error.InvalidOwnerError(tokenId, msg.sender);
    }
    if (
      getAmountOfAllTypeBooksUntradeable(tokenId) + amount >
      ERC1155.balanceOf(msg.sender, tokenId) ||
      amount == 0
    ) {
      revert Error.InvalidAmountError(amount);
    }
    if (msg.value != lendingPrice) {
      revert Error.InvalidPriceError(msg.value);
    }
    _bookRentingStorage.lendBooks(tokenId, msg.sender, price, amount);
  }

  function updateBookFromSale(
    uint256 tokenId,
    uint newPrice,
    uint256 newAmount,
    address seller
  ) public {
    if (!isOwnerOfToken(tokenId, msg.sender)) {
      revert Error.InvalidOwnerError(tokenId, msg.sender);
    }
    if (seller != msg.sender) {
      revert Error.InvalidAddressError(msg.sender);
    }
    _bookSellingStorage.updateListedBookFromSale(
      tokenId,
      newPrice,
      newAmount,
      seller
    );
  }

  function updateBookFromRenting(
    uint256 tokenId,
    uint newPrice,
    uint256 newAmount,
    address renter
  ) public {
    if (!isOwnerOfToken(tokenId, renter)) {
      revert Error.InvalidOwnerError(tokenId, renter);
    }
    if (renter != msg.sender) {
      revert Error.InvalidAddressError(msg.sender);
    }

    _bookRentingStorage.updateLendBookFromRenting(
      tokenId,
      newPrice,
      newAmount,
      renter
    );
  }

  function getAllBooksOnSale()
    public
    view
    returns (BookSellingStorage.BookSelling[] memory)
  {
    return _bookSellingStorage.getAllListedBooks();
  }

  function getAllBooksOnLending()
    public
    view
    returns (BookRentingStorage.LendBook[] memory)
  {
    return _bookRentingStorage.getAllLendBooks();
  }

  function buyBooks(
    uint256 tokenId,
    address seller,
    uint256 amount
  ) public payable {
    uint totalPrice = _bookSellingStorage.buyListedBooks(
      tokenId,
      seller,
      amount,
      msg.sender,
      msg.value
    );
    if (totalPrice != 0) {
      _safeTransferFrom(seller, msg.sender, tokenId, amount, "");
      payable(seller).transfer(totalPrice);
    }
  }

  function borrowBooks(
    uint256 tokenId,
    address renter,
    uint256 price,
    uint256 amount,
    uint rentalDuration
  ) public payable {
    if (rentalDuration < MIN_TIME) {
      revert Error.InvalidTimeError(rentalDuration);
    }

    uint startTime = block.timestamp;
    uint endTime = startTime + rentalDuration;
    uint256 totalPrice = _bookRentingStorage.borrowBooks(
      tokenId,
      renter,
      amount,
      price,
      startTime,
      endTime,
      msg.sender,
      msg.value
    );
    if (totalPrice != 0) {
      _safeTransferFrom(renter, msg.sender, tokenId, amount, "");
      payable(renter).transfer(totalPrice);
    } else {
      revert Error.ExecutionError();
    }
  }

  function getAllBorrowedBooks()
    public
    view
    returns (BookRentingStorage.BorrowedBook[] memory)
  {
    return _bookRentingStorage.getAllBorrowedBooks();
  }

  //Make a request to extend the rental period and wait for their owner to approve your request
  function requestExtendTimeOfBorrowedBooks(
    uint256 tokenId,
    address renter,
    uint startTime,
    uint endTime,
    uint extendedAmount,
    uint extendedTime
  ) public {
    if (renter == msg.sender) {
      revert Error.InvalidAddressError(msg.sender);
    }
    if (extendedTime < MIN_TIME) {
      revert Error.InvalidTimeError(extendedTime);
    }
    _bookRentingStorage.requestExtendTimeOfBorrowedBooks(
      tokenId,
      renter,
      msg.sender,
      startTime,
      endTime,
      extendedAmount,
      extendedTime
    );
  }

  // If borrowed book exist, only update extended time. Owthersise, do nothing
  function updateRequestOfBorrowedBooks(
    uint256 tokenId,
    address renter,
    uint startTime,
    uint endTime,
    uint newExtendedAmount,
    uint newExtendedTime
  ) public {
    if (renter == address(0) || msg.sender == address(0)) {
      revert Error.InvalidAddressError(address(0));
    }
    if (renter == msg.sender) {
      revert Error.InvalidAddressError(msg.sender);
    }
    if (newExtendedTime < MIN_TIME) {
      revert Error.InvalidTimeError(newExtendedTime);
    }

    _bookRentingStorage.updateRequestOfBorrowedBooks(
      tokenId,
      renter,
      msg.sender,
      startTime,
      endTime,
      newExtendedAmount,
      newExtendedTime
    );
  }

  function doAcceptRequest(
    uint idBorrowedBook,
    address borrower,
    bool isAccept
  ) public returns (bool) {
    return
      _bookRentingStorage.doAcceptRequestAndCreateResponse(
        idBorrowedBook,
        borrower,
        msg.sender,
        isAccept
      );
  }

  function transferForSendedRequest(
    uint id,
    address renter,
    bool isExtend
  ) public payable {
    if (renter == msg.sender) {
      revert Error.InvalidAddressError(msg.sender);
    }
    uint totalPrice = _bookRentingStorage.transferForSendedRequest(
      id,
      renter,
      msg.sender,
      block.timestamp,
      isExtend
    );

    if (totalPrice > 0) {
      if (msg.value != totalPrice) {
        revert Error.InvalidPriceError(msg.value);
      }
      payable(renter).transfer(totalPrice);
    }
  }

  function getAllOwnedRequestsOnExtending()
    public
    view
    returns (BookRentingStorage.Request[] memory)
  {
    return _bookRentingStorage.getAllOwnedRequest(msg.sender);
  }

  function getAllOwnedResponsesOnExtending()
    public
    view
    returns (BookRentingStorage.Response[] memory)
  {
    return _bookRentingStorage.getAllOwnedResponse(msg.sender);
  }

  // Return true if success, owthersise return false
  function recallBorrowedBooks(uint idBorrowedBook) public returns (bool) {
    BookRentingStorage.BorrowedBook memory book = _bookRentingStorage
      .getBorrowedBookFromId(idBorrowedBook);
    if (book.renter == msg.sender) {
      bool res = _bookRentingStorage.excRecallBorrowedBooks(idBorrowedBook);
      if (res) {
        _safeTransferFrom(
          book.borrower,
          msg.sender,
          book.tokenId,
          book.amount,
          ""
        );
      }
      return res;
    }
    return false;
  }

  // Return total of borrowed books which is recalled, if total equal 0,
  // you do not have any recallable books. Needed automate this function with Chainlink
  function recallAllBorrowedBooks() public returns (uint) {
    uint total = 0;
    if (address(0) != msg.sender) {
      uint length = _bookRentingStorage.getTotalBorrowedBooksOnBorrowing();
      if (length > 0) {
        for (uint i = 1; i <= length; i++) {
          BookRentingStorage.BorrowedBook memory book = _bookRentingStorage
            .getBorrowedBookFromId(i);
          if (book.renter == msg.sender && recallBorrowedBooks(i)) {
            total++;
          }
        }
      }
    }
    return total;
  }

  function getIdBorrowedBook(
    uint tokenId,
    address renter,
    address borrower,
    uint startTime,
    uint endTime
  ) public view returns (uint) {
    return
      _bookRentingStorage.getIdBorrowedBook(
        tokenId,
        renter,
        borrower,
        startTime,
        endTime
      );
  }

  function shareBooks(
    uint256 idBorrowedBook,
    uint price,
    uint256 amount
  ) public payable {
    BookRentingStorage.BorrowedBook memory borrowedBook = _bookRentingStorage
      .getBorrowedBookFromId(idBorrowedBook);
    if (msg.sender != borrowedBook.borrower) {
      revert Error.InvalidAddressError(msg.sender);
    }
    if (msg.value != sharingPrice) {
      revert Error.InvalidPriceError(sharingPrice);
    }
    if (amount == 0 || amount > borrowedBook.amount) {
      revert Error.InvalidAmountError(amount);
    }
    if (block.timestamp >= borrowedBook.endTime) {
      revert Error.InvalidTimeError(block.timestamp);
    }
    _bookSharingStorage.shareBooks(
      borrowedBook.tokenId,
      borrowedBook.renter,
      msg.sender,
      borrowedBook.price,
      price,
      amount,
      borrowedBook.startTime,
      borrowedBook.endTime
    );

    _bookRentingStorage.updateAmountBorrowedBookFromBorrowing(
      idBorrowedBook,
      amount,
      true
    );
  }

  function getAllBooksOnSharing()
    public
    view
    returns (BookSharingStorage.BookSharing[] memory)
  {
    return _bookSharingStorage.getAllBooksOnSharing();
  }

  function getAllOwnedBooksOnSharing()
    public
    view
    returns (BookSharingStorage.BookSharing[] memory)
  {
    return _bookSharingStorage.getAllOwnedBooksOnSharing(msg.sender);
  }

  function getAllSharedBook()
    public
    view
    returns (BookSharingStorage.BookSharing[] memory)
  {
    return _bookSharingStorage.getAllSharedBook();
  }

  function getAllOwnedSharedBook()
    public
    view
    returns (BookSharingStorage.BookSharing[] memory)
  {
    return _bookSharingStorage.getAllOwnedSharedBook(msg.sender);
  }

  function getIdBookOnSharing(
    uint tokenId,
    address fromRenter,
    address sharer,
    uint startTime,
    uint endTime
  ) public view returns (uint) {
    return
      _bookSharingStorage.getIdBookOnSharing(
        tokenId,
        fromRenter,
        sharer,
        startTime,
        endTime
      );
  }

  function updateBooksOnSharing(
    uint idBooksOnSharing,
    uint newPrice,
    uint newAmount
  ) public {
    BookSharingStorage.BookSharing memory booksOnSharing = _bookSharingStorage
      .getBooksOnSharing(idBooksOnSharing);
    uint idBorrowedBook = _bookRentingStorage.getIdBorrowedBook(
      booksOnSharing.tokenId,
      booksOnSharing.fromRenter,
      booksOnSharing.sharer,
      booksOnSharing.startTime,
      booksOnSharing.endTime
    );
    if (idBorrowedBook == 0) {
      revert Error.InvalidIdError(idBorrowedBook);
    }
    BookRentingStorage.BorrowedBook memory borrowedBook = _bookRentingStorage
      .getBorrowedBookFromId(idBorrowedBook);
    if (msg.sender != borrowedBook.borrower) {
      revert Error.InvalidAddressError(msg.sender);
    }
    if (
      newAmount == 0 || newAmount > borrowedBook.amount + booksOnSharing.amount
    ) {
      revert Error.InvalidAmountError(newAmount);
    }

    bool isDecrease;
    uint balance;

    if (newAmount <= booksOnSharing.amount) {
      isDecrease = false;
      balance = booksOnSharing.amount - newAmount;
    } else {
      isDecrease = true;
      balance = newAmount - booksOnSharing.amount;
    }

    _bookSharingStorage.updateBooksOnSharing(
      idBooksOnSharing,
      msg.sender,
      borrowedBook.tokenId,
      newPrice,
      newAmount
    );

    _bookRentingStorage.updateAmountBorrowedBookFromBorrowing(
      idBorrowedBook,
      balance,
      isDecrease
    );
  }

  function removeBooksOnSharing(
    uint tokenId,
    address fromRenter,
    address sharer,
    uint startTime,
    uint endTime
  ) public {
    _bookSharingStorage.removeBooksOnSharing(
      tokenId,
      fromRenter,
      sharer,
      startTime,
      endTime
    );
  }

  function takeBooksOnSharing(uint idBooksOnSharing) public payable {
    if (msg.sender == address(0)) {
      revert Error.InvalidAddressError(msg.sender);
    }
    if (idBooksOnSharing == 0) {
      revert Error.InvalidIdError(0);
    }
    BookSharingStorage.BookSharing memory booksOnSharing = _bookSharingStorage
      .getBooksOnSharing(idBooksOnSharing);
    uint price = _bookSharingStorage.takeBooksOnSharing(
      idBooksOnSharing,
      msg.sender
    );
    if (msg.value != price) {
      revert Error.InvalidPriceError(msg.value);
    }
    if (price != 0 && booksOnSharing.tokenId != 0) {
      _safeTransferFrom(
        booksOnSharing.sharer,
        msg.sender,
        booksOnSharing.tokenId,
        1,
        ""
      );
      // The amount you pay for this transaction will not depend on the period of borrowing the book,
      // the price will be set by the sharer
      payable(booksOnSharing.sharer).transfer(price);
    } else {
      revert Error.ExecutionError();
    }
  }

  function getIdSharedBook(
    uint tokenId,
    address sharedPer,
    address sharer,
    uint startTime,
    uint endTime
  ) public view returns (uint) {
    return
      _bookSharingStorage.getIdSharedBook(
        tokenId,
        sharedPer,
        sharer,
        startTime,
        endTime
      );
  }

  // Return true if success, owthersise return false
  function recallSharedBooks(uint idSharedBook) public returns (bool) {
    BookSharingStorage.BookSharing memory book = _bookSharingStorage
      .getSharedBooks(idSharedBook);
    if (book.fromRenter == msg.sender) {
      bool res = _bookSharingStorage.excRecallSharedBooks(idSharedBook);
      if (res) {
        _safeTransferFrom(
          book.sharedPer,
          msg.sender,
          book.tokenId,
          book.amount,
          ""
        );
      }
      return res;
    }
    return false;
  }

  function recallAllSharedBooks() public returns (uint) {
    uint total = 0;
    if (address(0) != msg.sender) {
      uint length = _bookSharingStorage.getTotalSharedBooks();
      if (length > 0) {
        for (uint i = 1; i <= length; i++) {
          BookSharingStorage.BookSharing memory book = _bookSharingStorage
            .getSharedBooks(i);
          if (book.fromRenter == msg.sender && recallSharedBooks(i)) {
            total++;
          }
        }
      }
    }
    return total;
  }

  function recallBooksOnSharing(uint idBooksOnSharing) public returns (bool) {
    BookSharingStorage.BookSharing memory book = _bookSharingStorage
      .getBooksOnSharing(idBooksOnSharing);
    if (book.fromRenter == msg.sender) {
      bool res = _bookSharingStorage.excRecallBooksOnSharing(idBooksOnSharing);
      if (res) {
        _safeTransferFrom(
          book.sharer,
          msg.sender,
          book.tokenId,
          book.amount,
          ""
        );
      }
      return res;
    }
    return false;
  }

  function recallAllBooksOnSharing() public returns (uint) {
    uint total = 0;
    if (address(0) != msg.sender) {
      uint length = _bookSharingStorage.getTotalBooksOnSharing();
      if (length > 0) {
        for (uint i = 1; i <= length; i++) {
          BookSharingStorage.BookSharing memory book = _bookSharingStorage
            .getBooksOnSharing(i);
          if (book.fromRenter == msg.sender && recallBooksOnSharing(i)) {
            total++;
          }
        }
      }
    }
    return total;
  }

  function convertBookOnSharingToBorrowedBook(
    uint idBooksOnSharing,
    uint amount
  ) public payable {
    _bookTemporary.convertBookOnSharingToBorrowedBook(
      idBooksOnSharing,
      msg.sender,
      amount
    );
  }
}
