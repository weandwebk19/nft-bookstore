pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BookStoreV1 is ERC1155URIStorage {
  using Counters for Counters.Counter;

  struct BookVersion {
    uint tokenId;
    address author;
    uint256 quantity;
  }

  enum StatusNftBook{ UNLISTED, LISTED, RENTING, RENTED }

  struct NftBook {
    uint tokenId;
    address owner;
    uint256 price;
    uint256 amount;
    StatusNftBook status;
  }

  // event NftBookCreated (
  //   uint256 tokenId,
  //   uint256 price,
  //   address author,
  //   uint256 quantity
  // );

  uint public listingPrice = 0.025 ether;
  Counters.Counter private _listedBooks;
  Counters.Counter private _tokenIds;

  mapping (uint => BookVersion) _idToBookVersion;
  mapping (uint => NftBook) _idToNftBook;
  mapping (uint => NftBook) _usedBooks;

  constructor() ERC1155("https://example.com/api/{id}.json") {
  }

  // function getBookVersion(uint _bookVersionId) public view returns (BookVersion memory) {
  //   return _idToBookVersion[_bookVersionId];
  // }

  // function bookVersionPrice(uint256 _bookVersionId) public view returns(uint256) {
  // return _idToBookVersion[_bookVersionId].price;
  // }

  // function bookVersionAuthor(uint256 _bookVersionId) public view returns(address) {
  //   return _idToBookVersion[_bookVersionId].author;
  // }

  // function bookVersionQuantity(uint256 _bookVersionId) public view returns(uint256) {
  //   return _idToBookVersion[_bookVersionId].quantity;
  // }

  // function listedItemsCount() public view returns (uint) {
  //   return _listedItems.current();
  // }

  // function tokenURIExists(string memory tokenURI) public view returns (bool) {
  //   return _usedTokenURIs[tokenURI] == true;
  // }

  function publish(uint256 price, uint256 quantity)  public payable returns (uint) {
    // require(!tokenURIExists(tokenURI), "Token URI already exists");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _tokenIds.increment();
    _listedBooks.increment();

    uint newTokenId = _tokenIds.current();

    _mint(msg.sender, newTokenId, quantity, "");

    _idToBookVersion[newTokenId] = BookVersion(newTokenId, msg.sender, quantity);

    return newTokenId;
  }

  // function _createBookVersion(
  //   uint tokenId,
  //   uint price,
  //   uint256 quantity
  // ) private {
  //   require(price > 0, "Price must be at least 1 wei");

  //   _idToBookVersion[tokenId] = BookVersion(
  //     price,
  //     msg.sender,
  //     quantity
  //   );

  //   emit BookVersionCreated(tokenId, price, msg.sender, quantity);
  // }
}