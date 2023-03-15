// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TimeLock {
    error NotOwnerError();
    error AlreadyQueuedError(bytes32 txId);
    error TimestampNotInRangeError(uint blockTimestamp, uint timestamp);
    error NotQueuedError(bytes32 txId);
    error TimestampNotPassedError(uint blockTimestmap, uint timestamp);
    // error TimestampExpiredError(uint blockTimestamp, uint expiresAt);
    error TxFailedError();

    struct QueueInfo {
        bytes32 txId;
        address target;
        uint value;
        string func;
        bytes data;
        uint timestamp;
    }

    event Queue(
        bytes32 indexed txId,
        address indexed target,
        uint value,
        string func,
        bytes data,
        uint timestamp
    );
    event Execute(
        bytes32 indexed txId,
        address indexed target,
        uint value,
        string func,
        bytes data,
        uint timestamp
    );

    event Cancel(bytes32 indexed txId);

    uint public constant MIN_DELAY = 604800; // 1 weeks

    constructor() {
        // For testing
        owner = msg.sender;
    }
    address public owner;
    // tx id => queued
    mapping(bytes32 => bool) private queued;
    // 
    QueueInfo[] public allQueues;
    

    modifier onlyOwner(bytes32 TxId) {
        if (msg.sender != owner) {
            revert NotOwnerError();
        }
        _;
    }

    // receive() external payable {}

    function getTxId(
        address _target,
        uint _value,
        string memory _func,
        bytes memory _data,
        uint _timestamp
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_target, _value, _func, _data, _timestamp));
    }

    // For testing
    function getAllQueues() public view returns (QueueInfo[] memory) {
        QueueInfo[] memory queues = new QueueInfo[](allQueues.length);

        for(uint i = 0; i <allQueues.length; i++) {
            queues[i] = allQueues[i];
        }
        return queues;
    }

    /**
     * @param _target Address of account to call
     * @param _value Amount of ETH to send
     * @param _func Function signature, for example "foo(address,uint256)"
     * @param _data ABI encoded data send.
     * @param _timestamp Timestamp after which the transaction can be executed.
     */
    function queue(
        address _target,
        uint _value,
        string memory _func,
        bytes memory _data,
        uint _timestamp
    ) public returns (bytes32 txId) {
        txId = getTxId(_target, _value, _func, _data, _timestamp);
        if (queued[txId]) {
            revert AlreadyQueuedError(txId);
        }
        // ---|------------|-------
        //  block    block + MIN_DELAY     
        if (
            _timestamp < block.timestamp + MIN_DELAY 
        ) {
            revert TimestampNotInRangeError(block.timestamp, _timestamp);
        }

        queued[txId] = true;


        emit Queue(txId, _target, _value, _func, _data, _timestamp);
    }

    function update(
        bytes32 txId,
        address _newTarget,
        uint _newvalue,
        string memory _newFunc,
        bytes memory _newData,
        uint _newTimestamp
    ) public returns (bool) {
        if (queued[txId]) {
            queued[txId] = false;

            if (
                _newTimestamp < block.timestamp + MIN_DELAY 
            ) {
                revert TimestampNotInRangeError(block.timestamp, _newTimestamp);
            }

            bytes32 newIdx = getTxId(_newTarget, _newvalue, _newFunc, _newData, _newTimestamp);
            queued[newIdx] = true;
            emit Queue(txId, _newTarget, _newvalue, _newFunc, _newData, _newTimestamp);
            return true;
        }

        return false;

    }

    function execute(
        address _target,
        uint _value,
        string memory _func,
        bytes memory _data,
        uint _timestamp
    ) public payable returns (bytes memory) {
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);

        if (!queued[txId]) {
            revert NotQueuedError(txId);
        }
        // ----|-------------------|-------
        //  block.timestamp    timestamp 
        if (block.timestamp < _timestamp) {
            revert TimestampNotPassedError(block.timestamp, _timestamp);
        }


        queued[txId] = false;

        // prepare data
        bytes memory data;
        if (bytes(_func).length > 0) {
            // data = func selector + _data
            data = abi.encodePacked(bytes4(keccak256(bytes(_func))), _data);
        } else {
            // call fallback with data
            data = _data;
        }

        // call target
        bool ok;
        bytes memory res;
        if (_value == 0) {
            (ok, res) = _target.call(data);
        } else {
            (ok, res) = _target.call{value: _value}(data);
        }

        if (!ok) {
            revert TxFailedError();
        }

        emit Execute(txId, _target, _value, _func, _data, _timestamp);

        return res;
    }

    function cancel(bytes32 _txId) public {
        if (!queued[_txId]) {
            revert NotQueuedError(_txId);
        }

        queued[_txId] = false;

        emit Cancel(_txId);
    }
}
