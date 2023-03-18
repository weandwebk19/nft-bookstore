import { EthersContractContextV5 } from "ethereum-abi-types-generator";
import {
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
  ContractInterface,
  ContractTransaction
} from "ethers";

export type ContractContext = EthersContractContextV5<
  BookStoreContract,
  BookStoreContractMethodNames,
  BookStoreContractEventsContext,
  BookStoreContractEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type BookStoreContractEvents =
  | "ApprovalForAll"
  | "BorrowedBookCreated"
  | "ListedBookCreated"
  | "NFTBookCreated"
  | "OwnershipTransferred"
  | "RentedBookCreated"
  | "TransferBatch"
  | "TransferSingle"
  | "URI";
export interface BookStoreContractEventsContext {
  ApprovalForAll(...parameters: any): EventFilter;
  BorrowedBookCreated(...parameters: any): EventFilter;
  ListedBookCreated(...parameters: any): EventFilter;
  NFTBookCreated(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  RentedBookCreated(...parameters: any): EventFilter;
  TransferBatch(...parameters: any): EventFilter;
  TransferSingle(...parameters: any): EventFilter;
  URI(...parameters: any): EventFilter;
}
export type BookStoreContractMethodNames =
  | "new"
  | "balanceOf"
  | "balanceOfBatch"
  | "borrowRentedBooks"
  | "buyListedBooks"
  | "getAllBorrowedBooks"
  | "getAllListedBooks"
  | "getAllRentedBooks"
  | "getAmountOfBorrowedBooks"
  | "getAmountOfListedBooks"
  | "getAmountOfRentedBooks"
  | "getBorrowedBook"
  | "getIdBorrowedBook"
  | "getIdListedBook"
  | "getIdRentedBook"
  | "getListedBook"
  | "getRentedBook"
  | "getTotalOwnedBorrowedBook"
  | "getTotalOwnedListedBook"
  | "getTotalOwnedRentedBook"
  | "isApprovedForAll"
  | "isListed"
  | "isRented"
  | "listingPrice"
  | "owner"
  | "renounceOwnership"
  | "rentRentedBooks"
  | "rentingPrice"
  | "safeBatchTransferFrom"
  | "safeTransferFrom"
  | "sellListedBooks"
  | "setApprovalForAll"
  | "supportsInterface"
  | "transferOwnership"
  | "updateListedBookFromSale"
  | "updateRentedBookFromRenting"
  | "uri"
  | "setListingPrice"
  | "setRentingPrice"
  | "setTokenUri"
  | "getBalanceOfOwnerBook"
  | "getNftBook"
  | "isTokenURIExist"
  | "mintBook"
  | "isOwnerOfToken"
  | "getOwnedNFTBooks"
  | "getOwnedListedBooks"
  | "getCreatedNFTBooks"
  | "getTotalOwnedToken"
  | "getOwnedRentedBooks"
  | "getOwnedBorrowedBooks"
  | "getOwnedBorrowedBooks"
  | "getAmountOfAllTypeBooksUnsellable"
  | "getAmountOfAllTypeBooksUnrentable"
  | "sellBooks"
  | "rentBooks"
  | "updateBookFromSale"
  | "updateBookFromRenting"
  | "getAllBooksOnSale"
  | "getAllBooksOnRenting"
  | "buyBooks"
  | "borrowBooks";
export interface ApprovalForAllEventEmittedResponse {
  account: string;
  operator: string;
  approved: boolean;
}
export interface BorrowedBookCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  renter: string;
  borrower: string;
  price: BigNumberish;
  amount: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
}
export interface ListedBookCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  seller: string;
  price: BigNumberish;
  amount: BigNumberish;
}
export interface NFTBookCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  author: string;
  balance: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface RentedBookCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  renter: string;
  price: BigNumberish;
  amount: BigNumberish;
}
export interface TransferBatchEventEmittedResponse {
  operator: string;
  from: string;
  to: string;
  ids: BigNumberish[];
  values: BigNumberish[];
}
export interface TransferSingleEventEmittedResponse {
  operator: string;
  from: string;
  to: string;
  id: BigNumberish;
  value: BigNumberish;
}
export interface URIEventEmittedResponse {
  value: string;
  id: BigNumberish;
}
export interface BorrowedbookResponse {
  tokenId: BigNumber;
  0: BigNumber;
  renter: string;
  1: string;
  borrower: string;
  2: string;
  price: BigNumber;
  3: BigNumber;
  amount: BigNumber;
  4: BigNumber;
  startTime: BigNumber;
  5: BigNumber;
  endTime: BigNumber;
  6: BigNumber;
}
export interface ListedbookResponse {
  tokenId: BigNumber;
  0: BigNumber;
  seller: string;
  1: string;
  price: BigNumber;
  2: BigNumber;
  amount: BigNumber;
  3: BigNumber;
}
export interface RemoveItemFromAllListedBooksRequest {
  tokenId: BigNumberish;
  seller: string;
}
export interface BookStoreContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param listedBookStorage Type: address, Indexed: false
   * @param rentedBookStorage Type: address, Indexed: false
   */
  "new"(
    listedBookStorage: string,
    rentedBookStorage: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   */
  balanceOf(
    account: string,
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accounts Type: address[], Indexed: false
   * @param ids Type: uint256[], Indexed: false
   */
  balanceOfBatch(
    accounts: string[],
    ids: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   * @param borrower Type: address, Indexed: false
   * @param value Type: uint256, Indexed: false
   */
  borrowRentedBooks(
    tokenId: BigNumberish,
    renter: string,
    amount: BigNumberish,
    price: BigNumberish,
    startTime: BigNumberish,
    endTime: BigNumberish,
    borrower: string,
    value: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param seller Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param buyer Type: address, Indexed: false
   * @param value Type: uint256, Indexed: false
   */
  buyListedBooks(
    tokenId: BigNumberish,
    seller: string,
    amount: BigNumberish,
    buyer: string,
    value: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllBorrowedBooks(
    overrides?: ContractCallOverrides
  ): Promise<BorrowedbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllListedBooks(
    overrides?: ContractCallOverrides
  ): Promise<ListedbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllRentedBooks(
    overrides?: ContractCallOverrides
  ): Promise<RentedbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  getAmountOfBorrowedBooks(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  getAmountOfListedBooks(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  getAmountOfRentedBooks(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param borrower Type: address, Indexed: false
   */
  getBorrowedBook(
    tokenId: BigNumberish,
    renter: string,
    borrower: string,
    overrides?: ContractCallOverrides
  ): Promise<BorrowedbookResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param borrower Type: address, Indexed: false
   */
  getIdBorrowedBook(
    tokenId: BigNumberish,
    renter: string,
    borrower: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param seller Type: address, Indexed: false
   */
  getIdListedBook(
    tokenId: BigNumberish,
    seller: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   */
  getIdRentedBook(
    tokenId: BigNumberish,
    renter: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param seller Type: address, Indexed: false
   */
  getListedBook(
    tokenId: BigNumberish,
    seller: string,
    overrides?: ContractCallOverrides
  ): Promise<ListedbookResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   */
  getRentedBook(
    tokenId: BigNumberish,
    renter: string,
    overrides?: ContractCallOverrides
  ): Promise<RentedbookResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param borrower Type: address, Indexed: false
   */
  getTotalOwnedBorrowedBook(
    borrower: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param seller Type: address, Indexed: false
   */
  getTotalOwnedListedBook(
    seller: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param renter Type: address, Indexed: false
   */
  getTotalOwnedRentedBook(
    renter: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param operator Type: address, Indexed: false
   */
  isApprovedForAll(
    account: string,
    operator: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  isListed(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  isRented(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  listingPrice(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  rentRentedBooks(
    tokenId: BigNumberish,
    renter: string,
    price: BigNumberish,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  rentingPrice(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param ids Type: uint256[], Indexed: false
   * @param amounts Type: uint256[], Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeTransferFrom(
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param seller Type: address, Indexed: false
   */
  sellListedBooks(
    tokenId: BigNumberish,
    price: BigNumberish,
    amount: BigNumberish,
    seller: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param operator Type: address, Indexed: false
   * @param approved Type: bool, Indexed: false
   */
  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param newPrice Type: uint256, Indexed: false
   * @param newAmount Type: uint256, Indexed: false
   * @param seller Type: address, Indexed: false
   */
  updateListedBookFromSale(
    tokenId: BigNumberish,
    newPrice: BigNumberish,
    newAmount: BigNumberish,
    seller: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param newPrice Type: uint256, Indexed: false
   * @param newAmount Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   */
  updateRentedBookFromRenting(
    tokenId: BigNumberish,
    newPrice: BigNumberish,
    newAmount: BigNumberish,
    renter: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  uri(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newPrice Type: uint256, Indexed: false
   */
  setListingPrice(
    newPrice: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newPrice Type: uint256, Indexed: false
   */
  setRentingPrice(
    newPrice: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param tokenURI Type: string, Indexed: false
   */
  setTokenUri(
    tokenId: BigNumberish,
    tokenURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getBalanceOfOwnerBook(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getNftBook(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<NftbookResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenURI Type: string, Indexed: false
   */
  isTokenURIExist(
    tokenURI: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenURI Type: string, Indexed: false
   * @param balance Type: uint256, Indexed: false
   */
  mintBook(
    tokenURI: string,
    balance: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  isOwnerOfToken(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedNFTBooks(
    overrides?: ContractCallOverrides
  ): Promise<NftbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedListedBooks(
    overrides?: ContractCallOverrides
  ): Promise<ListedbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getCreatedNFTBooks(
    overrides?: ContractCallOverrides
  ): Promise<NftbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getTotalOwnedToken(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedRentedBooks(
    overrides?: ContractCallOverrides
  ): Promise<RentedbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedBorrowedBooks(
    overrides?: ContractCallOverrides
  ): Promise<BorrowedbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param borrower Type: address, Indexed: false
   */
  getOwnedBorrowedBooks(
    borrower: string,
    overrides?: ContractCallOverrides
  ): Promise<BorrowedbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  getAmountOfAllTypeBooksUnsellable(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  getAmountOfAllTypeBooksUnrentable(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  sellBooks(
    tokenId: BigNumberish,
    price: BigNumberish,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  rentBooks(
    tokenId: BigNumberish,
    price: BigNumberish,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param newPrice Type: uint256, Indexed: false
   * @param newAmount Type: uint256, Indexed: false
   * @param seller Type: address, Indexed: false
   */
  updateBookFromSale(
    tokenId: BigNumberish,
    newPrice: BigNumberish,
    newAmount: BigNumberish,
    seller: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param newPrice Type: uint256, Indexed: false
   * @param newAmount Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   */
  updateBookFromRenting(
    tokenId: BigNumberish,
    newPrice: BigNumberish,
    newAmount: BigNumberish,
    renter: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllBooksOnSale(
    overrides?: ContractCallOverrides
  ): Promise<ListedbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllBooksOnRenting(
    overrides?: ContractCallOverrides
  ): Promise<RentedbookResponse[]>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param seller Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  buyBooks(
    tokenId: BigNumberish,
    seller: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param rentalDuration Type: uint256, Indexed: false
   */
  borrowBooks(
    tokenId: BigNumberish,
    renter: string,
    price: BigNumberish,
    amount: BigNumberish,
    rentalDuration: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
