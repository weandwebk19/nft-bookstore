// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ListedBookStorage.sol";
import "./BookTemporary.sol";

contract BookStore is ERC1155URIStorage, Ownable {
  using Counters for Counters.Counter;

  struct NFTBook {
    uint256 tokenId;
    address author;
    uint256 quantity;
  }

  event NFTBookCreated (
    uint256 tokenId,
    address author,
    uint256 quantity
  );

  ListedBookStorage private _listedBookStorage;
  BookTemporary private _bookTemporary;

  uint MAX_BALANCE = 500;
  uint MIN_TIME = 604800; // Rental period is at least one week
  uint public listingPrice = 0.025 ether;
  uint public rentingPrice = 0.001 ether;
  uint private sharingPrice = 0.0005 ether;

  Counters.Counter private _tokenIds;

  mapping (uint => NFTBook) _idToNFTBook;
  mapping (string => bool) private _usedTokenURIs;

  mapping(address => mapping(uint => uint)) private _ownedTokens;
  mapping(address => uint) private _totalOwnedToken;


  constructor(ListedBookStorage  listedBookStorage,
               BookTemporary bookTemporary)
    ERC1155("https://example.com/api/{id}.json") {

    _listedBookStorage = listedBookStorage;
    _bookTemporary = bookTemporary;

  }

  function setListingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    listingPrice = newPrice;
  }

  function setRentingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    rentingPrice = newPrice;
  }

  function setSharingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    sharingPrice = newPrice;
  }

  function setTokenUri(uint256 tokenId, string memory tokenURI) external onlyOwner{
    require(_idToNFTBook[tokenId].author == msg.sender, "Only author of this token can call this method.");
    // Delete old URI
    string memory oldURI = ERC1155URIStorage.uri(tokenId);
    delete _usedTokenURIs[oldURI];

    // Set new URI to the token
    _setURI(tokenId, tokenURI);
    _usedTokenURIs[tokenURI] = true;
  }

  function isListed(uint tokenId, address seller) public view returns (bool) {
    return _listedBookStorage.isListed(tokenId, seller);
  }

  function isRented(uint tokenId, address renter) public view returns (bool) {
    return _bookTemporary.isRented(tokenId, renter);
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

    // Buy books and Borrow books
    if (from != address(0) && to != address(0) && to != from) {
      uint tokenId = ids[0];
      _addTokenToOwnerEnumeration(to, tokenId);
      if (ERC1155.balanceOf(from, tokenId) == 0) {
        _removeTokenFromOwnerEnumeration(from, tokenId);
      }
    }

  }

  function getBalanceOfOwnerBook(uint tokenId) public view returns(uint){
    require(isOwnerOfToken(tokenId, msg.sender),
          "You are not the owner of this token");

    return ERC1155.balanceOf(msg.sender, tokenId);
  }

  function _addTokenToOwnerEnumeration(address owner, uint tokenId) private {
    if (!isOwnerOfToken(tokenId, owner)) {
      uint length = _totalOwnedToken[owner];
      _ownedTokens[owner][length] = tokenId;
      _totalOwnedToken[owner]++;
    }
  }

  function _removeTokenFromOwnerEnumeration(address owner, uint tokenId) private {
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

  function getListedBook(uint tokenId, address seller) public view returns (ListedBookStorage.ListedBook memory) {
    return _listedBookStorage.getListedBook(tokenId, seller);
  }

  function isTokenURIExist(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI];
  }

  function mintBook(string memory tokenURI, uint256 quantity)
    public payable returns (uint) {

    require(!isTokenURIExist(tokenURI),
           "Token URI already exists");
    require(quantity > 0 && quantity <= MAX_BALANCE,
          "The number of books you want to publish is not appropriate");
    require(msg.value == listingPrice,
           "Price must be equal to listing price");

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
  
  function isOwnerOfToken(uint tokenId, address owner) public view returns(bool) {
    return ERC1155.balanceOf(owner, tokenId) > 0 ;
  }

  function getOwnedNFTBooks() public view returns (NFTBook[] memory) {
    uint ownedItemsCount = getTotalOwnedToken();
    NFTBook[] memory books = new NFTBook[](ownedItemsCount);

    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      NFTBook memory book = _idToNFTBook[tokenId];

      books[i] = book;
    }

    return books;
  }

  function getOwnedListedBooks() public view returns (ListedBookStorage.ListedBook[] memory) {
    uint ownedListedBookCount = _listedBookStorage.getTotalOwnedListedBook(msg.sender);
    uint ownedItemsCount = getTotalOwnedToken();
    ListedBookStorage.ListedBook[] memory books = new ListedBookStorage.ListedBook[](ownedListedBookCount);

    uint currentIndex = 0;
    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      ListedBookStorage.ListedBook memory book = _listedBookStorage.getListedBook(tokenId, msg.sender);
      if (book.tokenId != 0 && book.seller != address(0)) {
        books[currentIndex] = book;
        currentIndex++;
      }
    }

    return books;
  }

  function getCreatedNFTBooks() public view returns (NFTBook[] memory) {
    uint ownedItemsCount = getTotalOwnedToken();
    NFTBook[] memory books = new NFTBook[](ownedItemsCount);

    uint currentIndex = 0;
    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      NFTBook memory book = _idToNFTBook[tokenId];
      if(book.author == msg.sender) {
        books[currentIndex] = book;
        currentIndex += 1;
      }
    }

    return books;
  }

  function getTotalOwnedToken() public view returns(uint) {
    return _totalOwnedToken[msg.sender];
  }

  function getOwnedRentedBooks() public view returns (BookTemporary.RentedBook[] memory) {
    uint ownedRentedBookCount = _bookTemporary.getTotalOwnedRentedBook(msg.sender);
    uint ownedItemsCount = getTotalOwnedToken();
    BookTemporary.RentedBook[] memory books = new BookTemporary.RentedBook[](ownedRentedBookCount);

    uint currentIndex = 0;
    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      BookTemporary.RentedBook memory book = _bookTemporary.getRentedBook(tokenId, msg.sender);
      if (book.tokenId != 0 &&
          book.renter != address(0)) {

        books[currentIndex] = book;
        currentIndex++;
      }
    }

    return books;
  }

  function getOwnedBorrowedBooks() public view returns (BookTemporary.BorrowedBook[] memory) {
    BookTemporary.BorrowedBook[] memory borrowedBooks = 
                                    _bookTemporary.getOwnedBorrowedBooks(msg.sender);
    
    require(borrowedBooks.length == 
            _bookTemporary.getTotalOwnedBorrowedBook(msg.sender),
            "Length of owned borrowed books is invalid");
      
    return borrowedBooks;
  }

  function getAmountOfAllTypeBooksUntradeable(uint256 tokenId) public view returns(uint) {
    require(tokenId != 0 && msg.sender != address(0), "Token id and owner is invalid");
    return _listedBookStorage.getAmountOfListedBooks(tokenId, msg.sender) +
          _bookTemporary.getAmountOfRentedBooks(tokenId, msg.sender) + 
          _bookTemporary.getAmountOfAllSharedBooks(tokenId, msg.sender) + 
          _bookTemporary.getAmountOfBorrowedBooks(tokenId, msg.sender);
  }
  
  function sellBooks(uint256 tokenId,
                    uint price,
                    uint256 amount) public payable {
    require(isOwnerOfToken(tokenId, msg.sender),
          "You are not the owner of this token");
    require(getAmountOfAllTypeBooksUntradeable(tokenId) + amount <= ERC1155.balanceOf(msg.sender, tokenId),
          "You don't have enough books to sell");
    require(msg.value == listingPrice,
           "Price must be equal to listing price");
    _listedBookStorage.sellListedBooks(tokenId, price, amount, msg.sender);
  }

  function leaseBooks(uint256 tokenId,
                    uint price,
                    uint256 amount) public payable {
    require(isOwnerOfToken(tokenId, msg.sender),
          "You are not the owner of this token");
    require(getAmountOfAllTypeBooksUntradeable(tokenId) +
           amount <= ERC1155.balanceOf(msg.sender, tokenId) &&
           amount > 0,
          "You don't have enough books to sell");
    require(msg.value == rentingPrice,
           "Price must be equal to renting price");
    _bookTemporary.leaseRentedBooks(tokenId, msg.sender, price, amount);

  }

  function updateBookFromSale(uint256 tokenId, 
                              uint newPrice, 
                              uint256 newAmount, 
                              address seller) public {
    require(isOwnerOfToken(tokenId, seller),
          "You are not the owner of this token");
    require(seller == msg.sender,
          "You are not the seller of this token");
    _listedBookStorage.updateListedBookFromSale(tokenId,
                                                newPrice, 
                                                newAmount, 
                                                seller);
  }

  function updateBookFromRenting(uint256 tokenId,
                                uint newPrice,
                                uint256 newAmount,
                                address renter) public {
    require(isOwnerOfToken(tokenId, renter),
          "You are not the owner of this token");
    require(renter == msg.sender,
          "You are not the renter of this token");
    
    _bookTemporary.updateRentedBookFromRenting(tokenId,
                                                  newPrice,
                                                  newAmount,
                                                  renter);
  }

  function getAllBooksOnSale() public view returns (ListedBookStorage.ListedBook[] memory) {
    return _listedBookStorage.getAllListedBooks();
  }

  function getAllBooksOnRenting() public view returns (BookTemporary.RentedBook[] memory) {
    return _bookTemporary.getAllRentedBooks();
  }

  function buyBooks(uint256 tokenId, address seller, uint256 amount) public payable {

    uint totalPrice = _listedBookStorage.buyListedBooks(tokenId, seller, amount, msg.sender, msg.value);
    if (totalPrice != 0) {
      _safeTransferFrom(seller, msg.sender, tokenId, amount, "");
      payable(seller).transfer(totalPrice);
    }
  }

  function borrowBooks(uint256 tokenId,
                      address renter,
                      uint256 price,
                      uint256 amount,
                      uint rentalDuration) public payable {
    require(rentalDuration >= MIN_TIME,
           "Rental period is at least one week");

    uint startTime = block.timestamp;
    uint endTime = startTime + rentalDuration;
    uint256 totalPrice = _bookTemporary.borrowRentedBooks(tokenId,
                                                           renter, 
                                                           amount, 
                                                           price,
                                                           startTime, 
                                                           endTime, 
                                                           msg.sender, 
                                                           msg.value);
    if (totalPrice != 0) {
      _safeTransferFrom(renter, msg.sender, tokenId, amount, "");
      payable(renter).transfer(totalPrice);
    } else {
      require(false,
           "Book execution failed");
    }
  }

  function getAllBorrowedBooks() public view returns (BookTemporary.BorrowedBook[] memory) {
    return _bookTemporary.getAllBorrowedBooks();
  }

  //Make a request to extend the rental period and wait for their owner to approve your request
  function requestExtendTimeOfBorrowedBooks(uint256 tokenId,
                                            address renter,
                                            uint extendedTime) public {
                                              
    require(renter != address(0) && msg.sender != address(0), "Address is invalid");
    require(renter != msg.sender , "You can not renew with yourself");
    require(extendedTime >= MIN_TIME, "Extended time is invalid");

    _bookTemporary.requestExtendTimeOfBorrowedBooks(tokenId, 
                                                    renter, 
                                                    extendedTime, 
                                                    msg.sender);
  }

  // If borrowed book exist, only update extended time. Owthersise, do nothing
  function updateRequestExtendTimeOfBorrowedBooks(uint256 tokenId,
                                                  address renter,
                                                  uint newExtendedTime) public {
                                              
    require(renter != address(0) && msg.sender != address(0), "Address is invalid");
    require(renter != msg.sender , "You can not renew with yourself");
    require(newExtendedTime >= MIN_TIME, "Extended time is invalid");

    _bookTemporary.updateRequestExtendTimeOfBorrowedBooks(tokenId,
                                                          renter, 
                                                          newExtendedTime, 
                                                          msg.sender);
  }

  function doAcceptRequest(uint idBorrowedBook, 
                           address borrower,
                           bool isAccept) public returns(bool){

    return _bookTemporary.doAcceptRequestAndCreateResponse(idBorrowedBook, 
                                                           borrower, 
                                                           msg.sender, 
                                                           isAccept);
  }

  function transferForSendedRequest(uint id, 
                                    address renter, 
                                    bool isExtend) public payable {
    require(renter != msg.sender, "You cannot make this transaction with yourself");
    uint totalPrice = _bookTemporary.transferForSendedRequest(id, 
                                                              renter, 
                                                              msg.sender, 
                                                              block.timestamp, 
                                                              isExtend);

    if (totalPrice > 0) {
      require(msg.value == totalPrice, "Total price is invalid");
      payable(renter).transfer(totalPrice);
    }
  }

  function getAllOwnedRequestsOnExtending() public view 
                                    returns(BookTemporary.Request[] memory) {
    require(msg.sender != address(0), "Address is invalid");
    return _bookTemporary.getAllOwnedRequest(msg.sender);
  }

  function getAllOwnedResponsesOnExtending() public view 
                                    returns(BookTemporary.Response[] memory) {
    require(msg.sender != address(0), "Address is invalid");
    return _bookTemporary.getAllOwnedResponse(msg.sender);
  }

  // Return true if success, owthersise return false
  function recallBorrowedBooks(uint tokenId, 
                               address renter, 
                               address borrower) public returns(bool) {
    require(renter == msg.sender, "You cannot take this book back, because you are not the renter");
    BookTemporary.BorrowedBook memory borrowedBook = 
                  _bookTemporary.getBorrowedBook(tokenId, renter, borrower);
    bool res = false;
    if(borrowedBook.tokenId != 0) {
      res = _bookTemporary.excRecallBorrowedBooks(tokenId, 
                                            renter, 
                                            borrower,
                                            borrowedBook.endTime);
      if(res) {
        _safeTransferFrom(borrower, msg.sender, tokenId, borrowedBook.amount, "");
      }
    } 
    return res;           
  }

  // Return total of borrowed books which is recalled, if total equal 0, 
  // you do not have any recallable books. Needed automate this function with Chainlink
  function recallAllBorrowedBooks() public returns(uint) {
    require(address(0) != msg.sender, "Your's address is invalid");
    return _bookTemporary.excRecallAllBorrowedBooks(msg.sender);           
  }

  function shareBooks(uint256 idBorrowedBook, 
                      uint price,
                      uint256 amount
                      ) public payable {
    
    BookTemporary.BorrowedBook memory borrowedBook = 
                _bookTemporary.getBorrowedBookFromId(idBorrowedBook);

    require(msg.sender == borrowedBook.borrower, "You do not own this borrowed book");
    require(msg.value == sharingPrice, "The cost of making this transaction is not valid");
    require(price > 0, "Price for shared books is invalid");
    require(amount > 0 && amount <= borrowedBook.amount, "Amount for shared books is invalid");
    require(block.timestamp < borrowedBook.endTime, "This book has expired rental");

    _bookTemporary.shareBooks(borrowedBook.tokenId, 
                              msg.sender, 
                              price, 
                              amount,
                              borrowedBook.startTime,
                              borrowedBook.endTime);
  }

  function getAllBooksOnSharing() 
          public view returns (BookTemporary.SharedBook[] memory) {
    return _bookTemporary.getAllBooksOnSharing();
  }

  function getAllOwnedBooksOnSharing() 
          public view returns (BookTemporary.SharedBook[] memory) {
    require(msg.sender != address(0), "Address is invalid");
    return _bookTemporary.getAllOwnedBooksOnSharing(msg.sender);
  }

  function getAllSharedBook() 
          public view returns (BookTemporary.SharedBook[] memory) {
    return _bookTemporary.getAllSharedBook();
  }

  function getAllOwnedSharedBook() 
          public view returns (BookTemporary.SharedBook[] memory) {
    require(msg.sender != address(0), "Address is invalid");
    return _bookTemporary.getAllOwnedSharedBook(msg.sender);
  }

  function updateBooksOnSharing(uint idBorrowedBook, 
                                   uint newPrice, 
                                   uint newAmount) public {
    BookTemporary.BorrowedBook memory borrowedBook = 
                _bookTemporary.getBorrowedBookFromId(idBorrowedBook);
    require(msg.sender == borrowedBook.borrower, "You do not own this borrowed book");
    require(borrowedBook.tokenId != 0, "Token id is invalid");
    require(newPrice > 0, "Price for shared books is invalid");
    require(newAmount > 0 && newAmount <= borrowedBook.amount, "Amount for shared books is invalid");

    _bookTemporary.updateBooksOnSharing(borrowedBook.tokenId, msg.sender, newPrice, newAmount);
  }

  function takeBooksOnSharing(uint idBorrowedBook, 
                              address sharer, 
                              uint amount) public payable {
    require(sharer != address(0) && msg.sender != address(0), "Addresses is invalid");
    require(idBorrowedBook > 0, "Id Borrowed book is invalid");
    BookTemporary.BorrowedBook memory borrowedBook = 
                    _bookTemporary.getBorrowedBookFromId(idBorrowedBook);
    require(sharer == borrowedBook.borrower, "You do not have this borrowed book");
    require(borrowedBook.tokenId != 0, "Token id is invalid");

    uint price = _bookTemporary.takeBooksOnSharingAndUpdateBorrowedBook(idBorrowedBook,
                                                                        sharer,
                                                                        msg.sender, 
                                                                        amount);
    uint tokenId = borrowedBook.tokenId;
    if (price != 0 && tokenId != 0) {
      _safeTransferFrom(sharer, msg.sender, tokenId, amount, "");
      // The amount you pay for this transaction will not depend on the period of borrowing the book,
      // the price will be set by the sharer
      uint totalPrice = price * amount;
      payable(sharer).transfer(totalPrice);
    } else {
      require(false,
           "Take Books On Sharing execution failed");
    }
    
  }
  

}