import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

import { BookRentingContract } from "./BookRentingContract";
import { BookSellingContract } from "./BookSellingContract";
import { BookSharingContract } from "./BookSharingContract";
import { BookStoreContract } from "./BookStoreContract";

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  bookStoreContract: BookStoreContract;
  bookSellingContract: BookSellingContract;
  bookRentingContract: BookRentingContract;
  bookSharingContract: BookSharingContract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
};

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>;
};

export type CryptoHandlerHook<D = any, R = any, P = any> = (
  params?: P
) => CryptoSWRResponse<D, R>;

export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R;

// export type CryptoHookFactory<D = any, P = any> = {
//   (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>
// }
