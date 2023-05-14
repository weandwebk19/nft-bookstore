/* eslint-disable prettier/prettier */
import { Web3Dependencies } from "@_types/hooks";

import {
  UseOwnedBorrowedBooksHook,
  hookFactory as createOwnedBorrowedBooksHook
} from "./bookShelf/borrow/useOwnedBorrowedBooks";
import {
  UseOwnedLendingBooksHook,
  hookFactory as createOwnedLendingBooksHook
} from "./bookShelf/borrow/useOwnedLendingBooks";
import {
  UseOwnedLentOutBooksHook,
  hookFactory as createOwnedLentOutBooksHook
} from "./bookShelf/borrow/useOwnedLentOutBooks";
import {
  UseOwnedPurchasedBooksHook,
  hookFactory as createOwnedPurchasedBooksHook
} from "./bookShelf/sell/useOwnedPurchasedBooks";
import {
  UseOwnedSellingBooksHook,
  hookFactory as createOwnedSellingBooksHook
} from "./bookShelf/sell/useOwnedSellingBooks";
import {
  UseOwnedSoldBooksHook,
  hookFactory as createOwnedSoldBooksHook
} from "./bookShelf/sell/useOwnedSoldBooks";
import {
  UseOwnedSharedBooksHook,
  hookFactory as createOwnedSharedBooksHook
} from "./bookShelf/share/useOwnedSharedBooks";
import {
  UseOwnedSharedOutBooksHook,
  hookFactory as createOwnedSharedOutBooksHook
} from "./bookShelf/share/useOwnedSharedOutBooks";
import {
  UseOwnedSharingBooksHook,
  hookFactory as createOwnedSharingBooksHook
} from "./bookShelf/share/useOwnedSharingBooks";
import {
  UseCreatedBooksHook,
  hookFactory as createCreatedBooksHook
} from "./bookShelf/useCreatedBooks";
import {
  UseOwnedNftsHook,
  hookFactory as createOwnedBooksHook
} from "./bookShelf/useOwnedNfts";
import {
  UseAllLendingBooksHook,
  hookFactory as createAllLendingBooksHook
} from "./borrow/useAllLendingBooks";
import {
  UseBookDetailHook,
  hookFactory as createBookDetailHook
} from "./detailPage/useBookDetail";
import {
  UseNftBookCoreHook,
  hookFactory as createNftBookCoreHook
} from "./detailPage/useNftBookCore";
import {
  UseNftBookMetaHook,
  hookFactory as createNftBookMetaHook
} from "./detailPage/useNftBookMeta";
import {
  UseNftBookSellingHook,
  hookFactory as createNftBookSellingHook
} from "./detailPage/useNftBookSelling";
import {
  UseRandomBooksHook,
  hookFactory as createRandomBooksHook
} from "./detailPage/useRandomBooks";
import {
  UseRealOwnerOfTokensHook,
  hookFactory as createRealOwnerOfTokensHook
} from "./detailPage/useRealOwnerOfTokens";
import {
  UseOwnedRequestsOnExtendingHook,
  hookFactory as createOwnedRequestsOnExtendingHook
} from "./mailbox/useOwnedRequestsOnExtending";
import {
  UseOwnedResponsesOnExtendingHook,
  hookFactory as createOwnedResponsesOnExtendingHook
} from "./mailbox/useOwnedResponsesOnExtending";
import {
  UsePublishingBooksHook,
  hookFactory as createPublishingBooksHook
} from "./publishing/usePublishingBooks";
import {
  UseAllSharingBooksHook,
  hookFactory as createAllSharingBooksHook
} from "./share/useAllSharingBooks";
import { UseAccountHook, hookFactory as createAccountHook } from "./useAccount";
import {
  UseMetadataHook,
  hookFactory as createMetadataHook
} from "./useMetadata";
import { UseNetworkHook, hookFactory as createNetworkHook } from "./useNetwork";
import {
  UseReviewsManagementHook,
  hookFactory as createReviewsManagementHook
} from "./useReviewsManagement";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  usePublishingBooks: UsePublishingBooksHook;
  useAllLendingBooks: UseAllLendingBooksHook;
  useAllSharingBooks: UseAllSharingBooksHook;
  useOwnedNfts: UseOwnedNftsHook;
  useCreatedBooks: UseCreatedBooksHook;
  useOwnedSellingBooks: UseOwnedSellingBooksHook;
  useOwnedSoldBooks: UseOwnedSoldBooksHook;
  useOwnedPurchasedBooks: UseOwnedPurchasedBooksHook;
  useOwnedBorrowedBooks: UseOwnedBorrowedBooksHook;
  useOwnedLendingBooks: UseOwnedLendingBooksHook;
  useOwnedLentOutBooks: UseOwnedLentOutBooksHook;
  useOwnedSharingBooks: UseOwnedSharingBooksHook;
  useOwnedSharedBooks: UseOwnedSharedBooksHook;
  useOwnedSharedOutBooks: UseOwnedSharedOutBooksHook;
  useBookDetail: UseBookDetailHook;
  useNftBookCore: UseNftBookCoreHook;
  useNftBookMeta: UseNftBookMetaHook;
  useNftBookSelling: UseNftBookSellingHook;
  useMetadata: UseMetadataHook;
  useReviewsManagement: UseReviewsManagementHook;
  useRandomBooks: UseRandomBooksHook;
  useRealOwnerOfTokens: UseRealOwnerOfTokensHook;
  useOwnedRequestsOnExtending: UseOwnedRequestsOnExtendingHook;
  useOwnedResponsesOnExtending: UseOwnedResponsesOnExtendingHook;
};

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    usePublishingBooks: createPublishingBooksHook(deps),
    useAllLendingBooks: createAllLendingBooksHook(deps),
    useAllSharingBooks: createAllSharingBooksHook(deps),
    useOwnedNfts: createOwnedBooksHook(deps),
    useCreatedBooks: createCreatedBooksHook(deps),
    useOwnedSellingBooks: createOwnedSellingBooksHook(deps),
    useOwnedSoldBooks: createOwnedSoldBooksHook(deps),
    useOwnedPurchasedBooks: createOwnedPurchasedBooksHook(deps),
    useOwnedLendingBooks: createOwnedLendingBooksHook(deps),
    useOwnedLentOutBooks: createOwnedLentOutBooksHook(deps),
    useOwnedBorrowedBooks: createOwnedBorrowedBooksHook(deps),
    useOwnedSharingBooks: createOwnedSharingBooksHook(deps),
    useOwnedSharedBooks: createOwnedSharedBooksHook(deps),
    useOwnedSharedOutBooks: createOwnedSharedOutBooksHook(deps),
    useBookDetail: createBookDetailHook(deps),
    useNftBookCore: createNftBookCoreHook(deps),
    useNftBookSelling: createNftBookSellingHook(deps),
    useNftBookMeta: createNftBookMetaHook(deps),
    useMetadata: createMetadataHook(deps),
    useReviewsManagement: createReviewsManagementHook(deps),
    useRandomBooks: createRandomBooksHook(deps),
    useRealOwnerOfTokens: createRealOwnerOfTokensHook(deps),
    useOwnedRequestsOnExtending: createOwnedRequestsOnExtendingHook(deps),
    useOwnedResponsesOnExtending: createOwnedResponsesOnExtendingHook(deps)
  };
};
