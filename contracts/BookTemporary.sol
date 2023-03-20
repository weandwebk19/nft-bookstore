// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Timelock.sol";


contract BookTemporary is TimeLock {
  using Counters for Counters.Counter;

  struct RentedBook {
    uint256 tokenId;
    address renter;
    uint price; // ETH/book/1week
    uint amount;
  }

  struct BorrowedBook {
    uint256 tokenId;
    address renter;
    address borrower;
    uint price;
    uint amount;
    uint startTime;
    uint endTime;
  }

  event RentedBookCreated (
    uint tokenId,
    address renter,
    uint price,
    uint amount
  );

  event BorrowedBookCreated (
    uint tokenId,
    address renter,
    address borrower,
    uint price,
    uint amount,
    uint startTime,
    uint endTime
  );

  // Variable for Rented Books
  mapping (uint => mapping (address => uint)) _allRentedBook; // (tokenID -> (renter -> ID))
  mapping(address => uint) private _totalOwnedRentedBook;
  mapping(uint => RentedBook) private _idToRentedBook; // (ID -> RentedBook))
  Counters.Counter private _rentedBooks;

  // These variables will manage which books are borrowed
  // (tokenID -> (renter -> (borrower -> ID)))
  mapping (uint => mapping(address => mapping (address => uint))) _allBorrowedBook; 
  mapping(address => uint) private _totalOwnedBorrowedBook;
  // Borrower => (tokenId => amount)
  mapping(address => mapping(uint => uint)) private _amountOwnedBorrowedBooks;
  mapping(uint => BorrowedBook) private _idToBorrowedBook; // (ID -> BorrowedBook))
  Counters.Counter private _borrowedBooks;

 function isRented(uint tokenId, address renter) public view returns (bool) {
    uint idRentedBook = getIdRentedBook(tokenId, renter);
    if(idRentedBook > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  function getRentedBook(uint tokenId, address renter) public view returns (RentedBook memory) {
    uint idRentedBook = getIdRentedBook(tokenId, renter);
    return _idToRentedBook[idRentedBook];
  }

  function getTotalOwnedRentedBook(address renter) public view returns(uint) {
    return _totalOwnedRentedBook[renter];
  }

  function _createRentedBook(uint tokenId, address renter, uint256 price, uint amount) private {
    _rentedBooks.increment();
    _allRentedBook[tokenId][renter] = _rentedBooks.current();
    _idToRentedBook[_rentedBooks.current()] = RentedBook(tokenId, renter, price, amount);
    _totalOwnedRentedBook[renter]++;
    emit RentedBookCreated(tokenId, renter, price, amount);
  }

  function getBorrowedBook(uint tokenId, 
                           address renter,
                           address borrower) 
  public view returns (BorrowedBook memory) {
    uint idBorrowedBook = getIdBorrowedBook(tokenId, renter, borrower);
    return _idToBorrowedBook[idBorrowedBook];
  }

  function getTotalOwnedBorrowedBook(address borrower) public view returns(uint) {
    return _totalOwnedBorrowedBook[borrower];
  }

  function _createBorrowedBook(uint tokenId, 
                             address renter, 
                             uint256 price, 
                             uint amount,
                             uint startTime,
                             uint endTime,
                             address borrower) private {
    _borrowedBooks.increment();
    _allBorrowedBook[tokenId][renter][borrower] = _borrowedBooks.current();
    _idToBorrowedBook[_borrowedBooks.current()] = BorrowedBook(tokenId,
                                                               renter,
                                                               borrower,
                                                               price, 
                                                               amount, 
                                                               startTime, 
                                                               endTime);
    _totalOwnedBorrowedBook[borrower]++;
    _amountOwnedBorrowedBooks[borrower][tokenId] += amount;
    emit BorrowedBookCreated(tokenId,
                           renter,
                           borrower, 
                           price, 
                           amount, 
                           startTime, 
                           endTime);
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
                                      address renter) public {
    uint idRentedBook = getIdRentedBook(tokenId, renter);
    require(idRentedBook != 0,
          "Your book are not on sale");

    _idToRentedBook[idRentedBook].price = newPrice;

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
                           uint256 amount
                          ) public payable {

    uint idRentedBook = getIdRentedBook(tokenId, renter);
    if (idRentedBook == 0) {
      if (amount > 0) {
        _createRentedBook(tokenId, renter, price, amount);
      }
    } else {
      updateRentedBookFromRenting(tokenId, price, amount, renter);
    }
  }

  // ===================================Borrowing============================================

  function getIdBorrowedBook(uint tokenId, address renter, address borrower) public view returns(uint) {
    require(tokenId != 0 &&
            borrower != address(0) &&
            renter != address(0), 
            "Token id and address of you is invalid");
    return _allBorrowedBook[tokenId][renter][borrower];
  }

  function _removeItemFromAllBorrowedBooks(uint tokenId, address renter, address borrower) private {
    uint idBorrowedBook = getIdBorrowedBook(tokenId, renter, borrower);
    uint lastIdBorrowedBook = _borrowedBooks.current();
    BorrowedBook memory lastBorrowedBook = _idToBorrowedBook[lastIdBorrowedBook];
    BorrowedBook memory borrowedBook = _idToBorrowedBook[idBorrowedBook];
    uint lastTokenId = lastBorrowedBook.tokenId;
    address lastRenter = lastBorrowedBook.renter;
    address lastBorrower = lastBorrowedBook.renter;
    if (idBorrowedBook != 0) {
      if (lastIdBorrowedBook != idBorrowedBook) {
        _allBorrowedBook[lastTokenId][lastRenter][lastBorrower] = idBorrowedBook;
        _idToBorrowedBook[idBorrowedBook] = lastBorrowedBook;
      }

      _borrowedBooks.decrement();
      _totalOwnedBorrowedBook[borrower]--;
      _amountOwnedBorrowedBooks[borrower][tokenId] -= borrowedBook.amount;
      delete _allBorrowedBook[tokenId][renter][borrower];
      delete _idToBorrowedBook[lastIdBorrowedBook];
    }
  }


  function _updateBorrowedBookFromBorrowing(uint256 tokenId,
                                      address renter,
                                      address borrower,
                                      uint newPrice,
                                      uint256 newAmount,
                                      uint newStartTime,
                                      uint newEndTime) private {
    uint idBorrowedBook = getIdBorrowedBook(tokenId, renter, borrower);
    require(idBorrowedBook != 0,
          "Your book are not on sale");
    require(_idToBorrowedBook[idBorrowedBook].renter == renter,
          "Addredd of renter invalid");
    
    _idToBorrowedBook[idBorrowedBook].price = newPrice;
    _idToBorrowedBook[idBorrowedBook].startTime = newStartTime;
    _idToBorrowedBook[idBorrowedBook].endTime = newEndTime;

    if (newAmount != 0) {
      uint balance = newAmount - _idToBorrowedBook[idBorrowedBook].amount;
      _idToBorrowedBook[idBorrowedBook].amount = newAmount;
      _amountOwnedBorrowedBooks[borrower][tokenId] += balance;
    } else {
      _removeItemFromAllBorrowedBooks(tokenId, renter, borrower);
    }
  }


  function getAmountOfBorrowedBooks(uint256 tokenId, address owner) public view returns(uint) {
    return _amountOwnedBorrowedBooks[owner][tokenId];
  }

  function getOwnedBorrowedBooks(address borrower) public view returns(BorrowedBook[] memory) {
    uint totalBorrowedBook = _totalOwnedBorrowedBook[borrower];
    BorrowedBook[] memory borrowedBooks = new BorrowedBook[](totalBorrowedBook);

    uint currentIndex = 0;
    for(uint i = 1; i <= _borrowedBooks.current(); i++) {
      BorrowedBook memory book = _idToBorrowedBook[i];
      if (book.borrower == borrower) {
        borrowedBooks[currentIndex] = book;
        currentIndex++;
      }
    }

    return borrowedBooks;
  }

  function _updateTimelock(uint tokenId,
                           uint value, 
                           address renter, 
                           address borrower, 
                           uint endTime) private returns(bool) {
    bytes32 txId = getTxId(renter,
                           value, 
                           "_recallBorrowedBooks(uint,address,address)", 
                           abi.encodePacked(tokenId,renter,borrower), 
                           endTime);
     
    return update(txId,
                  renter,
                  value, 
                  "_recallBorrowedBooks(uint,address,address)", 
                  abi.encodePacked(tokenId, renter, borrower), 
                  endTime);
  
  }

  function _queueTimelock(uint tokenId,
                          uint value, 
                          address renter, 
                          address borrower, 
                          uint endTime) private {
    queue(renter,
          value, 
          "_recallBorrowedBooks(uint,address,address)", 
          abi.encodePacked(tokenId, renter, borrower), 
          endTime);
  }

  function borrowRentedBooks(uint256 tokenId,
                            address renter,
                            uint256 amount,
                            uint256 price,
                            uint startTime,
                            uint endTime,
                            address borrower,
                            uint256 value) public payable returns(uint256) {
                             
    uint idRentedBook = getIdRentedBook(tokenId, renter);
    if(idRentedBook != 0) {
        uint totalPrice = amount * price * (endTime - startTime) / 604800;
        require(value == totalPrice, "Value is not Valid");
        RentedBook memory rentedBook = getRentedBook(tokenId, renter);
        require(amount <= rentedBook.amount && amount > 0,
              "Amount of Rented Book is invalid");
        _queueTimelock(tokenId, 0, renter, borrower, endTime);
        _createBorrowedBook(tokenId,
                            renter,
                            price, 
                            amount, 
                            startTime, 
                            endTime, 
                            borrower);
        updateRentedBookFromRenting(tokenId,
                                    rentedBook.price,
                                    rentedBook.amount - amount,
                                    renter);

        return totalPrice;
    }
    return 0;
  }


  // function extendTimeOfBorrowedBooks(uint256 tokenId,
  //                           address renter,
  //                           uint256 amount,
  //                           uint256 price,
  //                           uint startTime,
  //                           uint endTime,
  //                           address borrower,
  //                           uint256 value) public payable returns(uint256) {

  // }

  function getAllBorrowedBooks() public view returns (BorrowedBook[] memory) {
    BorrowedBook[] memory books = new BorrowedBook[](_borrowedBooks.current());

    for (uint i = 1; i <= _borrowedBooks.current(); i++) {
      BorrowedBook memory book = _idToBorrowedBook[i];
      books[i - 1] = book;
    }

    return books;
  }


  // Return Borrowed Books to Renter (or Owner)

  function _recallBorrowedBooks(uint tokenId, 
                               address renter, 
                               address borrower) private {
    BorrowedBook memory borrowedBook = getBorrowedBook(tokenId, renter, borrower);

    if(borrowedBook.tokenId != 0) {
      _removeItemFromAllBorrowedBooks(tokenId, renter, borrower);
    }
  }

  function excRecallBorrowedBooks(uint tokenId, 
                                  address renter, 
                                  address borrower,
                                  uint endTime) public {
    bytes memory data = abi.encodePacked(tokenId, renter, borrower);
    string memory func = "_recallBorrowedBooks(uint,address,address)";
    uint value = 0;
    execute(renter, value, func, data, endTime);
    _recallBorrowedBooks(tokenId, renter, borrower);

  }

}