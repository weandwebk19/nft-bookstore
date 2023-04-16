// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./utils/Error.sol";
import "./rent/BookRentingStorage.sol";
import "./share/BookSharingStorage.sol";

contract BookTemporary {
  BookRentingStorage private _bookRentingStorage;
  BookSharingStorage private _bookSharingStorage;

  constructor(
    BookRentingStorage bookRentingStorage,
    BookSharingStorage bookSharingStorage
  ) {
    _bookRentingStorage = bookRentingStorage;
    _bookSharingStorage = bookSharingStorage;
  }

  function getBookRentingStorage() public view returns (BookRentingStorage) {
    return _bookRentingStorage;
  }

  function getBookSharingStorage() public view returns (BookSharingStorage) {
    return _bookSharingStorage;
  }

  function getAmountOfAllTypeBooksInTemporary(
    uint256 tokenId, 
    address owner
  ) public view returns (uint) {
    return _bookRentingStorage.getAmountOfLeaseBooks(tokenId, owner) +
           _bookSharingStorage.getAmountOfAllSharedBooks(tokenId, owner) +
           _bookSharingStorage.getAmountOfAllBooksOnSharing(tokenId, owner) +
           _bookRentingStorage.getAmountOfBorrowedBooks(tokenId, owner);
  }

  function getAmountOfUnsalableBooksInTemporary(
    uint256 tokenId, 
    address owner
  ) public view returns (uint) {
    return _bookSharingStorage.getAmountOfAllSharedBooks(tokenId, owner) +
           _bookSharingStorage.getAmountOfAllBooksOnSharing(tokenId, owner) +
           _bookRentingStorage.getAmountOfBorrowedBooks(tokenId, owner);
  }

  function convertBookOnSharingToBorrowedBook(
    uint idBookOnSharing,
    address owner,
    uint amount
  ) public payable {
    BookSharingStorage.BookSharing memory booksOnSharing = _bookSharingStorage
      .getBooksOnSharing(idBookOnSharing);

    if (booksOnSharing.sharer != owner) {
      revert Error.InvalidAddressError(owner);
    }
    if (booksOnSharing.amount < amount) {
      revert Error.InvalidAmountError(amount);
    }

    if (amount == booksOnSharing.amount) {
      _bookSharingStorage.removeBooksOnSharing(
        booksOnSharing.tokenId,
        booksOnSharing.fromRenter,
        booksOnSharing.sharer,
        booksOnSharing.startTime,
        booksOnSharing.endTime
      );
    } else {
      _bookSharingStorage.updateBooksOnSharing(
        idBookOnSharing,
        owner,
        booksOnSharing.tokenId,
        booksOnSharing.price,
        booksOnSharing.amount - amount
      );
    }

    uint idBorrowedBook = _bookRentingStorage.getIdBorrowedBook(
      booksOnSharing.tokenId,
      booksOnSharing.fromRenter,
      owner,
      booksOnSharing.startTime,
      booksOnSharing.endTime
    );
    if (idBorrowedBook == 0) {
      _bookRentingStorage.createBorrowedBook(
        booksOnSharing.tokenId,
        booksOnSharing.fromRenter,
        booksOnSharing.priceOfBB,
        amount,
        booksOnSharing.startTime,
        booksOnSharing.endTime,
        owner
      );
    } else {
      _bookRentingStorage.updateAmountBorrowedBookFromBorrowing(
        idBorrowedBook,
        amount,
        false
      );
    }
  }
  
}
