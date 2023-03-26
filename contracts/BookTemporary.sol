// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Timelock.sol";
import "./ExtendTime.sol";
import "./SharedBookStorage.sol";


contract BookTemporary is TimeLock, ExtendTime, SharedBookStorage {
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

  function isRented(uint tokenId) public view returns (bool) {
    uint idRentedBook = getIdRentedBook(tokenId, msg.sender);
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

  function getRentedBookFromId(uint id) public view returns (RentedBook memory) {
    return _idToRentedBook[id];
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

  function getBorrowedBookFromId(uint id) 
                           public view returns (BorrowedBook memory) {
    return _idToBorrowedBook[id];
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

  function leaseRentedBooks(uint256 tokenId, 
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

  // Only update time 
  function _updateBorrowedBookFromBorrowing(uint idBorrowedBook,
                                            uint newStartTime,
                                            uint newEndTime) private {
    _idToBorrowedBook[idBorrowedBook].startTime = newStartTime;
    _idToBorrowedBook[idBorrowedBook].endTime = newEndTime;

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
     
    return _update(txId,
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
    _queue(renter,
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

  function requestExtendTimeOfBorrowedBooks(uint256 tokenId,
                                            address renter,
                                            uint extendedTime,
                                            address borrower) public {
    uint id = getIdBorrowedBook(tokenId, renter, borrower);
    require(id != 0, "This borrowed book does not exist");
    _createRequest(id, extendedTime, borrower, renter);                     
  }

  function updateRequestExtendTimeOfBorrowedBooks(uint256 tokenId,
                                                  address renter,
                                                  uint newExtendedTime,
                                                  address borrower) public {
    uint id = getIdBorrowedBook(tokenId, renter, borrower);
    require(id != 0, "This borrowed book does not exist");
    _updateTimeOfRequest(id, newExtendedTime, borrower, renter);
  }

  function doAcceptRequestAndCreateResponse(uint id, 
                                            address borrower, 
                                            address renter,
                                            bool isAccept) public returns(bool) {
    require(id != 0,
          "Your book are not on borrowing");
    require(_idToBorrowedBook[id].borrower == borrower,
          "Address of borrower invalid");                      
    require(_idToBorrowedBook[id].renter == renter,
          "Address of renter invalid");

    // If the owner approves the request, it set status of request isAccept is true and return extended time,
    // otherwise, this request will be deleted.
    uint extendTime = getExtendedTimeOfRequest(id, borrower, renter);
    if (isAccept) {

      if (extendTime == 0) {
        return false;
      }

      _setAcceptionForRequest(id, borrower, renter);
      _createResponse(id, extendTime, renter, borrower);

    } else {
      _cancelRequest(id, borrower, renter);
    }

    return isAccept;

  }

  function transferForSendedRequest(uint id, 
                                    address renter, 
                                    address borrower,
                                    uint currentTime, 
                                    bool isExtend) public payable returns(uint) {
    require(isResponseExist(id, renter, borrower), "You do not have this response");
    require(isAcceptRequest(id, borrower, renter), "Request is invalid for transfer");
    uint extendTime = 0;
    // Agree to pay for this transaction
    if (isExtend) {
      extendTime = getExtendedTimeOfRequest(id, borrower, renter);
      uint startTime = currentTime;
      uint endTime;

      //======|==============|================|==========
      //  BB.startTime    current Time     BB.endTime
      if(currentTime <= _idToBorrowedBook[id].endTime) {
        endTime = _idToBorrowedBook[id].endTime + extendTime;
      } else {
        endTime = currentTime + extendTime;
      }

      _updateBorrowedBookFromBorrowing(id, startTime, endTime);
    }
    // Cancle Req + Res for this transaction
    _cancelRequest(id, borrower, renter);
    _cancelResponse(id, renter, borrower);
    uint totalPrice = _idToBorrowedBook[id].price *
                     _idToBorrowedBook[id].amount * 
                     extendTime / 604800;
    return totalPrice;
  }


  function getAllBorrowedBooks() public view returns (BorrowedBook[] memory) {
    BorrowedBook[] memory books;
    if (_borrowedBooks.current() > 0) {
      books = new BorrowedBook[](_borrowedBooks.current());

      for (uint i = 1; i <= _borrowedBooks.current(); i++) {
        BorrowedBook memory book = _idToBorrowedBook[i];
        books[i - 1] = book;
      }
    }

    return books;
  }


  // Return Borrowed Books to Renter (or Owner)

  function _recallBorrowedBooks(uint tokenId, 
                               address renter, 
                               address borrower) private returns(bool) {
    BorrowedBook memory borrowedBook = getBorrowedBook(tokenId, renter, borrower);
    uint idBorrowedBook = getIdBorrowedBook(tokenId, renter, borrower);

    if(borrowedBook.tokenId != 0) {
      _removeItemFromAllBorrowedBooks(tokenId, renter, borrower);

      // uint idBookOnSharing = getIdBookOnSharing(idBorrowedBook, borrowedBook.borrower);
      // if (idBookOnSharing != 0) {
      //   removeBooksOnSharing(idBorrowedBook, borrowedBook.borrower);
      // }

      // uint idSharedBook = getIdSharedBook(idBorrowedBook, borrowedBook.borrower);
      // if (idSharedBook != 0) {
      //   SharedBook memory sharedBook = getSharedBooks(idSharedBook);
      //   removeSharedBooks(idBorrowedBook, sharedBook.sharedPer);
      // }

      // Remove respone of borrowed books on extending if needed
      if(idBorrowedBook != 0) {
        if (isResponseExist(idBorrowedBook, renter, borrower)) {
          _cancelResponse(idBorrowedBook, renter, borrower);
        }
      }

      return true;
    }
    return false;
  }

  function excRecallBorrowedBooks(uint tokenId, 
                                  address renter, 
                                  address borrower,
                                  uint endTime) public returns(bool) {
    bytes memory data = abi.encodePacked(tokenId, renter, borrower);
    string memory func = "_recallBorrowedBooks(uint,address,address)";
    uint value = 0;
    if (isExecute(renter, value, func, data, endTime)) {
      return _recallBorrowedBooks(tokenId, renter, borrower);
    }

    return false;
  }

  function excRecallAllBorrowedBooks(address renter) public returns(uint) {
    uint total = 0;
    if (_borrowedBooks.current() > 0) {

      for (uint i = 1; i <= _borrowedBooks.current(); i++) {
        BorrowedBook memory book = _idToBorrowedBook[i];
        if (book.renter == renter && 
            excRecallBorrowedBooks(book.tokenId,
                                   book.renter, 
                                   book.borrower, 
                                   book.endTime)) {

          total++;     

        }
      }
    }
    return total;
  }

  function getAmountOAllfBooksOnSharing(uint tokenId, address owner) public view returns(uint) {
    uint idBorrowedBook;
    uint totalBook = 0;

    for(uint i = 1; i <= _borrowedBooks.current(); i++) {
      BorrowedBook memory book = _idToBorrowedBook[i];
      if (book.borrower == owner && book.tokenId == tokenId) {
        idBorrowedBook = getIdBorrowedBook(tokenId, book.renter, owner);
        totalBook += getAmountOfBooksOnSharing(idBorrowedBook, owner);
      }
    }
     
    return totalBook;
  }

  function getAmountOAllfSharedBooks(uint tokenId, address owner) public view returns(uint) {
    uint idBorrowedBook;
    uint totalBook = 0;

    for(uint i = 1; i <= _borrowedBooks.current(); i++) {
      BorrowedBook memory book = _idToBorrowedBook[i];
      if (book.tokenId == tokenId) {
        idBorrowedBook = getIdBorrowedBook(tokenId, book.renter, book.borrower);
        totalBook += getAmountOfSharedBooks(idBorrowedBook, owner);
      }
    }
     
    return totalBook;
  }

  function takeBooksOnSharingAndUpdateBorrowedBook(uint idBorrowedBook, 
                                                   address sharer, 
                                                   address sender,
                                                   uint amount) public payable returns(uint) {
    
    uint price = takeBooksOnSharing(idBorrowedBook, sharer, sender, amount);


    BorrowedBook memory borrowedBook = getBorrowedBookFromId(idBorrowedBook);
    if (_idToBorrowedBook[idBorrowedBook].amount == 0) {
      _removeItemFromAllBorrowedBooks(borrowedBook.tokenId, 
                                      borrowedBook.renter, 
                                      borrowedBook.borrower);
    } else {
      _idToBorrowedBook[idBorrowedBook].amount -= amount;
      _amountOwnedBorrowedBooks[sharer][borrowedBook.tokenId] -= amount;
    }
    return price;
  }

}