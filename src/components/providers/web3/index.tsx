import {
  FunctionComponent,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { BookRentingContract } from "@_types/BookRentingContract";
import { BookSellingContract } from "@_types/BookSellingContract";
import { BookSharingContract } from "@_types/BookSharingContract";
import { BookStoreContract } from "@_types/BookStoreContract";
import { BookTemporaryContract } from "@_types/BookTemporaryContract";
import { MetaMaskInpageProvider } from "@metamask/providers";
import axios from "axios";
import { ethers } from "ethers";

import {
  Web3State,
  createDefaultState,
  createWeb3State,
  loadContract
} from "./utils";

const pageReload = () => {
  window.location.reload();
};

const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
  try {
    //create new account
    let response = await axios.post("/api/users/create", {
      wallet_address: ethereum.selectedAddress,
      fullname: "Anonymous"
    });

    const isLocked = !(await ethereum._metamask.isUnlocked());
    if (isLocked) {
      pageReload();
    }
  } catch (error) {
    console.log(error);
  }
};

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged", pageReload);
  ethereum.on("accountsChanged", handleAccount(ethereum));
};

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener("chainChanged", pageReload);
  ethereum?.removeListener("accountsChanged", handleAccount);
};

const Web3Context = createContext<Web3State>(createDefaultState());

type Web3ProviderProps = {
  children: any;
};

const Web3Provider: FunctionComponent<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const bookStoreContract = await loadContract("BookStore", provider);
        const bookTemporaryContract = await loadContract(
          "BookTemporary",
          provider
        );
        const bookSellingContract = await loadContract(
          "BookSellingStorage",
          provider
        );
        const bookRentingContract = await loadContract(
          "BookRentingStorage",
          provider
        );
        const bookSharingContract = await loadContract(
          "BookSharingStorage",
          provider
        );

        const signer = provider.getSigner();
        const signedBookStoreContract = bookStoreContract.connect(signer);
        const signedBookTemporaryContract =
          bookTemporaryContract.connect(signer);
        const signedBookSellingContract = bookSellingContract.connect(signer);
        const signedBookRentingContract = bookRentingContract.connect(signer);
        const signedBookSharingContract = bookSharingContract.connect(signer);

        setTimeout(() => setGlobalListeners(window.ethereum), 500);
        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            bookStoreContract:
              signedBookStoreContract as unknown as BookStoreContract,
            bookTemporaryContract:
              signedBookTemporaryContract as unknown as BookTemporaryContract,
            bookSellingContract:
              signedBookSellingContract as unknown as BookSellingContract,
            bookRentingContract:
              signedBookRentingContract as unknown as BookRentingContract,
            bookSharingContract:
              signedBookSharingContract as unknown as BookSharingContract,
            isLoading: false
          })
        );
      } catch (e: any) {
        console.error(e);
        setWeb3Api((api) =>
          createWeb3State({
            ...(api as any),
            isLoading: false
          })
        );
      }
    }

    initWeb3();
    return () => removeGlobalListeners(window.ethereum);
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;
