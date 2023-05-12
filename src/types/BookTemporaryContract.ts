import { EthersContractContextV5 } from "ethereum-abi-types-generator";
import {
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
  ContractInterface,
  ContractTransaction
} from "ethers";

export type ContractContext = EthersContractContextV5<
  BookTemporaryContract,
  BookTemporaryContractMethodNames,
  BookTemporaryContractEventsContext,
  BookTemporaryContractEvents
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
export type BookTemporaryContractEvents = undefined;
export interface BookTemporaryContractEventsContext {}
export type BookTemporaryContractMethodNames =
  | "new"
  | "convertPrice"
  | "getBookRentingStorage"
  | "getBookSharingStorage"
  | "getAmountOfAllTypeBooksInTemporary"
  | "getAmountOfUnsalableBooksInTemporary"
  | "convertBookOnSharingToBorrowedBook";
export interface BookTemporaryContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param bookRentingStorage Type: address, Indexed: false
   * @param bookSharingStorage Type: address, Indexed: false
   */
  "new"(
    bookRentingStorage: string,
    bookSharingStorage: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  convertPrice(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getBookRentingStorage(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getBookSharingStorage(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  getAmountOfAllTypeBooksInTemporary(
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
  getAmountOfUnsalableBooksInTemporary(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param idBookOnSharing Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  convertBookOnSharingToBorrowedBook(
    idBookOnSharing: BigNumberish,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
