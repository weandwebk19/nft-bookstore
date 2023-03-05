// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ListedBookStorage.sol";
import "./RentedBookStorage.sol";

contract BookStore is ERC1155URIStorage, Ownable {
  using Counters for Counters.Counter;

  struct NFTBook {
    uint256 tokenId;
    address author;
    uint256 balance;
  }

  event NFTBookCreated (
    uint256 tokenId,
    address author,
    uint256 balance
  );

  ListedBookStorage private _listedBookStorage;
  RentedBookStorage private _rentedBookStorage;

  uint MAX_BALANCE = 500;
  uint MIN_TIME = 604800; // Rental period is at least one week
  uint public listingPrice = 0.025 ether;
  uint public rentingPrice = 0.001 ether;
  Counters.Counter private _tokenIds;

  mapping (uint => NFTBook) _idToNFTBook;
  mapping (string => bool) private _usedTokenURIs;

  mapping(address => mapping(uint => uint)) private _ownedTokens;
  mapping(address => uint) private _totalOwnedToken;


  constructor(ListedBookStorage  listedBookStorage,
               RentedBookStorage rentedBookStorage)
    ERC1155("https://example.com/api/{id}.json") {

    _listedBookStorage = listedBookStorage;
    _rentedBookStorage = rentedBookStorage;

  }

  function setListingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    listingPrice = newPrice;
  }

  function setRentingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    rentingPrice = newPrice;
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

  function isTokenURIExist(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI];
  }

  function mintBook(string memory tokenURI, uint256 balance)
    public payable returns (uint) {

    require(!isTokenURIExist(tokenURI),
           "Token URI already exists");
    require(balance > 0 && balance <= MAX_BALANCE,
          "The number of books you want to publish is not appropriate");
    require(msg.value == listingPrice,
           "Price must be equal to listing price");

    _tokenIds.increment();
    uint newTokenId = _tokenIds.current();

    _mint(msg.sender, newTokenId, balance, "");
    _setURI(newTokenId, tokenURI);
    _createNftBook(newTokenId, balance);

    _usedTokenURIs[tokenURI] = true;
    return newTokenId;
  }

  function _createNftBook(uint tokenId, uint256 balance) private {
    _idToNFTBook[tokenId] = NFTBook(tokenId, msg.sender, balance);
    emit NFTBookCreated(tokenId, msg.sender, balance);
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

  function getTotalOwnedToken() public view returns(uint) {
    return _totalOwnedToken[msg.sender];
  }

  function getOwnedRentedBooks() public view returns (RentedBookStorage.RentedBook[] memory) {
    uint ownedRentedBookCount = _rentedBookStorage.getTotalOwnedRentedBook(msg.sender);
    uint ownedItemsCount = getTotalOwnedToken();
    RentedBookStorage.RentedBook[] memory books = new RentedBookStorage.RentedBook[](ownedRentedBookCount);

    uint currentIndex = 0;
    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      RentedBookStorage.RentedBook memory book = _rentedBookStorage.getRentedBook(tokenId, msg.sender);
      if (book.tokenId != 0 &&
          book.renter != address(0)) {

        books[currentIndex] = book;
        currentIndex++;
      }
    }

    return books;
  }

  function getOwnedBorrowedBooks() public view returns (RentedBookStorage.BorrowedBook[] memory) {
    RentedBookStorage.BorrowedBook[] memory borrowedBooks = 
                                    _rentedBookStorage.getOwnedBorrowedBooks(msg.sender);
    
    require(borrowedBooks.length == 
            _rentedBookStorage.getTotalOwnedBorrowedBook(msg.sender),
            "Length of owned borrowed books is invalid");
      
    return borrowedBooks;
  }

  function getAmountOfAllTypeBooksUnsellable(uint256 tokenId, address owner) public view returns(uint) {
    return _listedBookStorage.getAmountOfListedBooks(tokenId, owner) +
          _rentedBookStorage.getAmountOfRentedBooks(tokenId, owner) + 
          _rentedBookStorage.getAmountOfBorrowedBooks(tokenId, owner);
  }

  function getAmountOfAllTypeBooksUnrentable(uint256 tokenId, address owner) public view returns(uint) {
    return _listedBookStorage.getAmountOfListedBooks(tokenId, owner) +
          _rentedBookStorage.getAmountOfRentedBooks(tokenId, owner);
  }

  function sellBooks(uint256 tokenId,
                    uint price,
                    uint256 amount) public payable {
    require(isOwnerOfToken(tokenId, msg.sender),
          "You are not the owner of this token");
    require(getAmountOfAllTypeBooksUnsellable(tokenId, msg.sender) + amount <= ERC1155.balanceOf(msg.sender, tokenId),
          "You don't have enough books to sell");
    require(msg.value == listingPrice,
           "Price must be equal to listing price");
    _listedBookStorage.sellListedBooks(tokenId, price, amount, msg.sender);
  }

  function rentBooks(uint256 tokenId,
                    uint price,
                    uint256 amount) public payable {
    require(isOwnerOfToken(tokenId, msg.sender),
          "You are not the owner of this token");
    require(getAmountOfAllTypeBooksUnrentable(tokenId, msg.sender) +
           amount <= ERC1155.balanceOf(msg.sender, tokenId) &&
           amount > 0,
          "You don't have enough books to sell");
    require(msg.value == rentingPrice,
           "Price must be equal to renting price");
    _rentedBookStorage.rentRentedBooks(tokenId, msg.sender, price, amount);

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
    
    _rentedBookStorage.updateRentedBookFromRenting(tokenId,
                                                  newPrice,
                                                  newAmount,
                                                  renter);
  }

  function getAllBooksOnSale() public view returns (ListedBookStorage.ListedBook[] memory) {
    return _listedBookStorage.getAllListedBooks();
  }

  function getAllBooksOnRenting() public view returns (RentedBookStorage.RentedBook[] memory) {
    return _rentedBookStorage.getAllRentedBooks();
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
    uint256 totalPrice = _rentedBookStorage.borrowRentedBooks(tokenId,
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

}