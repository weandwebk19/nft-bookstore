// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

  struct ListedBook {
    uint256 tokenId;
    address seller;
    uint price;
    uint amount;
  }

  struct PrimaryKeyListedBook {
    uint256 tokenId;
    address seller;
  }

  event ListedBookCreated (
    uint tokenId,
    address seller,
    uint price,
    uint amount
  );

  uint MAX_BALANCE = 500;
  uint public listingPrice = 0.025 ether;
  Counters.Counter private _tokenIds;

  mapping (uint => NFTBook) _idToNFTBook;
  mapping (uint => mapping (address => ListedBook)) _keyToListedBook; // Key is tokenId and seller
  mapping (string => bool) private _usedTokenURIs;

  mapping(address => mapping(uint => uint)) private _ownedTokens;
  mapping(address => uint) private _totalOwnedToken;

  mapping(uint => PrimaryKeyListedBook) private _allListedBook;
  mapping (uint => mapping (address => uint)) _keyToIndexAllListedBooks; // Key is tokenId and seller
  Counters.Counter private _listedBooks;

  constructor() ERC1155("https://example.com/api/{id}.json") {}

  function setListingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    listingPrice = newPrice;
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

    // Buy books
    if (from != address(0) && to != address(0) && to != from) {
      uint tokenId = ids[0];
      _addTokenToOwnerEnumeration(to, tokenId);
      if (ERC1155.balanceOf(from, tokenId) == 0) {
        _removeTokenFromOwnerEnumeration(from, tokenId);
      }
    }

  }

  // Not necessary

  // function getBalanceOfBook(uint256 tokenId, address owner) public view returns (uint256) {
  //   require(isOwnerOfToken(tokenId, owner), "You do not own this token");
  //   return ERC1155.balanceOf(owner, tokenId);
  // }

  function _addTokenToOwnerEnumeration(address owner, uint tokenId) private {
    uint length = _totalOwnedToken[owner];
    _ownedTokens[owner][length] = tokenId;
    _totalOwnedToken[owner]++;
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

  function getListedBook(uint tokenId, address seller) public view returns (ListedBook memory) {
    return _keyToListedBook[tokenId][seller];
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

  function _createListedBook(uint tokenId, address seller, uint256 price, uint amount) private {
    _keyToListedBook[tokenId][seller] = ListedBook(tokenId, seller, price, amount);
    // _allListedBook[_listedBooks.current()] = ListedBook(tokenId, seller, price, amount);
    _allListedBook[_listedBooks.current()] = PrimaryKeyListedBook(tokenId, seller);
    _keyToIndexAllListedBooks[tokenId][seller] = _listedBooks.current();
    _listedBooks.increment();
    emit ListedBookCreated(tokenId, seller, price, amount);
  }

  function isOwnerOfToken(uint tokenId, address owner) public view returns(bool) {
    // uint total = _totalOwnedToken[owner];
    // for (uint i = 0; i < total; i++) {
    //   if (_ownedTokens[owner][i] == tokenId) {
    //     return true;
    //   }
    // }
    // return false;

    // Suggest
    return ERC1155.balanceOf(owner, tokenId) > 0;
  }

  function getOwnedNFTBooks() public view returns (NFTBook[] memory) {
    uint ownedItemsCount = _totalOwnedToken[msg.sender];
    NFTBook[] memory books = new NFTBook[](ownedItemsCount);

    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      NFTBook memory book = _idToNFTBook[tokenId];

      books[i] = book;
    }

    return books;
  }

  function getOwnedListedBooks() public view returns (ListedBook[] memory) {
    uint ownedItemsCount = _totalOwnedToken[msg.sender];
    ListedBook[] memory books = new ListedBook[](ownedItemsCount);

    uint currentIndex = 0;
    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = _ownedTokens[msg.sender][i];
      ListedBook memory book = _keyToListedBook[tokenId][msg.sender];

      if(book.tokenId != 0 && book.seller != address(0)) {
        books[currentIndex] = book;
        currentIndex++;
      }
    }

    return books;
  }

  // TODO: not necessary

  // return false: You don't have enough books to sell
  // function checkQuantityToSell(uint256 quantity, uint256 tokenId) public view returns(bool) {
  //   return quantity <= getBalanceOfBook(tokenId, msg.sender) && quantity > 0;
  // }

  // return i > 0: listed book on sale
  // return -1: unlisted book on sale
  // function getIdListedBookOnSale(uint256 tokenId,
  //                               uint price,
  //                               address seller) public view returns (int) {
  //   for (uint256 i = 0; i < _listedBooks.current(); i++) {
  //     ListedBook memory listedBook = _allListedBook[i];

  //     if (tokenId == listedBook.tokenId &&
  //         seller == listedBook.seller &&
  //         price == listedBook.price) {
  //       return int(i);
  //     }
  //   }
  //   return -1;
  // }

  function getAmountOfListedBook(uint256 tokenId, address seller) public view returns(uint256) {
    return _keyToListedBook[tokenId][seller].amount;
  }

  function sellBooks(uint256 tokenId, uint price, uint256 amount) public payable {
    require(isOwnerOfToken(tokenId, msg.sender),
          "You are not the owner of this token");
    require(getAmountOfListedBook(tokenId, msg.sender) + amount <= ERC1155.balanceOf(msg.sender, tokenId) &&
           amount > 0,
          "You don't have enough books to sell");
    require(msg.value == listingPrice,
           "Price must be equal to listing price");
    // int idListedBook = getIdListedBookOnSale(tokenId, price, msg.sender);
    ListedBook memory listedBook = _keyToListedBook[tokenId][msg.sender];

    if (listedBook.tokenId == 0 && listedBook.seller == address(0)) {
      _createListedBook(tokenId, msg.sender, price, amount);

    } else {
      // require(checkQuantityToSell(listedBook.amount + amount,
      //                          tokenId),
      //                         "You don't have enough books to sell"); // TODO: not necessary
      _keyToListedBook[tokenId][msg.sender].amount += amount;
    }
  }

  function removeItemFromAllListedBooks(PrimaryKeyListedBook memory value) public {
    uint index = _keyToIndexAllListedBooks[value.tokenId][value.seller];
    uint length = _listedBooks.current();
    _allListedBook[index] = _allListedBook[length - 1];
    delete _allListedBook[length - 1];
    _listedBooks.decrement();
  }

  function decreaseListedBookFromSale(uint256 tokenId, uint256 amount, address seller) public {
    require(isOwnerOfToken(tokenId, seller),
          "You are not the owner of this token");
    require(amount > 0,
          "removed amount of book is invalid");
    
    // int idListedBook = getIdListedBookOnSale(tokenId, price, seller);

    // ListedBook memory listedBook = getListedBook(uint256(idListedBook));
    ListedBook memory listedBook = _keyToListedBook[tokenId][seller];
    require(listedBook.amount > 0,
          "Your book are not on sale");

    if (amount < listedBook.amount) {
      _keyToListedBook[tokenId][seller].amount -= amount;
    } else {
      // uint256 lastIndexListedBook = _listedBooks.current() - 1;
      // ListedBook memory lastListedBook = getListedBook(uint256(lastIndexListedBook));
      // _allListedBook[uint256(idListedBook)] = lastListedBook;
      removeItemFromAllListedBooks(PrimaryKeyListedBook(tokenId, seller));
      delete _keyToListedBook[tokenId][seller];
    }
  }

  function getAllBooksOnSale() public view returns (ListedBook[] memory) {
    ListedBook[] memory books = new ListedBook[](_listedBooks.current());

    uint currentIndex = 0;
    for (uint i = 0; i < _listedBooks.current(); i++) {
      PrimaryKeyListedBook memory keyListedBook = _allListedBook[i];
      ListedBook memory book = _keyToListedBook[keyListedBook.tokenId][keyListedBook.seller];
      if(book.tokenId != 0 && book.seller != address(0)) {
        books[currentIndex] = book;
        currentIndex++;
      }
    }
    return books;
  }

  function buyBooks(uint256 tokenId, address seller, uint256 amount) public payable {
    // int idListedBook = getIdListedBookOnSale(tokenId, price, seller);
    // ListedBook memory listedBook = getListedBook(uint256(idListedBook));
    ListedBook memory listedBook = _keyToListedBook[tokenId][seller];
    require(msg.sender != listedBook.seller, "You can't buy your own books on sale");
    require(msg.value == amount * listedBook.price, "Please submit the asking price");
    require(amount <= listedBook.amount && amount > 0, "Amount is invalid");

    uint256 totalPrice = amount * listedBook.price;
    decreaseListedBookFromSale(tokenId, amount, seller);
    _safeTransferFrom(seller, msg.sender, tokenId, amount, "");
    payable(seller).transfer(totalPrice);
  }

}