import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish
} from "ethers";
import { EthersContractContextV5 } from "ethereum-abi-types-generator";

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
  | "listingPrice"
  | "owner"
  | "renounceOwnership"
  | "rentingPrice"
  | "safeBatchTransferFrom"
  | "safeTransferFrom"
  | "setApprovalForAll"
  | "supportsInterface"
  | "transferOwnership"
  | "uri"
  | "setListingPrice"
  | "setRentingPrice"
  | "setTokenUri"
  | "isListed"
  | "isRented"
  | "getBalanceOfOwnerBook"
  | "getNftBook"
  | "getListedBook"
  | "isTokenURIExist"
  | "mintBook"
  | "isOwnerOfToken"
  | "getOwnedNFTBooks"
  | "getOwnedListedBooks"
  | "getCreatedNFTBooks"
  | "getTotalOwnedToken"
  | "getOwnedRentedBooks"
  | "getOwnedBorrowedBooks"
  | "getAmountOfAllTypeBooksUntradeable"
  | "sellBooks"
  | "leaseBooks"
  | "updateBookFromSale"
  | "updateBookFromRenting"
  | "getAllBooksOnSale"
  | "getAllBooksOnRenting"
  | "buyBooks"
  | "borrowBooks"
  | "getAllBorrowedBooks"
  | "requestExtendTimeOfBorrowedBooks"
  | "updateRequestExtendTimeOfBorrowedBooks"
  | "doAcceptRequest"
  | "transferForSendedRequest"
  | "getAllOwnedRequestsOnExtending"
  | "getAllOwnedResponsesOnExtending"
  | "recallBorrowedBooks"
  | "recallAllBorrowedBooks";
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
export interface RentedbookResponse {
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
export interface RequestResponse {
  id: BigNumber;
  0: BigNumber;
  time: BigNumber;
  1: BigNumber;
  sender: string;
  2: string;
  isAccept: boolean;
  3: boolean;
}
export interface ResponseResponse {
  id: BigNumber;
  0: BigNumber;
  time: BigNumber;
  1: BigNumber;
  sender: string;
  2: string;
}
export interface BookStoreContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param listedBookStorage Type: address, Indexed: false
   * @param bookTemporary Type: address, Indexed: false
   */
  "new"(
    listedBookStorage: string,
    bookTemporary: string,
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
   * @param seller Type: address, Indexed: false
   */
  isListed(
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
   * @param renter Type: address, Indexed: false
   */
  isRented(
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
   */
  mintBook(
    tokenURI: string,
    quantity: BigNumberish,
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
   * @param tokenId Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   */
  getAmountOfAllTypeBooksUntradeable(
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
  leaseBooks(
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
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param extendedTime Type: uint256, Indexed: false
   */
  requestExtendTimeOfBorrowedBooks(
    tokenId: BigNumberish,
    renter: string,
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
   * @param newExtendedTime Type: uint256, Indexed: false
   */
  updateRequestExtendTimeOfBorrowedBooks(
    tokenId: BigNumberish,
    renter: string,
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllOwnedRequestsOnExtending(
    overrides?: ContractCallOverrides
  ): Promise<RequestResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllOwnedResponsesOnExtending(
    overrides?: ContractCallOverrides
  ): Promise<ResponseResponse[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param renter Type: address, Indexed: false
   * @param borrower Type: address, Indexed: false
   */
  recallBorrowedBooks(
    tokenId: BigNumberish,
    renter: string,
    borrower: string,
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
}
