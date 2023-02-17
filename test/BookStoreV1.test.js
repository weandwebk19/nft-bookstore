// const BookStoreV1 = artifacts.require("BookStoreV1");
// const { ethers } = require("ethers");

// contract("BookStoreV1", (accounts) => {
//   let _contract = null;
//   let _bookVersionPrice = ethers.utils.parseEther("0.3").toString();
//   let _bookVersionQuantity = 100;
//   let _listingPrice = ethers.utils.parseEther("0.025").toString();

//   before(async () => {
//     _contract = await BookStoreV1.deployed();
//   });

//   describe("Publish", () => {
//     const tokenURI = "https://test.com";
//     before(async () => {
//       await _contract.publish(
//         tokenURI,
//         _bookVersionPrice,
//         _bookVersionQuantity,
//         {
//           from: accounts[0],
//           value: _listingPrice
//         }
//       );
//     });

//     it("author of the first BookVersion should be address[0]", async () => {
//       const author = await _contract.bookVersionAuthor(1);
//       assert.equal(
//         author,
//         accounts[0],
//         "author of BookVersion is not matching address[0]"
//       );
//     });

//     it("first BookVersion should point to the correct tokenURI", async () => {
//       const actualTokenURI = await _contract.uri(1);

//       assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//     });

//     it("should not be possible to create a BookVersion with used tokenURI", async () => {
//       try {
//         await _contract.publish(
//           tokenURI,
//           _bookVersionPrice,
//           _bookVersionQuantity,
//           {
//             from: accounts[0],
//             value: _listingPrice
//           }
//         );
//       } catch (error) {
//         assert(error, "BookVersion was minted with previously used tokenURI");
//       }
//     });

//     it("should have one listed item", async () => {
//       const listedItemCount = await _contract.listedItemsCount();
//       assert.equal(
//         listedItemCount.toNumber(),
//         1,
//         "Listed items count is not 1"
//       );
//     });

//     it("should have create BookVersion item", async () => {
//       const bookversion = await _contract.getBookVersion(1);

//       assert.equal(
//         bookversion.price,
//         _bookVersionPrice,
//         "BookVersion price is not correct"
//       );
//       assert.equal(bookversion.author, accounts[0], "Author is not account[0]");
//       assert.equal(
//         bookversion.quantity,
//         _bookVersionQuantity,
//         "BookVersion quantity is not correct"
//       );
//     });

//     it("should increases the book id", async () => {
//       const bookVersionQuantity = 50;
//       const author = accounts[1];
//       await _contract.publish(
//         "https://test1.com",
//         _bookVersionPrice,
//         bookVersionQuantity,
//         {
//           from: author,
//           value: _listingPrice
//         }
//       );

//       let author_balance = await _contract.balanceOf(author, 2);
//       author_balance = parseInt(author_balance);

//       assert.equal(author_balance, bookVersionQuantity);
//     });

//     it("should be return exactly base URI", async () => {
//       const uri = await _contract.uri;

//       console.log("base URI", uri);
//       assert.equal(
//         uri,
//         "https://example.com/api/{id}.json",
//         "Uri is not correct"
//       );
//     });
//   });
// });
