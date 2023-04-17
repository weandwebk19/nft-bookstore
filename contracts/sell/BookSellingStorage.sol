// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

contract BookSellingStorage {
  using Counters for Counters.Counter;

  struct BookSelling {
    uint256 tokenId;
    address seller;
    address buyer;
    uint price;
    uint amount;
  }

  event BookSellingCreated(
    uint tokenId,
    address seller,
    address buyer,
    uint price,
    uint amount
  );

  // Variable for Listed Books
  mapping(uint => mapping(address => uint)) _allListedBook; // (tokenID -> (seller -> ID))
  mapping(address => uint) private _totalOwnedListedBook;
  mapping(uint => BookSelling) private _idToListedBook; // (ID -> BookSelling))
  Counters.Counter private _listedBooks;

    // Variable for Purchased Books
  mapping(address => mapping(uint => BookSelling)) private _ownedPurchasedBooks;
  mapping(address => uint) private _totalOwnedPurchasedBook;

  function isListed(uint tokenId, address seller) public view returns (bool) {
    uint idListedBook = getIdListedBook(tokenId, seller);
    if (idListedBook > 0) {
      return true;
    } else {
      return false;
    }
  }

  function getListedBook(
    uint tokenId,
    address seller
  ) public view returns (BookSelling memory) {
    uint idListedBook = getIdListedBook(tokenId, seller);
    return _idToListedBook[idListedBook];
  }

  function getListedBookById(
    uint idListedBook
  ) public view returns (BookSelling memory) {
    return _idToListedBook[idListedBook];
  }

  function getTotalOwnedListedBook(address seller) public view returns (uint) {
    return _totalOwnedListedBook[seller];
  }

  function _createBookSelling(
    uint tokenId,
    address seller,
    address buyer,
    uint256 price,
    uint amount
  ) private {
    if (buyer == address(0)) {
      _listedBooks.increment();
      _allListedBook[tokenId][seller] = _listedBooks.current();
      _idToListedBook[_listedBooks.current()] = BookSelling(
        tokenId,
        seller,
        buyer,
        price,
        amount
      );
      _totalOwnedListedBook[seller]++;
    } else {
      _totalOwnedPurchasedBook[buyer]++;
      uint length = _totalOwnedPurchasedBook[buyer];
      _ownedPurchasedBooks[buyer][length] = BookSelling(
        tokenId,
        seller,
        buyer,
        price,
        amount
      );
    }
    emit BookSellingCreated(tokenId, seller, buyer, price, amount);
  }

  // ===================================LISTING============================================

  function getIdListedBook(
    uint tokenId,
    address seller
  ) public view returns (uint) {
    require(
      tokenId != 0 && seller != address(0),
      "Token id and address of you is invalid"
    );
    return _allListedBook[tokenId][seller];
  }

  function getAmountOfListedBooks(
    uint256 tokenId,
    address owner
  ) public view returns (uint) {
    uint idListedBook = getIdListedBook(tokenId, owner);

    uint totalBook = 0;
    if (idListedBook != 0) {
      totalBook += _idToListedBook[idListedBook].amount;
    }

    return totalBook;
  }

  function sellListedBooks(
    uint256 tokenId,
    uint price,
    uint256 amount,
    address seller
  ) public payable {
    uint idListedBook = getIdListedBook(tokenId, seller);
    if (idListedBook == 0) {
      _createBookSelling(tokenId, seller, address(0), price, amount);
    } else if (idListedBook != 0) {
      BookSelling memory listedBook = _idToListedBook[idListedBook];
      _idToListedBook[idListedBook].amount += amount;

      // Update price of listed book if need
      if (price != listedBook.price) {
        _idToListedBook[idListedBook].price = price;
      }
    }
  }

  function _removeItemFromAllListedBooks(uint tokenId, address seller) private {
    uint idListedBook = getIdListedBook(tokenId, seller);
    uint lastIdListedBook = _listedBooks.current();
    BookSelling memory lastListedBook = _idToListedBook[lastIdListedBook];
    uint lastTokenId = lastListedBook.tokenId;
    address lastSeller = lastListedBook.seller;
    if (idListedBook != 0) {
      if (lastIdListedBook != idListedBook) {
        _allListedBook[lastTokenId][lastSeller] = idListedBook;
        _idToListedBook[idListedBook] = lastListedBook;
      }

      _listedBooks.decrement();
      _totalOwnedListedBook[seller]--;
      delete _allListedBook[tokenId][seller];
      delete _idToListedBook[lastIdListedBook];
    }
  }

  function updateListedBookFromSale(
    uint256 tokenId,
    uint newPrice,
    uint256 newAmount,
    address seller
  ) public {
    uint idListedBook = getIdListedBook(tokenId, seller);
    require(idListedBook != 0, "Your book are not on sale");

    _idToListedBook[idListedBook].price = newPrice;

    if (newAmount != 0) {
      _idToListedBook[idListedBook].amount = newAmount;
    } else {
      _removeItemFromAllListedBooks(tokenId, seller);
    }
  }

  function getAllListedBooks() public view returns (BookSelling[] memory) {
    BookSelling[] memory books = new BookSelling[](_listedBooks.current());

    for (uint i = 1; i <= _listedBooks.current(); i++) {
      BookSelling memory book = _idToListedBook[i];
      books[i - 1] = book;
    }

    return books;
  }

  function buyListedBooks(
    uint256 tokenId,
    address seller,
    uint256 amount,
    address buyer,
    uint256 value
  ) public payable returns (uint) {
    uint idListedBook = getIdListedBook(tokenId, seller);
    if (idListedBook != 0) {
      BookSelling memory listedBook = _idToListedBook[idListedBook];
      require(
        buyer != listedBook.seller,
        "You can't buy your own books on sale"
      );
      require(
        value == amount * listedBook.price,
        "Please submit the asking price"
      );
      require(amount <= listedBook.amount && amount > 0, "Amount is invalid");

      uint256 totalPrice = amount * listedBook.price;
      
      updateListedBookFromSale(
        tokenId,
        listedBook.price,
        listedBook.amount - amount,
        seller
      );
      _createBookSelling(tokenId, seller, buyer, listedBook.price, amount);

      return totalPrice;
    }

    return 0;
  }

  function getTotalOwnedPurchasedBook(
    address buyer
  ) public view returns (uint) {
    return _totalOwnedPurchasedBook[buyer];
  }

  function getOwnedPurchasedBooks(
    address owner
  ) public view returns (BookSelling[] memory) {
    uint ownedPurchasedBookCount = getTotalOwnedPurchasedBook(owner);
    BookSelling[] memory books = new BookSelling[](ownedPurchasedBookCount);

    uint currentIndex = 0;
    for (uint i = 1; i <= ownedPurchasedBookCount; i++) {
      BookSelling memory book = _ownedPurchasedBooks[owner][i];
      if (book.tokenId != 0 && book.buyer == owner) {
        books[currentIndex] = book;
        currentIndex++;
      }
    }

    return books;
  }
}
