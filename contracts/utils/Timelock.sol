// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./Error.sol";

// Timelock is a contract that helps us in delaying a transaction with a specific time
contract TimeLock {

    event Queue(
        bytes32 indexed txId,
        address indexed owner,
        uint value,
        string func,
        bytes data,
        uint timestamp
    );

    event Cancel(bytes32 indexed txId);

    uint public constant DELAY_TRANSACTION = 1200; // 30 minutes
    uint public constant MIN_DELAY = 604800 - DELAY_TRANSACTION; // 1 weeks

    // tx id => queued
    mapping(bytes32 => bool) private queued;

    function getTxId(
        address owner,
        uint _value,
        string memory _func,
        bytes memory _data,
        uint _timestamp
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(owner, _value, _func, _data, _timestamp));
    }

    /**
     * @param _owner Address of account of owner
     * @param _value Amount of ETH to send
     * @param _func Function signature, for example "foo(address,uint256)"
     * @param _data ABI encoded data send.
     * @param _timestamp Timestamp after which the transaction can be executed.
     */
    function queue(
        address _owner,
        uint _value,
        string memory _func,
        bytes memory _data,
        uint _timestamp
    ) public returns (bytes32 txId) {
        txId = getTxId(_owner, _value, _func, _data, _timestamp);
        if (queued[txId]) {
            revert Error.AlreadyQueuedError(txId);
        }
        // ---|------------|-------
        //  block    block + MIN_DELAY     
        if (
            _timestamp < block.timestamp + MIN_DELAY 
        ) {
            revert Error.TimestampNotInRangeError(block.timestamp, _timestamp);
        }

        queued[txId] = true;


        emit Queue(txId, _owner, _value, _func, _data, _timestamp);
    }

    function update(
        bytes32 txId,
        address _newOwner,
        uint _newvalue,
        string memory _newFunc,
        bytes memory _newData,
        uint _newTimestamp
    ) public returns(bool) {
        if (queued[txId]) {

            if (
                _newTimestamp < block.timestamp + MIN_DELAY 
            ) {
                revert Error.TimestampNotInRangeError(block.timestamp, _newTimestamp);
            }
            queued[txId] = false;

            bytes32 newIdx = getTxId(_newOwner, _newvalue, _newFunc, _newData, _newTimestamp);
            queued[newIdx] = true;
            emit Queue(txId, _newOwner, _newvalue, _newFunc, _newData, _newTimestamp);
            return true;
        }
        return false;
    }

    function isExecute(
        address _owner,
        uint _value,
        string memory _func,
        bytes memory _data,
        uint _timestamp
    ) public returns(bool) {
        bytes32 txId = getTxId(_owner, _value, _func, _data, _timestamp);

        if (!queued[txId]) {
            return false;
        }

        // ----|-------------------|-------
        //  block.timestamp    timestamp 
        if (block.timestamp < _timestamp) {
            return false;
        }

        queued[txId] = false;
        return true;
    }

    function cancel(bytes32 _txId) public {
        if (!queued[_txId]) {
            require(false, "Check log1");
            revert Error.NotQueuedError(_txId);
        }

        queued[_txId] = false;

        emit Cancel(_txId);
    }
}
