const instance = await BookStore.deployed();
// instance.mintBook("https://gateway.pinata.cloud/ipfs/QmY3G2vnhXrgnYrUNeMsXkQqk7FrtqJpJGvWh9jUiPUjpK",100,{ value: "25000000000000000", from: accounts[0] });

// instance.mintBook("https://gateway.pinata.cloud/ipfs/QmdFFL2mmMNvCVTMRSGpZWgz1UkaQo9mW5vnRqtHUXw9b5",50,{ value: "25000000000000000", from: accounts[0] });

// instance.sellBooks(1, "300000000000000000", 50, {value: "25000000000000000",from: accounts[0]});

// instance.sellBooks(2, "200000000000000000", 50, {value: "25000000000000000",from: accounts[0]});

instance.getAllBooksOnSale();

// instance.mintBook("https://gateway.pinata.cloud/ipfs/QmPzYhHg14rmzuT41za7c6HugRiBxPvc5CzTdQ49SNTm7f",150,{ value: "25000000000000000", from: accounts[0] });
// instance.mintBook("https://gateway.pinata.cloud/ipfs/QmRuVQnMTWkv3RnAJCtDsSSU6ij5vhBAUqTiwfdy9XLgx9",100,{ value: "25000000000000000", from: accounts[0] });
