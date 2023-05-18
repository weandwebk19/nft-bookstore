// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

import "../utils/Timelock.sol";
import "../utils/ExtendTime.sol";
import "../utils/Error.sol";

contract BookRentingStorage is ExtendTime {
  using Counters for Counters.Counter;

  struct LendBook {
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

  event LendBookCreated(uint tokenId, address renter, uint price, uint amount);

  event BorrowedBookCreated(
    uint tokenId,
    address renter,
    address borrower,
    uint price,
    uint amount,
    uint startTime,
    uint endTime
  );

  TimeLock private _timelock;

  // Variable for Lend Books
  mapping(uint => mapping(address => uint)) _allLendBook; // (tokenID -> (renter -> ID))
  mapping(address => uint) private _totalOwnedLendBook;
  mapping(uint => LendBook) private _idToLendBook; // (ID -> LendBook))
  Counters.Counter private _lendBooks;

  // These variables will manage which books are borrowed
  // hashId -> id BorrowedBook
  // hashId = hash(tokenId, renter, borrower, startTime, endTime)
  mapping(bytes32 => uint) _allBorrowedBook;
  mapping(address => uint) private _totalOwnedBorrowedBook;
  // Borrower => (tokenId => amount)
  mapping(address => mapping(uint => uint)) private _amountOwnedBorrowedBooks;
  mapping(uint => BorrowedBook) private _idToBorrowedBook; // (ID -> BorrowedBook))
  Counters.Counter private _borrowedBooks;

  constructor(TimeLock timelock) {
    _timelock = timelock;
  }

  // ===================================L============================================
  function isLending(uint tokenId, address renter) public view returns (bool) {
    uint idLendBook = getIdLendBook(tokenId, renter);
    if (idLendBook > 0) {
      return true;
    } else {
      return false;
    }
  }

  function getLendBook(
    uint tokenId,
    address renter
  ) public view returns (LendBook memory) {
    uint idLendBook = getIdLendBook(tokenId, renter);
    return _idToLendBook[idLendBook];
  }

  function getLendBookFromId(uint id) public view returns (LendBook memory) {
    return _idToLendBook[id];
  }

  function getTotalOwnedLendBook(address renter) public view returns (uint) {
    return _totalOwnedLendBook[renter];
  }

  function _createLendBook(
    uint tokenId,
    address renter,
    uint256 price,
    uint amount
  ) private {
    _lendBooks.increment();
    _allLendBook[tokenId][renter] = _lendBooks.current();
    _idToLendBook[_lendBooks.current()] = LendBook(
      tokenId,
      renter,
      price,
      amount
    );
    _totalOwnedLendBook[renter]++;
    emit LendBookCreated(tokenId, renter, price, amount);
  }

  function getIdLendBook(
    uint tokenId,
    address renter
  ) public view returns (uint) {
    if (tokenId == 0 || renter == address(0)) {
      revert Error.InvalidParamsError();
    }
    return _allLendBook[tokenId][renter];
  }

  function getAmountOfLendBooks(
    uint256 tokenId,
    address owner
  ) public view returns (uint) {
    uint idLendBook = getIdLendBook(tokenId, owner);

    uint totalBook = 0;
    if (idLendBook != 0) {
      totalBook += _idToLendBook[idLendBook].amount;
    }

    return totalBook;
  }

  function _removeItemFromAllLendBooks(uint tokenId, address renter) private {
    uint idLendBook = getIdLendBook(tokenId, renter);
    uint lastIdLendBook = _lendBooks.current();
    LendBook memory lastLendBook = _idToLendBook[lastIdLendBook];
    uint lastTokenId = lastLendBook.tokenId;
    address lastRenter = lastLendBook.renter;
    if (idLendBook != 0) {
      if (lastIdLendBook != idLendBook) {
        _allLendBook[lastTokenId][lastRenter] = idLendBook;
        _idToLendBook[idLendBook] = lastLendBook;
      }

      _lendBooks.decrement();
      _totalOwnedLendBook[renter]--;
      delete _allLendBook[tokenId][renter];
      delete _idToLendBook[lastIdLendBook];
    }
  }

  function updateLendBookFromRenting(
    uint256 tokenId,
    uint newPrice,
    uint256 newAmount,
    address renter
  ) public {
    uint idLendBook = getIdLendBook(tokenId, renter);
    if (idLendBook == 0) {
      revert Error.InvalidIdError(idLendBook);
    }

    _idToLendBook[idLendBook].price = newPrice;

    if (newAmount != 0) {
      _idToLendBook[idLendBook].amount = newAmount;
    } else {
      _removeItemFromAllLendBooks(tokenId, renter);
    }
  }

  function getAllLendBooks() public view returns (LendBook[] memory) {
    LendBook[] memory books = new LendBook[](_lendBooks.current());

    for (uint i = 1; i <= _lendBooks.current(); i++) {
      LendBook memory book = _idToLendBook[i];
      books[i - 1] = book;
    }

    return books;
  }

  function lendBooks(
    uint256 tokenId,
    address renter,
    uint price,
    uint256 amount
  ) public payable {
    uint idLendBook = getIdLendBook(tokenId, renter);
    if (idLendBook == 0) {
      if (amount > 0) {
        _createLendBook(tokenId, renter, price, amount);
      }
    } else {
      updateLendBookFromRenting(tokenId, price, amount, renter);
    }
  }

  // ===================================Borrowing============================================
  function getTotalBorrowedBooksOnBorrowing() public view returns (uint) {
    return _borrowedBooks.current();
  }

  function getHashIdForBorrowedBook(
    uint tokenId,
    address renter,
    address borrower,
    uint startTime,
    uint endTime
  ) public pure returns (bytes32) {
    return keccak256(abi.encode(tokenId, renter, borrower, startTime, endTime));
  }

  function getBorrowedBook(
    uint tokenId,
    address renter,
    address borrower,
    uint startTime,
    uint endTime
  ) public view returns (BorrowedBook memory) {
    uint idBorrowedBook = getIdBorrowedBook(
      tokenId,
      renter,
      borrower,
      startTime,
      endTime
    );
    return _idToBorrowedBook[idBorrowedBook];
  }

  function getBorrowedBookFromId(
    uint id
  ) public view returns (BorrowedBook memory) {
    return _idToBorrowedBook[id];
  }

  function getTotalOwnedBorrowedBook(
    address borrower
  ) public view returns (uint) {
    return _totalOwnedBorrowedBook[borrower];
  }

  function createBorrowedBook(
    uint tokenId,
    address renter,
    uint256 price,
    uint amount,
    uint startTime,
    uint endTime,
    address borrower
  ) public {
    bytes32 hashId = getHashIdForBorrowedBook(
      tokenId,
      renter,
      borrower,
      startTime,
      endTime
    );
    if (_allBorrowedBook[hashId] != 0) {
      revert Error.InvalidIdError(_allBorrowedBook[hashId]);
    }
    _borrowedBooks.increment();
    _allBorrowedBook[hashId] = _borrowedBooks.current();
    _idToBorrowedBook[_borrowedBooks.current()] = BorrowedBook(
      tokenId,
      renter,
      borrower,
      price,
      amount,
      startTime,
      endTime
    );
    _totalOwnedBorrowedBook[borrower]++;
    _amountOwnedBorrowedBooks[borrower][tokenId] += amount;
    _timelock.queue(
      renter,
      0,
      "_recallBorrowedBooks(uint)",
      abi.encodePacked(_borrowedBooks.current()),
      endTime
    );
    emit BorrowedBookCreated(
      tokenId,
      renter,
      borrower,
      price,
      amount,
      startTime,
      endTime
    );
  }

  function getIdBorrowedBook(
    uint tokenId,
    address renter,
    address borrower,
    uint startTime,
    uint endTime
  ) public view returns (uint) {
    if (
      tokenId == 0 ||
      borrower == address(0) ||
      renter == address(0) ||
      startTime == 0 ||
      endTime <= startTime
    ) {
      revert Error.InvalidParamsError();
    }

    bytes32 hashId = getHashIdForBorrowedBook(
      tokenId,
      renter,
      borrower,
      startTime,
      endTime
    );
    return _allBorrowedBook[hashId];
  }

  function _removeItemFromAllBorrowedBooks(
    uint tokenId,
    address renter,
    address borrower,
    uint startTime,
    uint endTime
  ) private {
    uint idBorrowedBook = getIdBorrowedBook(
      tokenId,
      renter,
      borrower,
      startTime,
      endTime
    );
    uint lastIdBorrowedBook = _borrowedBooks.current();
    BorrowedBook memory lastBorrowedBook = _idToBorrowedBook[
      lastIdBorrowedBook
    ];
    BorrowedBook memory borrowedBook = _idToBorrowedBook[idBorrowedBook];
    bytes32 hashId = getHashIdForBorrowedBook(
      tokenId,
      renter,
      borrower,
      startTime,
      endTime
    );

    bytes32 hashLastId = getHashIdForBorrowedBook(
      lastBorrowedBook.tokenId,
      lastBorrowedBook.renter,
      lastBorrowedBook.borrower,
      lastBorrowedBook.startTime,
      lastBorrowedBook.endTime
    );
    bytes32 txId = _timelock.getTxId(
      borrowedBook.renter,
      0,
      "_recallBorrowedBooks(uint)",
      abi.encodePacked(idBorrowedBook),
      borrowedBook.endTime
    );
    _timelock.cancel(txId);
    if (idBorrowedBook != 0) {
      if (lastIdBorrowedBook != idBorrowedBook) {
        txId = _timelock.getTxId(
          lastBorrowedBook.renter,
          0,
          "_recallBorrowedBooks(uint)",
          abi.encodePacked(lastIdBorrowedBook),
          lastBorrowedBook.endTime
        );

        _timelock.update(
          txId,
          lastBorrowedBook.renter,
          0,
          "_recallBorrowedBooks(uint)",
          abi.encodePacked(idBorrowedBook),
          lastBorrowedBook.endTime
        );
        _allBorrowedBook[hashLastId] = idBorrowedBook;
        _idToBorrowedBook[idBorrowedBook] = lastBorrowedBook;
      }

      _borrowedBooks.decrement();
      _totalOwnedBorrowedBook[borrower]--;
      _amountOwnedBorrowedBooks[borrower][tokenId] -= borrowedBook.amount;
      delete _allBorrowedBook[hashId];
      delete _idToBorrowedBook[lastIdBorrowedBook];
    }
  }

  // Only update time
  function _updateTimeBorrowedBookFromBorrowing(
    bytes32 oldHashId,
    bytes32 newHashId,
    uint newStartTime,
    uint newEndTime
  ) private {
    uint idBorrowedBook = _allBorrowedBook[oldHashId];
    if (idBorrowedBook != 0) {
      delete _allBorrowedBook[oldHashId];
      _allBorrowedBook[newHashId] = idBorrowedBook;
      _idToBorrowedBook[idBorrowedBook].startTime = newStartTime;
      _idToBorrowedBook[idBorrowedBook].endTime = newEndTime;
    }
  }

  function _updateAmountBorrowedBookFromBorrowingWithHashId(
    bytes32 hashId,
    uint oldAmount,
    uint newAmount
  ) private {
    uint idBorrowedBook = _allBorrowedBook[hashId];
    if (idBorrowedBook != 0) {
      _idToBorrowedBook[idBorrowedBook].amount = newAmount;
      uint tokenId = _idToBorrowedBook[idBorrowedBook].tokenId;
      address borrower = _idToBorrowedBook[idBorrowedBook].borrower;
      if (oldAmount > newAmount) {
        _amountOwnedBorrowedBooks[borrower][tokenId] -= (oldAmount - newAmount);
      }
      if (oldAmount < newAmount) {
        _amountOwnedBorrowedBooks[borrower][tokenId] += (newAmount - oldAmount);
      }
    }
  }

  function updateAmountBorrowedBookFromBorrowing(
    uint idBorrowedBook,
    uint amount,
    bool isDecrease
  ) public {
    BorrowedBook memory borrowedBook = getBorrowedBookFromId(idBorrowedBook);
    if (borrowedBook.amount >= amount && isDecrease) {
      _idToBorrowedBook[idBorrowedBook].amount -= amount;
      if (_idToBorrowedBook[idBorrowedBook].amount == 0) {
        _removeItemFromAllBorrowedBooks(
          borrowedBook.tokenId,
          borrowedBook.renter,
          borrowedBook.borrower,
          borrowedBook.startTime,
          borrowedBook.endTime
        );
      }
      _amountOwnedBorrowedBooks[borrowedBook.borrower][
        borrowedBook.tokenId
      ] -= amount;
    }

    if (!isDecrease) {
      _idToBorrowedBook[idBorrowedBook].amount += amount;
      _amountOwnedBorrowedBooks[borrowedBook.borrower][
        borrowedBook.tokenId
      ] += amount;
    }
  }

  function getAmountOfBorrowedBooks(
    uint256 tokenId,
    address owner
  ) public view returns (uint) {
    return _amountOwnedBorrowedBooks[owner][tokenId];
  }

  function getOwnedBorrowedBooks() public view returns (BorrowedBook[] memory) {
    uint totalBorrowedBook = _totalOwnedBorrowedBook[msg.sender];
    BorrowedBook[] memory borrowedBooks = new BorrowedBook[](totalBorrowedBook);

    uint currentIndex = 0;
    for (uint i = 1; i <= _borrowedBooks.current(); i++) {
      BorrowedBook memory book = _idToBorrowedBook[i];
      if (book.borrower == msg.sender) {
        borrowedBooks[currentIndex] = book;
        currentIndex++;
      }
    }

    return borrowedBooks;
  }

  function isBorrowedBookReadable(
    uint tokenId,
    address owner
  ) public view returns (bool) {
    for (uint i = 1; i <= _borrowedBooks.current(); i++) {
      BorrowedBook memory book = _idToBorrowedBook[i];
      if (
        book.borrower == owner &&
        book.tokenId == tokenId &&
        book.endTime > block.timestamp
      ) {
        return true;
      }
    }

    return false;
  }

  function borrowBooks(
    uint256 tokenId,
    address renter,
    uint256 amount,
    uint256 price,
    uint startTime,
    uint endTime,
    address borrower,
    uint256 value
  ) public payable returns (uint256) {
    uint idLendBook = getIdLendBook(tokenId, renter);
    if (idLendBook == 0) {
      revert Error.InvalidIdError(idLendBook);
    }
    uint totalPrice = (amount * price * (endTime - startTime)) / 604800;

    if (value != totalPrice) {
      revert Error.InvalidValueError(value);
    }

    LendBook memory lendBook = getLendBook(tokenId, renter);

    if (amount > lendBook.amount || amount <= 0) {
      revert Error.InvalidAmountError(amount);
    }

    createBorrowedBook(
      tokenId,
      renter,
      price,
      amount,
      startTime,
      endTime,
      borrower
    );
    updateLendBookFromRenting(
      tokenId,
      lendBook.price,
      lendBook.amount - amount,
      renter
    );

    return totalPrice;
  }

  function requestExtendTimeOfBorrowedBooks(
    uint256 tokenId,
    address renter,
    address borrower,
    uint startTime,
    uint endTime,
    uint extendedAmount,
    uint extendedTime
  ) public {
    uint id = getIdBorrowedBook(tokenId, renter, borrower, startTime, endTime);
    if (id == 0) {
      revert Error.InvalidIdError(id);
    }
    BorrowedBook memory borrowedBook = getBorrowedBookFromId(id);
    if (borrowedBook.amount < extendedAmount) {
      revert Error.InvalidAmountError(extendedAmount);
    }
    _createRequest(id, extendedTime, extendedAmount, borrower, renter);
  }

  function updateRequestOfBorrowedBooks(
    uint256 tokenId,
    address renter,
    address borrower,
    uint startTime,
    uint endTime,
    uint newExtendedAmount,
    uint newExtendedTime
  ) public {
    uint id = getIdBorrowedBook(tokenId, renter, borrower, startTime, endTime);
    if (id == 0) {
      revert Error.InvalidIdError(id);
    }
    _updateRequest(id, newExtendedAmount, newExtendedTime, borrower, renter);
  }

  function doAcceptRequestAndCreateResponse(
    uint id,
    address borrower,
    address renter,
    bool isAccept
  ) public returns (bool) {
    if (id == 0) {
      revert Error.InvalidIdError(id);
    }
    if (_idToBorrowedBook[id].borrower != borrower) {
      revert Error.InvalidAddressError(borrower);
    }
    if (_idToBorrowedBook[id].renter != renter) {
      revert Error.InvalidAddressError(renter);
    }

    // If the owner approves the request, it set status of request isAccept is true and return extended time,
    // otherwise, this request will be deleted.
    uint extendedTime = getRequest(id, borrower, renter).time;
    uint extendedAmount = getRequest(id, borrower, renter).amount;
    if (isAccept) {
      if (extendedTime == 0 || extendedAmount == 0) {
        return false;
      }

      _setAcceptionForRequest(id, borrower, renter);
      _createResponse(id, extendedTime, extendedAmount, renter, borrower);
    } else {
      _cancelRequest(id, borrower, renter);
    }

    return isAccept;
  }

  function transferForSendedRequest(
    uint id,
    address renter,
    address borrower,
    uint currentTime,
    bool isExtend
  ) public payable returns (uint) {
    if (
      isResponseExist(id, renter, borrower) &&
      isAcceptRequest(id, borrower, renter)
    ) {
      Response memory response = getResponse(id, renter, borrower);
      BorrowedBook memory borrowedBook = _idToBorrowedBook[id];
      // Agree to pay for this transaction
      if (isExtend) {
        uint endTime;
        bytes32 oldHashId = getHashIdForBorrowedBook(
          borrowedBook.tokenId,
          borrowedBook.renter,
          borrowedBook.borrower,
          borrowedBook.startTime,
          borrowedBook.endTime
        );

        //======|==============|================|==========
        //  BB.startTime    current Time     BB.endTime
        if (currentTime <= borrowedBook.endTime) {
          endTime = borrowedBook.endTime + response.time;
        } else {
          endTime = currentTime + response.time;
        }
        if (response.amount == borrowedBook.amount) {
          // Update timelock for borrowed Book
          bytes32 txId = _timelock.getTxId(
            renter,
            0,
            "_recallBorrowedBooks(uint)",
            abi.encodePacked(id),
            borrowedBook.endTime
          );

          _timelock.update(
            txId,
            renter,
            0,
            "_recallBorrowedBooks(uint)",
            abi.encodePacked(id),
            endTime
          );
          bytes32 newHashId = getHashIdForBorrowedBook(
            borrowedBook.tokenId,
            renter,
            borrower,
            currentTime,
            endTime
          );
          _updateTimeBorrowedBookFromBorrowing(
            oldHashId,
            newHashId,
            currentTime,
            endTime
          );
        }

        if (response.amount < borrowedBook.amount) {
          createBorrowedBook(
            borrowedBook.tokenId,
            renter,
            borrowedBook.price,
            response.amount,
            currentTime,
            endTime,
            borrower
          );
          _updateAmountBorrowedBookFromBorrowingWithHashId(
            oldHashId,
            borrowedBook.amount,
            borrowedBook.amount - response.amount
          );
        }
      }
      // Cancle Req + Res for this transaction
      _cancelRequest(id, borrower, renter);
      _cancelResponse(id, renter, borrower);
      uint totalPrice = (borrowedBook.price * response.amount * response.time) /
        604800;
      return totalPrice;
    }
    return 0;
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

  function _recallBorrowedBooks(uint idBorrowedBook) private returns (bool) {
    BorrowedBook memory borrowedBook = getBorrowedBookFromId(idBorrowedBook);
    if (borrowedBook.tokenId != 0) {
      _removeItemFromAllBorrowedBooks(
        borrowedBook.tokenId,
        borrowedBook.renter,
        borrowedBook.borrower,
        borrowedBook.startTime,
        borrowedBook.endTime
      );

      // Remove respone of borrowed books on extending if needed
      if (idBorrowedBook != 0) {
        if (
          isResponseExist(
            idBorrowedBook,
            borrowedBook.renter,
            borrowedBook.borrower
          )
        ) {
          _cancelResponse(
            idBorrowedBook,
            borrowedBook.renter,
            borrowedBook.borrower
          );
        }
      }

      return true;
    }
    return false;
  }

  function excRecallBorrowedBooks(uint idBorrowedBook) public returns (bool) {
    BorrowedBook memory book = getBorrowedBookFromId(idBorrowedBook);
    bytes memory data = abi.encodePacked(idBorrowedBook);
    string memory func = "_recallBorrowedBooks(uint)";
    if (_timelock.isExecute(book.renter, 0, func, data, book.endTime)) {
      return _recallBorrowedBooks(idBorrowedBook);
    }

    return false;
  }
}
