// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Error {
    error InvalidParamsError();
    error InvalidIdError(uint);
    error InvalidAmountError(uint);
    error InvalidAddressError(address);
    error InvalidValueError(uint);
    error InvalidPriceError(uint);
    error InvalidOwnerError(uint,address);
    error InvalidTokenUriError(string);
    error InvalidTimeError(uint);
    error ExecutionError();


    error AlreadyExistsRequestError(bool);
    error AlreadyExistsResponseError(bool);
    error InvalidLengthError(uint);
    error AlreadyChangedStatusError(bool);

    error AlreadyQueuedError(bytes32);
    error TimestampNotInRangeError(uint,uint);
    error NotQueuedError(bytes32);
}