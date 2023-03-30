// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Counters.sol";

contract SharedBookStorage {
    using Counters for Counters.Counter;

    struct SharedBook {
        uint256 tokenId;
        address fromRenter;
        address sharer;
        address  sharedPer;
        uint price; // price / books 
        uint amount;
        uint startTime;
        uint endTime;
    }

    event SharedBookCreated (
        uint256 tokenId,
        address fromRenter,
        address sharer,
        address  sharedPer,
        uint price,
        uint amount,
        uint startTime,
        uint endTime
    );

    // Variable for Shared Books

    // (hash ID ->  ID Book on sharing)
    mapping (bytes32 => uint) _allBooksOnSharing;
    // For sharer
    mapping(address => uint) private _totalOwnedBookOnSharing; 
    Counters.Counter private _booksOnSharing;
    mapping(uint => SharedBook) private _idToBookOnSharing; // (ID -> Book on Sharing)
    mapping(address => mapping(uint => uint)) private _amountOwnedBooksOnSharing;



    // hash ID => ID shared book
    mapping (bytes32 => uint) _allSharedBooks;
    // For shared person
    mapping(address => uint) private _totalOwnedSharedBook; 
    Counters.Counter private _sharedBooks;
    mapping(uint => SharedBook) private _idToSharedBook; // (ID -> Shared book)
    // Shared person => (tokenId => amount)
    mapping(address => mapping(uint => uint)) private _amountOwnedSharedBooks;

    function getTotalBookOnSharing() public view returns(uint) {
        return _booksOnSharing.current();
    }

    function getHashIdForSharedBook(uint tokenId, 
                                    address sharer, 
                                    address sharedPer, 
                                    uint startTime, 
                                    uint endTime) public pure returns (bytes32) {
        return keccak256(abi.encode(tokenId, sharer, sharedPer, startTime, endTime));                                  
    }

    function getHashIdForBookOnSharing(uint tokenId,
                                       address fromRenter, 
                                       address sharer, 
                                       uint startTime, 
                                       uint endTime) public pure returns (bytes32) {
        return keccak256(abi.encode(tokenId, fromRenter, sharer, startTime, endTime));                                  
    }
    function _createBookForSharing(uint tokenId, 
                                   address fromRenter,
                                   address sharer, 
                                   uint256 price, 
                                   uint amount, 
                                   uint startTime, 
                                   uint endTime) private {
        bytes32 hashId = getHashIdForBookOnSharing(tokenId,
                                                   fromRenter,
                                                   sharer,  
                                                   startTime, 
                                                   endTime);
        require(_allSharedBooks[hashId] == 0, "Shared book is already exist");
        _booksOnSharing.increment();
        
        _allBooksOnSharing[hashId] = _booksOnSharing.current();
        _idToBookOnSharing[_booksOnSharing.current()] = SharedBook(tokenId,
                                                                   fromRenter,
                                                                   sharer,
                                                                   address(0), 
                                                                   price, 
                                                                   amount,
                                                                   startTime,
                                                                   endTime);
        _totalOwnedBookOnSharing[sharer]++;
        _amountOwnedBooksOnSharing[sharer][tokenId] += amount;
        emit SharedBookCreated(tokenId,
                               fromRenter,
                               sharer,
                               address(0), 
                               price, 
                               amount,
                               startTime,
                               endTime);
    }

    function _createSharedBook(uint tokenId, 
                               address fromRenter,
                               address sharer, 
                               address sharedPer, 
                               uint256 price, 
                               uint amount,
                               uint startTime,
                               uint endTime) private {
        bytes32 hashId = getHashIdForSharedBook(tokenId,
                                                sharer, 
                                                sharedPer, 
                                                startTime, 
                                                endTime);
        require(_allSharedBooks[hashId] == 0, "Shared book is already exist");
        _sharedBooks.increment();
        _allSharedBooks[hashId] = _sharedBooks.current();
        _idToSharedBook[_sharedBooks.current()] = SharedBook(tokenId,
                                                             fromRenter,
                                                             sharer,
                                                             sharedPer, 
                                                             price, 
                                                             amount,
                                                             startTime,
                                                             endTime);
        _totalOwnedSharedBook[sharedPer]++;
        _amountOwnedSharedBooks[sharedPer][tokenId] += amount;
        emit SharedBookCreated(tokenId,
                               fromRenter,
                               sharer,
                               sharedPer, 
                               price, 
                               amount,
                               startTime,
                               endTime);
    }

    function getIdBookOnSharing(uint tokenId, 
                                address fromRenter,
                                address sharer, 
                                uint startTime, 
                                uint endTime) public view returns(uint) {
        require(tokenId != 0 && sharer != address(0), "Token id and your's address is invalid");
        bytes32 hashId = getHashIdForBookOnSharing(tokenId,
                                                   fromRenter, 
                                                   sharer, 
                                                   startTime, 
                                                   endTime);
        uint idBooksOnSharing = _allBooksOnSharing[hashId];
        if (idBooksOnSharing != 0) {
            if (_idToBookOnSharing[idBooksOnSharing].sharedPer == address(0)) {
                return idBooksOnSharing;
            }
        }
        return 0;
    }

    function getBooksOnSharing(uint idBooksOnSharing) public view returns(SharedBook memory) {
        require(idBooksOnSharing != 0, "Id of shared book is invalid");
        require(_idToBookOnSharing[idBooksOnSharing].sharedPer == address(0),
                 "Shared Book is invalid");
        return _idToBookOnSharing[idBooksOnSharing];
    }

    function getIdSharedBook(uint tokenId, 
                            address sharedPer, 
                            address sharer,
                            uint startTime,
                            uint endTime) public view returns(uint) {
        require(tokenId != 0 && sharedPer != address(0), "Token id and your's address is invalid");
        bytes32 hashId = getHashIdForSharedBook(tokenId, 
                                                sharer, 
                                                sharedPer, 
                                                startTime, 
                                                endTime);
        uint idSharedBook = _allSharedBooks[hashId];
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

    function shareBooks(uint256 tokenId,
                        address fromRenter, 
                        address sharer,
                        uint price,
                        uint256 amount,
                        uint256 startTime,
                        uint256 endTime) public payable {

        uint idBookOnSharing = getIdBookOnSharing(tokenId, fromRenter, sharer, startTime, endTime);
        require(idBookOnSharing == 0, "Books is existed on sharing");
        _createBookForSharing(tokenId, fromRenter, sharer, price, amount, startTime, endTime);

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
                                        address sharedPer,
                                        uint tokenId,
                                        uint newPrice,
                                        uint256 newAmount
                                        ) private {
        require(_idToSharedBook[idSharedBook].tokenId == tokenId, "Token Id is invalid");
        require(_idToSharedBook[idSharedBook].sharedPer == sharedPer, "Address of sharered person is invalid");
        if(_idToSharedBook[idSharedBook].price != newPrice) {

            _idToSharedBook[idSharedBook].price = newPrice;

        } 
        
        if( _idToSharedBook[idSharedBook].amount != newAmount) {
            uint balance;
            if (_idToSharedBook[idSharedBook].amount > newAmount) {
                balance = _idToSharedBook[idSharedBook].amount - newAmount;
                _amountOwnedSharedBooks[sharedPer][tokenId] -= balance;
            } else {
                balance = newAmount - _idToSharedBook[idSharedBook].amount;
                _amountOwnedSharedBooks[sharedPer][tokenId] += balance;
            }

            _idToSharedBook[idSharedBook].amount = newAmount;

        }

    }

    function _updateBooksOnSharingInternal(uint idBookOnSharing,
                                           address sharer,
                                           uint tokenId,
                                           uint newPrice,
                                           uint256 newAmount
                                        ) private {
        require(_idToBookOnSharing[idBookOnSharing].tokenId == tokenId, "Token Id is invalid");
        require(_idToBookOnSharing[idBookOnSharing].sharer == sharer, "Address of sharer is invalid");
        if(_idToBookOnSharing[idBookOnSharing].price != newPrice ) {

            _idToBookOnSharing[idBookOnSharing].price = newPrice;

        }

        if (_idToBookOnSharing[idBookOnSharing].amount != newAmount) {
            uint balance;
            if (_idToBookOnSharing[idBookOnSharing].amount > newAmount) {
                balance = _idToBookOnSharing[idBookOnSharing].amount - newAmount;
                _amountOwnedBooksOnSharing[sharer][tokenId] -= balance;
            } else {
                balance = newAmount - _idToBookOnSharing[idBookOnSharing].amount;
                _amountOwnedBooksOnSharing[sharer][tokenId] += balance;
            }
            _idToBookOnSharing[idBookOnSharing].amount = newAmount;

        }

    }

    function updateBooksOnSharing(uint idBookOnSharing,
                                  address sharer,
                                  uint tokenId,
                                  uint newPrice, 
                                  uint newAmount) public {

        require(idBookOnSharing != 0, "Book is not existed on sharing");
        require(newPrice > 0, "New price is invalid");
        require(newAmount > 0, "New price is invalid");
        _updateBooksOnSharingInternal(idBookOnSharing, sharer, tokenId, newPrice, newAmount);
    }

    function _removeBooksOnSharingInternal(bytes32 hashId) private {
        uint idBook = _allBooksOnSharing[hashId];
        require(idBook != 0, "Book on sharing is not exist");
        SharedBook memory bookOnSharing = _idToBookOnSharing[idBook];

        uint lastIdBook = _booksOnSharing.current();
        if (lastIdBook != idBook) {

            SharedBook memory lastBook = _idToBookOnSharing[lastIdBook];
            bytes32 lastHashId = getHashIdForBookOnSharing(lastBook.tokenId, 
                                                           lastBook.fromRenter,
                                                           lastBook.sharer, 
                                                           lastBook.startTime, 
                                                           lastBook.endTime);

            _allBooksOnSharing[lastHashId] = idBook;
            _idToBookOnSharing[idBook] = lastBook;

        }

        delete _allBooksOnSharing[hashId];
        delete _idToBookOnSharing[lastIdBook];

        _totalOwnedBookOnSharing[bookOnSharing.sharer] -= 1;
        _amountOwnedBooksOnSharing[bookOnSharing.sharer][bookOnSharing.tokenId] -= bookOnSharing.amount;
        _booksOnSharing.decrement();

    }

    function removeBooksOnSharing(uint tokenId,
                                  address fromRenter,
                                  address sharer,
                                  uint startTime,
                                  uint endTime) public {
        require(tokenId > 0, "Token id is invalid");
        require(sharer != address(0), "Address of sharer is invalid");

        bytes32 hashId = getHashIdForBookOnSharing(tokenId, 
                                                   fromRenter,
                                                   sharer, 
                                                   startTime, 
                                                   endTime); 

        _removeBooksOnSharingInternal(hashId);
    }

    function _removeSharedBooksInternal(bytes32 hashId) private {
        uint idBook = _allSharedBooks[hashId];
        require(idBook != 0, "Shared book is not exist");
        SharedBook memory sharedBook = _idToSharedBook[idBook];

        uint lastIdBook = _sharedBooks.current();
        if (lastIdBook != idBook) {

            SharedBook memory lastBook = _idToSharedBook[lastIdBook];
            bytes32 lastHashId = getHashIdForSharedBook(lastBook.tokenId, 
                                                        lastBook.sharer, 
                                                        lastBook.sharedPer, 
                                                        lastBook.startTime, 
                                                        lastBook.endTime);

            _allSharedBooks[lastHashId] = idBook;
            _idToSharedBook[idBook] = lastBook;

        }

        delete _allSharedBooks[hashId];
        delete _idToSharedBook[lastIdBook];

        _totalOwnedSharedBook[sharedBook.sharedPer] -= 1;
        _amountOwnedSharedBooks[sharedBook.sharedPer][sharedBook.tokenId] -= sharedBook.amount;
        _sharedBooks.decrement();

    }

    function removeSharedBooks(uint tokenId,
                              address owner,
                              address sharer,
                              uint startTime,
                              uint endTime
                              ) public {
        require(tokenId > 0, "Token Id is invalid");
        require(owner != address(0), "Address of owner is invalid");

        bytes32 hashId = getHashIdForSharedBook(tokenId, 
                                                sharer, 
                                                owner, 
                                                startTime, 
                                                endTime); 
        _removeSharedBooksInternal(hashId);
    }

    function takeBooksOnSharing(uint idBooksOnSharing,
                                address sender,
                                uint amount) public payable returns(uint) {
        SharedBook memory booksOnSharing = getBooksOnSharing(idBooksOnSharing);
        require(booksOnSharing.tokenId > 0, "Token id is invalid");
        require(booksOnSharing.sharer != address(0) && sender != address(0), 
                "Address of sharer or sender is invalid");
        require(booksOnSharing.sharer != sender, "You may not take books shared by yourself");
        require(amount <= booksOnSharing.amount && amount > 0,
                     "Amount of books which you want take is invalid");
        uint tokenId = booksOnSharing.tokenId;
        address sharer = booksOnSharing.sharer;

        uint idSharedBook = getIdSharedBook(tokenId, 
                                            sender, 
                                            sharer, 
                                            booksOnSharing.startTime, 
                                            booksOnSharing.endTime);
        if (idSharedBook == 0) {
            _createSharedBook(tokenId,
                              booksOnSharing.fromRenter,
                              sharer, 
                              sender, 
                              booksOnSharing.price, 
                              amount, 
                              booksOnSharing.startTime, 
                              booksOnSharing.endTime);

        } else {
            SharedBook memory sharedBooks = _idToSharedBook[idSharedBook];
            _updateSharedBooksInternal(idSharedBook, 
                                       sender,
                                       tokenId,
                                       booksOnSharing.price, 
                                       sharedBooks.amount + amount);
        }

        if (amount == booksOnSharing.amount) {
            bytes32 hashId = getHashIdForBookOnSharing(tokenId,
                                                       booksOnSharing.fromRenter,
                                                       sharer, 
                                                       booksOnSharing.startTime, 
                                                       booksOnSharing.endTime); 
            require(_allBooksOnSharing[hashId] == idBooksOnSharing,
                     "Hash id of books on sharing is invalid");
            _removeBooksOnSharingInternal(hashId);
        } else {
            _updateBooksOnSharingInternal(idBooksOnSharing,
                                          sharer,
                                          tokenId,
                                          booksOnSharing.price, 
                                          booksOnSharing.amount - amount);
        }

        // Return price of books on sharing to transfer to sharer 
        return booksOnSharing.price;
    }

    function getAmountOfAllfBooksOnSharing(uint tokenId,
                                          address owner) public view returns(uint) {
        return _amountOwnedBooksOnSharing[owner][tokenId];
    }

    function getAmountOfAllSharedBooks(uint tokenId,
                                    address owner) public view returns(uint) {
            
        return _amountOwnedSharedBooks[owner][tokenId];
    }

}