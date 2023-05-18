import { EthersContractContextV5 } from "ethereum-abi-types-generator";
import {
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
  ContractInterface,
  ContractTransaction
} from "ethers";

export type ContractContext = EthersContractContextV5<
  BookRentingContract,
  BookRentingContractMethodNames,
  BookRentingContractEventsContext,
  BookRentingContractEvents
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
export type BookRentingContractEvents =
  | "BorrowedBookCreated"
  | "CreatedRequest"
  | "CreatedResponse"
  | "LendBookCreated";
export interface BookRentingContractEventsContext {
  BorrowedBookCreated(...parameters: any): EventFilter;
  CreatedRequest(...parameters: any): EventFilter;
  CreatedResponse(...parameters: any): EventFilter;
  LendBookCreated(...parameters: any): EventFilter;
}
export type BookRentingContractMethodNames =
  | "new"
  | "getAllOwnedRequest"
  | "getAllOwnedResponse"
  | "getRequest"
  | "getResponse"
  | "isAcceptRequest"
  | "isRequestExist"
  | "isResponseExist"
  | "isLending"
  | "getLendBook"
  | "getLendBookFromId"
  | "getTotalOwnedLendBook"
  | "getIdLendBook"
  | "getAmountOfLendBooks"
  | "updateLendBookFromRenting"
  | "getAllLendBooks"
  | "lendBooks"
  | "getTotalBorrowedBooksOnBorrowing"
  | "getHashIdForBorrowedBook"
  | "getBorrowedBook"
  | "getBorrowedBookFromId"
  | "getTotalOwnedBorrowedBook"
  | "createBorrowedBook"
  | "getIdBorrowedBook"
  | "updateAmountBorrowedBookFromBorrowing"
  | "getAmountOfBorrowedBooks"
  | "getOwnedBorrowedBooks"
  | "isBorrowedBookReadable"
  | "borrowBooks"
  | "requestExtendTimeOfBorrowedBooks"
  | "updateRequestOfBorrowedBooks"
  | "doAcceptRequestAndCreateResponse"
  | "transferForSendedRequest"
  | "getAllBorrowedBooks"
  | "excRecallBorrowedBooks";
export interface BorrowedBookCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  renter: string;
  borrower: string;
  price: BigNumberish;
  amount: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
}
export interface CreatedRequestEventEmittedResponse {
  id: BigNumberish;
  time: BigNumberish;
  amount: BigNumberish;
  sender: string;
  isAccept: boolean;
}
export interface CreatedResponseEventEmittedResponse {
  id: BigNumberish;
  time: BigNumberish;
  amount: BigNumberish;
  sender: string;
}
export interface LendBookCreatedEventEmittedResponse {
  tokenId: BigNumberish;
  renter: string;
  price: BigNumberish;
  amount: BigNumberish;
}
export interface RequestResponse {
  id: BigNumber;
  0: BigNumber;
  time: BigNumber;
  1: BigNumber;
  amount: BigNumber;
  2: BigNumber;
  sender: string;
  3: string;
  isAccept: boolean;
  4: boolean;
}
export interface ResponseResponse {
  id: BigNumber;
  0: BigNumber;
  time: BigNumber;
  1: BigNumber;
  amount: BigNumber;
  2: BigNumber;
  sender: string;
  3: string;
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
export interface BookRentingContract {
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
  getAllOwnedRequest(
    overrides?: ContractCallOverrides
  ): Promise<RequestResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllOwnedResponse(
    overrides?: ContractCallOverrides
  ): Promise<ResponseResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   * @param sender Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   */
  getRequest(
    id: BigNumberish,
    sender: string,
    receiver: string,
    overrides?: ContractCallOverrides
  ): Promise<RequestResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   * @param sender Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   */
  getResponse(
    id: BigNumberish,
    sender: string,
    receiver: string,
    overrides?: ContractCallOverrides
  ): Promise<ResponseResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   * @param sender Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   */
  isAcceptRequest(
    id: BigNumberish,
    sender: string,
    receiver: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   * @param sender Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   */
  isRequestExist(
    id: BigNumberish,
    sender: string,
    receiver: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   * @param sender Type: address, Indexed: false
   * @param receiver Type: address, Indexed: false
   */
  isResponseExist(
    id: BigNumberish,
    sender: string,
    receiver: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   */
  isLending(
    tokenId: BigNumberish,
    renter: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   */
  getLendBook(
    tokenId: BigNumberish,
    renter: string,
    overrides?: ContractCallOverrides
  ): Promise<LendbookResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   */
  getLendBookFromId(
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<LendbookResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param renter Type: address, Indexed: false
   */
  getTotalOwnedLendBook(
    renter: string,
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
  getIdLendBook(
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
   * @param owner Type: address, Indexed: false
   */
  getAmountOfLendBooks(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
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
  updateLendBookFromRenting(
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
  getAllLendBooks(
    overrides?: ContractCallOverrides
  ): Promise<LendbookResponse[]>;
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
  lendBooks(
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
  getTotalBorrowedBooksOnBorrowing(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param borrower Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  getHashIdForBorrowedBook(
    tokenId: BigNumberish,
    renter: string,
    borrower: string,
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
   * @param renter Type: address, Indexed: false
   * @param borrower Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  getBorrowedBook(
    tokenId: BigNumberish,
    renter: string,
    borrower: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BorrowedbookResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint256, Indexed: false
   */
  getBorrowedBookFromId(
    id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BorrowedbookResponse>;
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   * @param borrower Type: address, Indexed: false
   */
  createBorrowedBook(
    tokenId: BigNumberish,
    renter: string,
    price: BigNumberish,
    amount: BigNumberish,
    startTime: BigNumberish,
    endTime: BigNumberish,
    borrower: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param borrower Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   */
  getIdBorrowedBook(
    tokenId: BigNumberish,
    renter: string,
    borrower: string,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idBorrowedBook Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param isDecrease Type: bool, Indexed: false
   */
  updateAmountBorrowedBookFromBorrowing(
    idBorrowedBook: BigNumberish,
    amount: BigNumberish,
    isDecrease: boolean,
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
   */
  getOwnedBorrowedBooks(
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
  isBorrowedBookReadable(
    tokenId: BigNumberish,
    owner: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
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
  borrowBooks(
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
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param borrower Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   * @param extendedAmount Type: uint256, Indexed: false
   * @param extendedTime Type: uint256, Indexed: false
   */
  requestExtendTimeOfBorrowedBooks(
    tokenId: BigNumberish,
    renter: string,
    borrower: string,
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
   * @param borrower Type: address, Indexed: false
   * @param startTime Type: uint256, Indexed: false
   * @param endTime Type: uint256, Indexed: false
   * @param newExtendedAmount Type: uint256, Indexed: false
   * @param newExtendedTime Type: uint256, Indexed: false
   */
  updateRequestOfBorrowedBooks(
    tokenId: BigNumberish,
    renter: string,
    borrower: string,
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
   * @param id Type: uint256, Indexed: false
   * @param borrower Type: address, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param isAccept Type: bool, Indexed: false
   */
  doAcceptRequestAndCreateResponse(
    id: BigNumberish,
    borrower: string,
    renter: string,
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
   * @param borrower Type: address, Indexed: false
   * @param currentTime Type: uint256, Indexed: false
   * @param isExtend Type: bool, Indexed: false
   */
  transferForSendedRequest(
    id: BigNumberish,
    renter: string,
    borrower: string,
    currentTime: BigNumberish,
    isExtend: boolean,
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param idBorrowedBook Type: uint256, Indexed: false
   */
  excRecallBorrowedBooks(
    idBorrowedBook: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
