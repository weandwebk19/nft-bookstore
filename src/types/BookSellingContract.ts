import { EthersContractContextV5 } from "ethereum-abi-types-generator";
import {
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
  ContractInterface,
  ContractTransaction
} from "ethers";

export type ContractContext = EthersContractContextV5<
  BookSellingContract,
  BookSellingContractMethodNames,
  BookSellingContractEventsContext,
  BookSellingContractEvents
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
export type BookSellingContractEvents = "BookSellingCreated";
export interface BookSellingContractEventsContext {
  BookSellingCreated(...parameters: any): EventFilter;
}
export type BookSellingContractMethodNames =
  | "isListing"
  | "getListedBook"
  | "getListedBookById"
  | "getTotalOwnedListedBook"
  | "getIdListedBook"
  | "getAmountOfListedBooks"
  | "sellListedBooks"
  | "updateListedBookFromSale"
  | "getAllListedBooks"
  | "buyListedBooks"
  | "getTotalOwnedPurchasedBook"
  | "getOwnedPurchasedBooks";
export interface BookSellingCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  seller: string;
  buyer: string;
  price: BigNumberish;
  amount: BigNumberish;
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
export interface BookSellingContract {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param seller Type: address, Indexed: false
   */
  isListing(
    tokenId: BigNumberish,
    seller: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
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
  ): Promise<BooksellingResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param idListedBook Type: uint256, Indexed: false
   */
  getListedBookById(
    idListedBook: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BooksellingResponse>;
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
   * @param owner Type: address, Indexed: false
   */
  getAmountOfListedBooks(
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllListedBooks(
    overrides?: ContractCallOverrides
  ): Promise<BooksellingResponse[]>;
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
   * @param buyer Type: address, Indexed: false
   */
  getTotalOwnedPurchasedBook(
    buyer: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOwnedPurchasedBooks(
    overrides?: ContractCallOverrides
  ): Promise<BooksellingResponse[]>;
}
