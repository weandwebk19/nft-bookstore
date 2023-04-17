// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PurchasedBookStorage {
  struct PurchasedBook {
    uint256 listedId;
    address buyer;
    uint amount;
  }

  event PurchasedBookCreated(uint listedId, address buyer, uint amount);

  // Variable for Purchased Books
  mapping(address => mapping(uint => PurchasedBook))
    private _ownedPurchasedBooks;
  mapping(address => uint) private _totalOwnedPurchasedBook;

  function createPurchasedBook(
    uint listedId,
    address buyer,
    uint amount
  ) public {
    uint length = _totalOwnedPurchasedBook[buyer];
    if (length > 0) {
      _ownedPurchasedBooks[buyer][length] = PurchasedBook(
        listedId,
        buyer,
        amount
      );
    } else {
      _totalOwnedPurchasedBook[buyer] = 0;
      _ownedPurchasedBooks[buyer][0] = PurchasedBook(listedId, buyer, amount);
    }
    _totalOwnedPurchasedBook[buyer]++;
    emit PurchasedBookCreated(listedId, buyer, amount);
  }

  function getTotalOwnedPurchasedBook(
    address buyer
  ) public view returns (uint) {
    return _totalOwnedPurchasedBook[buyer];
  }

  function getOwnedPurchasedBooks(
    address owner
  ) public view returns (PurchasedBook[] memory) {
    uint ownedPurchasedBookCount = getTotalOwnedPurchasedBook(owner);
    PurchasedBook[] memory books = new PurchasedBook[](ownedPurchasedBookCount);

    uint currentIndex = 0;
    for (uint i = 0; i < ownedPurchasedBookCount; i++) {
      PurchasedBook memory book = _ownedPurchasedBooks[owner][i];
      if (book.listedId != 0 && book.buyer != address(0)) {
        books[i] = book;
        currentIndex++;
      }
    }

    return books;
  }
}
