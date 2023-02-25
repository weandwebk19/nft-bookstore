// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

contract RentedBookStorage {
  using Counters for Counters.Counter;

  struct RentedBook {
    uint256 tokenId;
    address renter;
    uint price;
    uint amount;
    uint startTime;
    uint rentalDuration;
  }

  event RentedBookCreated (
    uint tokenId,
    address renter,
    uint price,
    uint amount,
    uint startTime,
    uint rentalDuration
  );


  // Variable for Rented Books
  mapping (uint => mapping (address => uint)) _allRentedBook; // (tokenID -> (renter -> ID))
  mapping(address => uint) private _totalOwnedRentedBook;
  mapping(uint => RentedBook) private _idToRentedBook; // (ID -> RentedBook))
  Counters.Counter private _rentedBooks;

  function getRentedBook(uint tokenId, address seller) public view returns (RentedBook memory) {
    uint idRentedBook = getIdRentedBook(tokenId, seller);
    return _idToRentedBook[idRentedBook];
  }

  function getTotalOwnedRentedBook(address renter) public view returns(uint) {
    return _totalOwnedRentedBook[renter];
  }

  function _createRentedBook(uint tokenId, address renter, uint256 price, uint amount, uint rentalDuration) private {
    _rentedBooks.increment();
    _allRentedBook[tokenId][renter] = _rentedBooks.current();
    _idToRentedBook[_rentedBooks.current()] = RentedBook(tokenId, renter, price, amount, 0, rentalDuration);
    _totalOwnedRentedBook[renter]++;
    emit RentedBookCreated(tokenId, renter, price, amount, 0, rentalDuration);
  }

  // ===================================RENTING============================================

  function getIdRentedBook(uint tokenId, address renter) public view returns(uint) {
    require(tokenId != 0 && renter != address(0), "Token id and address of you is invalid");
    return _allRentedBook[tokenId][renter];
  }

  function getAmountOfRentedBooks(uint256 tokenId, address owner) public view returns(uint) {
    uint idRentedBook = getIdRentedBook(tokenId, owner);

    uint totalBook = 0;
    if (idRentedBook != 0) {
      totalBook +=_idToRentedBook[idRentedBook].amount;
    }
    
    return totalBook;
  }

  function _removeItemFromAllRentedBooks(uint tokenId, address renter) private {
    uint idRentedBook = getIdRentedBook(tokenId, renter);
    uint lastIdRentedBook = _rentedBooks.current();
    RentedBook memory lastRentedBook = _idToRentedBook[lastIdRentedBook];
    uint lastTokenId = lastRentedBook.tokenId;
    address lastRenter = lastRentedBook.renter;
    if (idRentedBook != 0) {
      if (lastIdRentedBook != idRentedBook) {
        _allRentedBook[lastTokenId][lastRenter] = idRentedBook;
        _idToRentedBook[idRentedBook] = lastRentedBook;
      }

      _rentedBooks.decrement();
      _totalOwnedRentedBook[renter]--;
      delete _allRentedBook[tokenId][renter];
      delete _idToRentedBook[lastIdRentedBook];
    }
  }

  function updateRentedBookFromRenting(uint256 tokenId,
                                      uint newPrice,
                                      uint256 newAmount,
                                      uint newStartTime,
                                      uint newRentalDuration,
                                      address renter) public {
    uint idRentedBook = getIdRentedBook(tokenId, renter);
    require(idRentedBook != 0,
          "Your book are not on sale");

    _idToRentedBook[idRentedBook].price = newPrice;
    _idToRentedBook[idRentedBook].startTime = newStartTime;
    _idToRentedBook[idRentedBook].rentalDuration = newRentalDuration;

    if (newAmount != 0) {
      _idToRentedBook[idRentedBook].amount = newAmount;
    } else {
      _removeItemFromAllRentedBooks(tokenId, renter);
    }
  }

  function getAllRentedBooks() public view returns (RentedBook[] memory) {
    RentedBook[] memory books = new RentedBook[](_rentedBooks.current());

    for (uint i = 1; i <= _rentedBooks.current(); i++) {
      RentedBook memory book = _idToRentedBook[i];
      books[i - 1] = book;
    }

    return books;
  }

  function rentRentedBooks(uint256 tokenId, 
                           address renter,
                           uint price,
                           uint256 amount,
                          uint rentalDuration) public payable {

    uint idRentedBook = getIdRentedBook(tokenId, renter);
    if (idRentedBook == 0) {
      if (amount > 0) {
        _createRentedBook(tokenId, renter, price, amount, rentalDuration);
      }
    } else {
      RentedBook memory rentedBook = _idToRentedBook[idRentedBook];
      _idToRentedBook[idRentedBook].amount += amount;

      // Update price of Rented book if need
      if (price != rentedBook.price) {
        _idToRentedBook[idRentedBook].price = price;
      }

      // Update rental duration of Rented book if need
      if (rentalDuration != rentedBook.rentalDuration) {
        _idToRentedBook[idRentedBook].rentalDuration = rentalDuration;
      }

    }
  }

  // This function is incomplete

  // function borrowRentedBooks(uint256 tokenId,
  //                           address renter,
  //                           uint256 amount,
  //                           address borrower,
  //                           uint startTime,
  //                           uint rentalDuration,
  //                           uint256 value) public payable returns(uint) {
                             
  //   uint idRentedBook = getIdRentedBook(tokenId, renter);
  //   if (idRentedBook != 0) {
  //     RentedBook memory rentedBook = _idToRentedBook[idRentedBook];
  //     require(borrower != rentedBook.renter, "You can't borrower your own books on sale");
  //     require(value == amount * rentedBook.price, "Please submit the asking price");
  //     require(amount <= rentedBook.amount && amount > 0, "Amount is invalid");

  //     uint256 totalPrice = amount * rentedBook.price;

  //     updateRentedBookFromRenting(tokenId, 
  //                             rentedBook.price,
  //                             rentedBook.amount - amount,
  //                             startTime,
  //                             rentalDuration,
  //                             renter);

  //     return totalPrice;
  //   }

  //   return 0;
  // }

}