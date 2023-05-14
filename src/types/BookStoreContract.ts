/* eslint-disable prettier/prettier */
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
  | "NFTBookCreated"
  | "OwnershipTransferred"
  | "TransferBatch"
  | "TransferSingle"
  | "URI";
export interface BookStoreContractEventsContext {
  ApprovalForAll(...parameters: any): EventFilter;
  NFTBookCreated(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  TransferBatch(...parameters: any): EventFilter;
  TransferSingle(...parameters: any): EventFilter;
  URI(...parameters: any): EventFilter;
}
export type BookStoreContractMethodNames =
  | "new"
  | "balanceOf"
  | "balanceOfBatch"
  | "isApprovedForAll"
  | "lendingPrice"
  | "listingPrice"
  | "owner"
  | "renounceOwnership"
  | "safeBatchTransferFrom"
  | "safeTransferFrom"
  | "setApprovalForAll"
  | "sharingPrice"
  | "supportsInterface"
  | "transferOwnership"
  | "uri"
  | "getUri"
  | "setListingPrice"
  | "setLendingPrice"
  | "setSharingPrice"
  | "getAllRealOwnerOfTokenId"
  | "getBalanceOfOwnerBook"
  | "getNftBook"
  | "isTokenURIExist"
  | "mintBook"
  | "getSecretKey"
  | "isBookReadableByUser"
  | "isOwnerOfToken"
  | "getOwnedNFTBooks"
  | "getOwnedListedBooks"
  | "getOwnedLendingBooks"
  | "getAmountUnUsedBook"
  | "getAmountOfAllTypeBooksUntradeable"
  | "sellBooks"
  | "lendBooks"
  | "updateBookFromSale"
  | "updateBookFromRenting"
  | "buyBooks"
  | "borrowBooks"
  | "requestExtendTimeOfBorrowedBooks"
  | "updateRequestOfBorrowedBooks"
  | "doAcceptRequest"
  | "transferForSendedRequest"
  | "recallBorrowedBooks"
  | "recallAllBorrowedBooks"
  | "shareBooks"
  | "updateBooksOnSharing"
  | "takeBooksOnSharing"
  | "recallSharedBooks"
  | "recallAllSharedBooks"
  | "recallBooksOnSharing"
  | "recallAllBooksOnSharing";
export interface ApprovalForAllEventEmittedResponse {
  account: string;
  operator: string;
  approved: boolean;
}
export interface NFTBookCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  author: string;
  quantity: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
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
export interface NftbookResponse {
  tokenId: BigNumber;
  0: BigNumber;
  author: string;
  1: string;
  quantity: BigNumber;
  2: BigNumber;
}
export interface BooksellingResponse {
  tokenId: BigNumber;
  0: BigNumber;
  seller: string;
  1: string;
  buyer: string;
  2: string;
  price: BigNumber;
  3: BigNumber;
  amount: BigNumber;
  4: BigNumber;
}
export interface LendbookResponse {
  tokenId: BigNumber;
  0: BigNumber;
  renter: string;
  1: string;
  price: BigNumber;
  2: BigNumber;
  amount: BigNumber;
  3: BigNumber;
}
export interface BookStoreContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param bookSellingStorage Type: address, Indexed: false
   * @param bookTemporary Type: address, Indexed: false
   * @param listRealOwners Type: address, Indexed: false
   * @param secretKeyStorage Type: address, Indexed: false
   */
  "new"(
    bookSellingStorage: string,
    bookTemporary: string,
    listRealOwners: string,
    secretKeyStorage: string,
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
   */
  lendingPrice(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
   */
  sharingPrice(overrides?: ContractCallOverrides): Promise<BigNumber>;
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
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getUri(
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
  setLendingPrice(
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
  setSharingPrice(
    newPrice: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getAllRealOwnerOfTokenId(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>;
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
   * @param quantity Type: uint256, Indexed: false
   * @param privateKey Type: string, Indexed: false
   * @param iv Type: string, Indexed: false
   */
  mintBook(
    tokenURI: string,
    quantity: BigNumberish,
    privateKey: string,
    iv: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getSecretKey(
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  isBookReadableByUser(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
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
  ): Promise<BooksellingResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedLendingBooks(
    overrides?: ContractCallOverrides
  ): Promise<LendbookResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getAmountUnUsedBook(
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
  getAmountOfAllTypeBooksUntradeable(
    tokenId: BigNumberish,
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
  lendBooks(
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
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   * @param extendedAmount Type: uint256, Indexed: false
   * @param extendedTime Type: uint256, Indexed: false
   */
  requestExtendTimeOfBorrowedBooks(
    tokenId: BigNumberish,
    renter: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    extendedAmount: BigNumberish,
    extendedTime: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   * @param newExtendedAmount Type: uint256, Indexed: false
   * @param newExtendedTime Type: uint256, Indexed: false
   */
  updateRequestOfBorrowedBooks(
    tokenId: BigNumberish,
    renter: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    newExtendedAmount: BigNumberish,
    newExtendedTime: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idBorrowedBook Type: uint256, Indexed: false
   * @param borrower Type: address, Indexed: false
   * @param isAccept Type: bool, Indexed: false
   */
  doAcceptRequest(
    idBorrowedBook: BigNumberish,
    borrower: string,
    isAccept: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param id Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param isExtend Type: bool, Indexed: false
   */
  transferForSendedRequest(
    id: BigNumberish,
    renter: string,
    isExtend: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idBorrowedBook Type: uint256, Indexed: false
   */
  recallBorrowedBooks(
    idBorrowedBook: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  recallAllBorrowedBooks(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param idBorrowedBook Type: uint256, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  shareBooks(
    idBorrowedBook: BigNumberish,
    price: BigNumberish,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idBooksOnSharing Type: uint256, Indexed: false
   * @param newPrice Type: uint256, Indexed: false
   * @param newAmount Type: uint256, Indexed: false
   */
  updateBooksOnSharing(
    idBooksOnSharing: BigNumberish,
    newPrice: BigNumberish,
    newAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param idBooksOnSharing Type: uint256, Indexed: false
   */
  takeBooksOnSharing(
    idBooksOnSharing: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idSharedBook Type: uint256, Indexed: false
   */
  recallSharedBooks(
    idSharedBook: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  recallAllSharedBooks(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idBooksOnSharing Type: uint256, Indexed: false
   */
  recallBooksOnSharing(
    idBooksOnSharing: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  recallAllBooksOnSharing(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
