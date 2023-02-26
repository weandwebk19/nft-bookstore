/* eslint-disable prettier/prettier */
const instance = await BookStore.deployed();

instance.mintBook("https://gateway.pinata.cloud/ipfs/QmPzYhHg14rmzuT41za7c6HugRiBxPvc5CzTdQ49SNTm7f", 150, {value: "25000000000000000",from: accounts[0]});
instance.mintBook("https://gateway.pinata.cloud/ipfs/QmRuVQnMTWkv3RnAJCtDsSSU6ij5vhBAUqTiwfdy9XLgx9", 100, {value: "25000000000000000",from: accounts[0]});