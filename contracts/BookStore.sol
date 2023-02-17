pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BookStore is ERC1155 {
  using Counters for Counters.Counter;

  struct NFTBook {
    uint256 tokenId;
    address author;
    uint256 quantity;
  }

  enum StatusUsedBook{ LISTED, UNLISTED, RENTING, RENTED }

  struct UsedBook {
    uint256 tokenId;
    uint256 amount;
    StatusUsedBook status;
    uint256 price;
    uint256 startTime;
    uint256 endTime;
  }

  uint public listingPrice = 0.025 ether;
  Counters.Counter private _listedBooks;
  Counters.Counter private _tokenIds;

  mapping (uint => NFTBook) _idToNftBook;
  mapping (uint => UsedBook) _idToUsedBook;
  mapping (uint => mapping (uint => address)) private _ownedUsedBooks;
  mapping (uint => UsedBook[]) private _usedBooks;

  constructor() ERC1155("https://example.com/api/{id}.json") {
  }

  function _updateOwner(uint tokenId, uint usedBookId, address owner) private {
    _ownedUsedBooks[tokenId][usedBookId] = owner;
  }

  function createBook(uint256 price, uint256 quantity)  public payable returns (uint) {
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _tokenIds.increment();
    _listedBooks.increment();

    uint newTokenId = _tokenIds.current();

    _mint(msg.sender, newTokenId, quantity, "");

    _idToNftBook[newTokenId] = NFTBook(newTokenId, msg.sender, quantity);
    _idToUsedBook[newTokenId] = UsedBook(newTokenId, quantity, StatusUsedBook.UNLISTED, price, 0, 0 );
    
    // Assign author is owner of all created books
    for (uint i = 0; i < quantity; i++) {
      _updateOwner(newTokenId, i, msg.sender);
    }

    return newTokenId;
  }

  function buyBooks(uint256 tokenId, uint256 quantity) {
    const buyer = msg.sender;
    uint price = _idToUsedBook[tokenId].price;
    // address owner = ERC1155.ownerOf(tokenId);

    // require(msg.sender != owner, "You already own this NFT");
    require(msg.value == price, "Please submit the asking price");

    safeTransferFrom(owner, buyer, tokenId, quantity);
    payable(owner).transfer(msg.value);
  }
}