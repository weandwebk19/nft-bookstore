pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BookStore is ERC1155URIStorage {
  using Counters for Counters.Counter;

  struct BookVersion {
    uint256 price;
    address author;
    uint256 quantity;
  }

  event BookVersionCreated (
    uint256 tokenId,
    uint256 price,
    address author,
    uint256 quantity
  );

  uint public listingPrice = 0.025 ether;
  Counters.Counter private _listedItems;
  Counters.Counter private _bookVersionIds;

  mapping(uint256 => BookVersion) private _idToBookVersion;
  mapping(string => bool) private _usedTokenURIs;

  constructor() ERC1155("https://example.com/api/{id}.json") {
  }

  function getBookVersion(uint _bookVersionId) public view returns (BookVersion memory) {
    return _idToBookVersion[_bookVersionId];
  }

  function bookVersionPrice(uint256 _bookVersionId) public view returns(uint256) {
  return _idToBookVersion[_bookVersionId].price;
  }

  function bookVersionAuthor(uint256 _bookVersionId) public view returns(address) {
    return _idToBookVersion[_bookVersionId].author;
  }

  function bookVersionQuantity(uint256 _bookVersionId) public view returns(uint256) {
    return _idToBookVersion[_bookVersionId].quantity;
  }

  function listedItemsCount() public view returns (uint) {
    return _listedItems.current();
  }

  function tokenURIExists(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI] == true;
  }

  function publish(string memory tokenURI, uint256 _price, uint256 _quantity)  public payable returns (uint) {
    require(!tokenURIExists(tokenURI), "Token URI already exists");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _bookVersionIds.increment();
    _listedItems.increment();

    uint newTokenId = _bookVersionIds.current();

    _mint(msg.sender, newTokenId, _quantity, "");

    _idToBookVersion[newTokenId] = BookVersion(_price, msg.sender, _quantity);

    _setURI(newTokenId, tokenURI);
    _createBookVersion(newTokenId, _price, _quantity);
    _usedTokenURIs[tokenURI] = true;

    return newTokenId;
  }

  function _createBookVersion(
    uint tokenId,
    uint price,
    uint256 quantity
  ) private {
    require(price > 0, "Price must be at least 1 wei");

    _idToBookVersion[tokenId] = BookVersion(
      price,
      msg.sender,
      quantity
    );

    emit BookVersionCreated(tokenId, price, msg.sender, quantity);
  }
}