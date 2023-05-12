import { EthersContractContextV5 } from "ethereum-abi-types-generator";
import {
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
  ContractInterface,
  ContractTransaction
} from "ethers";

export type ContractContext = EthersContractContextV5<
  BookSharingContract,
  BookSharingContractMethodNames,
  BookSharingContractEventsContext,
  BookSharingContractEvents
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
export type BookSharingContractEvents = "BookSharingCreated";
export interface BookSharingContractEventsContext {
  BookSharingCreated(...parameters: any): EventFilter;
}
export type BookSharingContractMethodNames =
  | "new"
  | "getTotalBookOnSharing"
  | "getHashIdForSharedBook"
  | "getHashIdForBookOnSharing"
  | "getIdBookOnSharing"
  | "getTotalSharedBooks"
  | "getBooksOnSharing"
  | "getIdSharedBook"
  | "getSharedBooks"
  | "shareBooks"
  | "getAllBooksOnSharing"
  | "getAllOwnedBooksOnSharing"
  | "getAllSharedBook"
  | "getAllOwnedSharedBook"
  | "isSharedBookReadable"
  | "getTotalBooksOnSharing"
  | "updateBooksOnSharing"
  | "removeBooksOnSharing"
  | "removeSharedBooks"
  | "takeBooksOnSharing"
  | "getAmountOfAllBooksOnSharing"
  | "getAmountOfAllSharedBooks"
  | "excRecallSharedBooks"
  | "excRecallAllSharedBooks"
  | "excRecallBooksOnSharing"
  | "excRecallAllBooksOnSharing";
export interface BookSharingCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  fromRenter: string;
  sharer: string;
  sharedPer: string;
  priceOfBB: BigNumberish;
  price: BigNumberish;
  amount: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
}
export interface BooksharingResponse {
  tokenId: BigNumber;
  0: BigNumber;
  fromRenter: string;
  1: string;
  sharer: string;
  2: string;
  sharedPer: string;
  3: string;
  priceOfBB: BigNumber;
  4: BigNumber;
  price: BigNumber;
  5: BigNumber;
  amount: BigNumber;
  6: BigNumber;
  startTime: BigNumber;
  7: BigNumber;
  endTime: BigNumber;
  8: BigNumber;
}
export interface BookSharingContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param timelock Type: address, Indexed: false
   */
  "new"(
    timelock: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getTotalBookOnSharing(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param sharer Type: address, Indexed: false
   * @param sharedPer Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  getHashIdForSharedBook(
    tokenId: BigNumberish,
    sharer: string,
    sharedPer: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param fromRenter Type: address, Indexed: false
   * @param sharer Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  getHashIdForBookOnSharing(
    tokenId: BigNumberish,
    fromRenter: string,
    sharer: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param fromRenter Type: address, Indexed: false
   * @param sharer Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  getIdBookOnSharing(
    tokenId: BigNumberish,
    fromRenter: string,
    sharer: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getTotalSharedBooks(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param idBooksOnSharing Type: uint256, Indexed: false
   */
  getBooksOnSharing(
    idBooksOnSharing: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BooksharingResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param sharedPer Type: address, Indexed: false
   * @param sharer Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  getIdSharedBook(
    tokenId: BigNumberish,
    sharedPer: string,
    sharer: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param idSharedBook Type: uint256, Indexed: false
   */
  getSharedBooks(
    idSharedBook: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BooksharingResponse>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param fromRenter Type: address, Indexed: false
   * @param sharer Type: address, Indexed: false
   * @param priceOfBB Type: uint256, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  shareBooks(
    tokenId: BigNumberish,
    fromRenter: string,
    sharer: string,
    priceOfBB: BigNumberish,
    price: BigNumberish,
    amount: BigNumberish,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllBooksOnSharing(
    overrides?: ContractCallOverrides
  ): Promise<BooksharingResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllOwnedBooksOnSharing(
    overrides?: ContractCallOverrides
  ): Promise<BooksharingResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllSharedBook(
    overrides?: ContractCallOverrides
  ): Promise<BooksharingResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllOwnedSharedBook(
    overrides?: ContractCallOverrides
  ): Promise<BooksharingResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  isSharedBookReadable(
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
  getTotalBooksOnSharing(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idBookOnSharing Type: uint256, Indexed: false
   * @param sharer Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   * @param newPrice Type: uint256, Indexed: false
   * @param newAmount Type: uint256, Indexed: false
   */
  updateBooksOnSharing(
    idBookOnSharing: BigNumberish,
    sharer: string,
    tokenId: BigNumberish,
    newPrice: BigNumberish,
    newAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param fromRenter Type: address, Indexed: false
   * @param sharer Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  removeBooksOnSharing(
    tokenId: BigNumberish,
    fromRenter: string,
    sharer: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   * @param sharer Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  removeSharedBooks(
    tokenId: BigNumberish,
    owner: string,
    sharer: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param idBooksOnSharing Type: uint256, Indexed: false
   * @param sender Type: address, Indexed: false
   */
  takeBooksOnSharing(
    idBooksOnSharing: BigNumberish,
    sender: string,
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
  getAmountOfAllBooksOnSharing(
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
  getAmountOfAllSharedBooks(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idSharedBook Type: uint256, Indexed: false
   */
  excRecallSharedBooks(
    idSharedBook: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param renter Type: address, Indexed: false
   */
  excRecallAllSharedBooks(
    renter: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idBooksOnSharing Type: uint256, Indexed: false
   */
  excRecallBooksOnSharing(
    idBooksOnSharing: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param renter Type: address, Indexed: false
   */
  excRecallAllBooksOnSharing(
    renter: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
