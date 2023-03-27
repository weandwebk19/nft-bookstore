// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Counters.sol";

contract SharedBookStorage {
    using Counters for Counters.Counter;

    struct SharedBook {
        uint256 idBorrowedBook;
        address sharer;
        address  sharedPer;
        uint price; // price / books 
        uint amount;
    }

    event SharedBookCreated (
        uint256 idBorrowedBook,
        address sharer,
        address  sharedPer,
        uint price,
        uint amount
    );

    // Variable for Shared Books

    // (borrowed book id -> (sharer -> ID))
    mapping (uint => mapping (address => uint)) _allBooksOnSharing;
    // For sharer
    mapping(address => uint) private _totalOwnedBookOnSharing; 
    Counters.Counter private _booksOnSharing;
    mapping(uint => SharedBook) private _idToBookOnSharing; // (ID -> Book on Sharing)


    // (borrowed book id -> (shared person -> ID))
    mapping (uint => mapping (address => uint)) _allSharedBooks;
    // For shared person
    mapping(address => uint) private _totalOwnedSharedBook; 
    Counters.Counter private _sharedBooks;
    mapping(uint => SharedBook) private _idToSharedBook; // (ID -> Shared book)


    function _createBookForSharing(uint id, 
                                    address sharer, 
                                    uint256 price, 
                                    uint amount) private {

        _booksOnSharing.increment();
        _allBooksOnSharing[id][sharer] = _booksOnSharing.current();
        _idToBookOnSharing[_booksOnSharing.current()] = SharedBook(id,
                                                             sharer,
                                                             address(0), 
                                                             price, 
                                                             amount);
        _totalOwnedBookOnSharing[sharer]++;
        emit SharedBookCreated(id,
                               sharer,
                               address(0), 
                               price, 
                               amount);
    }

    function _createSharedBook(uint id, 
                               address sharer, 
                               address sharedPer, 
                               uint256 price, 
                               uint amount) private {

        _sharedBooks.increment();
        _allSharedBooks[id][sharedPer] = _sharedBooks.current();
        _idToSharedBook[_sharedBooks.current()] = SharedBook(id,
                                                             sharer,
                                                             sharedPer, 
                                                             price, 
                                                             amount);
        _totalOwnedSharedBook[sharedPer]++;
        emit SharedBookCreated(id,
                               sharer,
                               sharedPer, 
                               price, 
                               amount);
    }

    function getIdBookOnSharing(uint id, address sharer) public view returns(uint) {
        require(id != 0 && sharer != address(0), "Token id and address of you is invalid");
        uint idBooksOnSharing = _allBooksOnSharing[id][sharer];
        if (idBooksOnSharing != 0) {
            if (_idToBookOnSharing[idBooksOnSharing].sharedPer == address(0)) {
                return idBooksOnSharing;
            }
        }
        return 0;
    }

    function getBooksOnSharing(uint idBooksOnSharing) public view returns(SharedBook memory) {
        require(idBooksOnSharing != 0, "Id of shared book is invalid");
        require(_idToSharedBook[idBooksOnSharing].sharedPer == address(0),
                 "Shared Book is invalid");
        return _idToSharedBook[idBooksOnSharing];
    }

    function getIdSharedBook(uint id, address sharedPer) public view returns(uint) {
        require(id != 0 && sharedPer != address(0), "Token id and address of you is invalid");
        uint idSharedBook = _allSharedBooks[id][sharedPer];
        if (idSharedBook != 0) {
            if (_idToSharedBook[idSharedBook].sharedPer != address(0)) {
                return idSharedBook;
            }
        }
        return 0;
    }

    function getSharedBooks(uint idSharedBook) public view returns(SharedBook memory) {
        require(idSharedBook != 0, "Id of shared book is invalid");
        require(_idToSharedBook[idSharedBook].sharedPer != address(0),
                 "Shared Book is invalid");
        return _idToSharedBook[idSharedBook];
    }

    function shareBooks(uint256 id, 
                        address sharer,
                        uint price,
                        uint256 amount
                        ) public payable {

        uint idBookOnSharing = getIdBookOnSharing(id, sharer);
        require(idBookOnSharing == 0, "Books is existed on sharing");
        _createBookForSharing(id, sharer, price, amount);

    }

    function getAllBooksOnSharing() public view returns (SharedBook[] memory) {
        uint length = _booksOnSharing.current();
        SharedBook[] memory books;
        if (length > 0) {
            books = new SharedBook[](length);

            for (uint i = 1; i <= length; i++) {
                SharedBook memory book = _idToBookOnSharing[i];
                books[i - 1] = book;
            }
        }

        return books;
    }

    function getAllOwnedBooksOnSharing(address owner) public view returns (SharedBook[] memory) {
        uint total = _totalOwnedBookOnSharing[owner];
        SharedBook[] memory books;

        if (total > 0) {
            uint currentIndex = 0;
            books = new SharedBook[](total);

            for (uint i = 1; i <= _booksOnSharing.current(); i++) {
                SharedBook memory book = _idToBookOnSharing[i];
                if (book.sharer == owner && book.sharedPer == address(0)) {
                    books[currentIndex] = book;
                    currentIndex += 1;
                }
            }
        }
        return books;
    }

    function getAllSharedBook() public view returns (SharedBook[] memory) {
        uint length = _sharedBooks.current();
        SharedBook[] memory books;
        if (length > 0) {
            books = new SharedBook[](length);

            for (uint i = 1; i <= length; i++) {
                SharedBook memory book = _idToSharedBook[i];
                books[i - 1] = book;
            }
        }

        return books;
    }

    function getAllOwnedSharedBook(address owner) public view returns (SharedBook[] memory) {
        uint total = _totalOwnedSharedBook[owner];
        SharedBook[] memory books;

        if (total > 0) {
            uint currentIndex = 0;
            books = new SharedBook[](total);

            for (uint i = 1; i <= _sharedBooks.current(); i++) {
                SharedBook memory book = _idToSharedBook[i];
                if (book.sharedPer == owner) {
                    books[currentIndex] = book;
                    currentIndex += 1;
                }
            }
        }
        return books;
    }

    function _updateSharedBooksInternal(uint idSharedBook,
                                        uint newPrice,
                                        uint256 newAmount
                                        ) private {
        if(_idToSharedBook[idSharedBook].price != newPrice) {

            _idToSharedBook[idSharedBook].price = newPrice;

        } 
        
        if( _idToSharedBook[idSharedBook].amount != newAmount) {

            _idToSharedBook[idSharedBook].amount = newAmount;

        }

    }

    function _updateBooksOnSharingInternal(uint idBookOnSharing,
                                           uint newPrice,
                                           uint256 newAmount
                                        ) private {
        if(_idToBookOnSharing[idBookOnSharing].price != newPrice ) {

            _idToBookOnSharing[idBookOnSharing].price = newPrice;

        }

        if (_idToBookOnSharing[idBookOnSharing].amount != newAmount) {

            _idToBookOnSharing[idBookOnSharing].amount = newAmount;

        }

    }

    function updateBooksOnSharing(uint id, 
                                   address sharer, 
                                   uint newPrice, 
                                   uint newAmount) public {

        uint idBookOnSharing = getIdBookOnSharing(id, sharer);
        require(idBookOnSharing != 0, "Book is not existed on sharing");
        require(newPrice > 0, "New price is invalid");
        require(newAmount > 0, "New price is invalid");
        _updateBooksOnSharingInternal(idBookOnSharing, newPrice, newAmount);
    }

    function _removeBooksOnSharingInternal(uint id,
                                           address sharer
                                           ) private {
        uint idBook = _allBooksOnSharing[id][sharer];

        uint lastIdBook = _booksOnSharing.current();
        if (lastIdBook != idBook) {

            SharedBook memory lastBook = _idToBookOnSharing[lastIdBook];
            address lastSharer = lastBook.sharer;
            uint lastIdBorrowedBook = lastBook.idBorrowedBook;

            _allBooksOnSharing[lastIdBorrowedBook][lastSharer] = idBook;
            _idToBookOnSharing[idBook] = lastBook;

        }

        delete _allBooksOnSharing[id][sharer];
        delete _idToBookOnSharing[lastIdBook];

        _totalOwnedBookOnSharing[sharer] -= 1;
        _booksOnSharing.decrement();

    }

    function removeBooksOnSharing(uint id,
                                  address sharer
                                  ) public {
        require(id > 0, "Borrowed book id is invalid");
        require(sharer != address(0), "Address of sharer is invalid");

        uint idBook = _allBooksOnSharing[id][sharer];
        require(idBook != 0, "Book is existed on sharing");

        _removeBooksOnSharingInternal(id, sharer);
    }

    function _removeSharedBooksInternal(uint id,
                                      address owner) private {
        uint idBook = _allSharedBooks[id][owner];

        uint lastIdBook = _sharedBooks.current();
        if (lastIdBook != idBook) {

            SharedBook memory lastBook = _idToSharedBook[lastIdBook];
            address lastOwner = lastBook.sharedPer;
            uint lastIdBorrowedBook = lastBook.idBorrowedBook;

            _allSharedBooks[lastIdBorrowedBook][lastOwner] = idBook;
            _idToSharedBook[idBook] = lastBook;

        }

        delete _allSharedBooks[id][owner];
        delete _idToSharedBook[lastIdBook];

        _totalOwnedBookOnSharing[owner] -= 1;
        _sharedBooks.decrement();

    }

    function removeSharedBooks(uint id,
                              address owner
                              ) public {
        require(id > 0, "Borrowed book id is invalid");
        require(owner != address(0), "Address of owner is invalid");

        uint idBook = _allBooksOnSharing[id][owner];
        require(idBook != 0, "Book is existed on sharing");

        _removeSharedBooksInternal(id, owner);
    }

    function takeBooksOnSharing(uint id, 
                                address sharer, 
                                address sender,
                                uint amount) public payable returns(uint) {
        require(id > 0, "Borrowed book id is invalid");
        require(sharer != address(0) && sender != address(0), 
                "Address of sharer or sender is invalid");
        require(sharer != sender, "You may not take books shared by yourself");

        uint idBookOnSharing = _allBooksOnSharing[id][sharer];
        require(idBookOnSharing != 0, "Book is existed on sharing");    
        SharedBook memory booksOnSharing = _idToBookOnSharing[idBookOnSharing];
        require(amount <= booksOnSharing.amount && amount > 0,
                     "Amount of books which you want take is invalid");

        uint idSharedBook = getIdSharedBook(id, sender);
        if (idSharedBook == 0) {
            _createSharedBook(id, sharer, sender, booksOnSharing.price, amount);

        } else {
            SharedBook memory sharedBooks = _idToSharedBook[idSharedBook];
            _updateSharedBooksInternal(idSharedBook, 
                                       booksOnSharing.price, 
                                       sharedBooks.amount + amount);
        }

        if (amount == booksOnSharing.amount) {
            _removeBooksOnSharingInternal(id, sharer);
        } else {
            _updateBooksOnSharingInternal(idBookOnSharing,
                                          booksOnSharing.price, 
                                          booksOnSharing.amount - amount);
        }

        // Return price of books on sharing to transfer to sharer 
        return booksOnSharing.price;
    }

    function getAmountOfBooksOnSharing(uint idBorrowedBook,
                                         address sharer) public view returns(uint) {
        uint idBooksOnSharing = _allBooksOnSharing[idBorrowedBook][sharer];
        if (idBooksOnSharing != 0) {
            return _idToBookOnSharing[idBooksOnSharing].amount;
        }

        return 0;
    }

    function getAmountOfSharedBooks(uint idBorrowedBook,
                                         address owner) public view returns(uint) {
        uint idSharedBook = _allSharedBooks[idBorrowedBook][owner];
        if (idSharedBook != 0) {
            return _idToSharedBook[idSharedBook].amount;
        }

        return 0;
    }

}