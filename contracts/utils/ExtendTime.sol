// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./Error.sol";

// PROTOCOL:
//
// ---------------   Request(infor of borrowed book)    Get res from Renter       reject res
// | Extend time | <------------------- <BORROWER>---------------------------o------------------> No transfer, Update Extend time
// ---------------                         ^                                 |
//       ^                                 |                                 | accept res
//       |                                 |                                 |
//       |                                 |              Transfer to Renter + Update Time of Borrowed Books
//       |                                 |  
//       | Get request                     | YES -> Create response and 
//       |                                 |     send to borrower
//       |                                 |
//       |                 Is agree?       |         NO
//   <RENTER> -----------------------------o------------------> Remove request 

// The class assists in creating a request to extend the loan period and
// waits for the owner to approve or not
contract ExtendTime {

    struct Request {
        uint id; // id of Borrowed Books
        uint time; // Extended time
        uint amount;
        address sender; // Borrower
        bool isAccept;
    }

    event CreatedRequest (
        uint id,
        uint time,
        uint amount,
        address sender,
        bool isAccept
    );

    struct Response {
        uint id;
        uint time;
        uint amount;
        address sender; // Renter
    }

    event CreatedResponse (
        uint id,
        uint time,
        uint amount,
        address sender
    );

    // Borrower => index =>  request
    mapping (address => mapping (uint => Response)) private _responses;
    // Borrower => total requests
    mapping (address => uint) private _totalOwnedResponse;

    // Renter => index =>  request
    mapping (address => mapping (uint => Request)) private _requests;
    // Renter => total requests
    mapping (address => uint) private _totalOwnedRequest;
    
    function isRequestExist(uint id, 
                            address sender, 
                            address receiver) public view returns(bool) {

        uint length = _totalOwnedRequest[receiver];
        if (length == 0) {
            return false;
        }

        for (uint i = 0; i < length; i++) {
            if (_requests[receiver][i].id == id &&
                 _requests[receiver][i].sender == sender) {
                return true;
            }
        }
        return false;
    }

    function isAcceptRequest(uint id, 
                             address sender, 
                             address receiver) public view returns(bool) {
        
        uint length = _totalOwnedRequest[receiver];
        if (length == 0) {
            return false;
        }

        for (uint i = 0; i < length; i++) {
            if (_requests[receiver][i].id == id &&
                 _requests[receiver][i].sender == sender &&
                 _requests[receiver][i].isAccept == true) {
                return true;
            }
        }
        return false;
    }

    function isResponseExist(uint id, 
                            address sender, 
                            address receiver) public view returns(bool) {

        uint length = _totalOwnedResponse[receiver];
        if (length == 0) {
            return false;
        }

        for (uint i = 0; i < length; i++) {
            if (_responses[receiver][i].id == id &&
                 _responses[receiver][i].sender == sender) {
                return true;
            }
        }
        return false;
    }

    function _createRequest(uint id, 
                           uint time, 
                           uint amount, 
                           address sender, 
                           address receiver) internal {
        if (isRequestExist(id, sender, receiver)) {
            revert Error.AlreadyExistsRequestError(true);
        }
        uint index = _totalOwnedRequest[receiver];
        _requests[receiver][index] = Request(id, time, amount, sender, false);
        _totalOwnedRequest[receiver] += 1;
        emit CreatedRequest(id, time, amount, sender, false);
    }

    function _createResponse(uint id, 
                             uint time, 
                             uint amount,
                             address sender, 
                             address receiver) internal {
        if (isResponseExist(id, sender, receiver)) {
            revert Error.AlreadyExistsResponseError(true);
        }
        uint index = _totalOwnedResponse[receiver];
        _responses[receiver][index] = Response(id, time, amount, sender);
        _totalOwnedResponse[receiver] += 1;
        emit CreatedResponse(id, time, amount, sender);
    }


    function _updateRequest(uint id, 
                            uint newAmount,
                            uint newTime, 
                            address sender, 
                            address receiver) internal {
        uint length = _totalOwnedRequest[receiver];
        if (length == 0) {
            revert Error.InvalidLengthError(length);
        }
        Request memory request;
        for (uint i; i < length; i++) {
            request = _requests[receiver][i];
            if(request.id == id && 
               request.sender == sender) {
               if (newTime > request.time) {
                  _requests[receiver][i].time = newTime;
               }

               if (newAmount != request.amount) {
                  _requests[receiver][i].amount = newAmount;
               }
               return;
            }
        }
    }

    function _cancelRequest(uint id,  
                           address sender, 
                           address receiver) internal {

        uint length = _totalOwnedRequest[receiver];
        if (length != 0) {
            Request memory request;
            for (uint i; i < length; i++) {
                request = _requests[receiver][i];
                if(request.id == id && 
                request.sender == sender) {
                    uint lastIndex = _totalOwnedRequest[receiver] - 1;
                    Request memory lastRequest = _requests[receiver][lastIndex];

                    _requests[receiver][i] = lastRequest;

                    delete _requests[receiver][lastIndex];
                    _totalOwnedRequest[receiver] -= 1;
                    return;
                }
            }                          
        }
    }

    function _cancelResponse(uint id,  
                            address sender, 
                            address receiver) internal {

        uint length = _totalOwnedResponse[receiver];
        if (length != 0) {
            Response memory response;
            for (uint i; i < length; i++) {
                response = _responses[receiver][i];
                if(response.id == id && 
                response.sender == sender) {
                    uint lastIndex = _totalOwnedResponse[receiver] - 1;
                    Response memory lastResponse = _responses[receiver][lastIndex];

                    _responses[receiver][i] = lastResponse;

                    delete _responses[receiver][lastIndex];
                    _totalOwnedResponse[receiver] -= 1;
                    return;
                }
            }                          
        }
    }

    function _setAcceptionForRequest(uint id, 
                                    address sender, 
                                    address receiver) internal {
        uint length = _totalOwnedRequest[receiver];
        if (length == 0) {
            revert Error.InvalidLengthError(length);
        }
        Request memory req;
        for (uint i = 0; i < length; i++) {
            req = _requests[receiver][i];

            if(req.sender == sender && req.id == id) {
                if (_requests[receiver][i].isAccept) {
                    revert Error.AlreadyChangedStatusError(true);
                }
                _requests[receiver][i].isAccept = true;
            }
        }                          
    }

    function getAllOwnedRequest() public view returns(Request[] memory) {
        uint length = _totalOwnedRequest[msg.sender];
        Request[] memory requests;
        if (length > 0) {
            requests = new Request[](length);
            Request memory request;

            for (uint i = 0; i < length; i++) {
                request = _requests[msg.sender][i];

                requests[i] = request;
            }
        }
        return requests;
    }

    function getAllOwnedResponse() public view returns(Response[] memory) {
        uint length = _totalOwnedResponse[msg.sender];
        Response[] memory responses;

        if (length > 0) {
            responses = new Response[](length);
            Response memory response;

            for (uint i = 0; i < length; i++) {
                response = _responses[msg.sender][i];

                responses[i] = response;
            }
        }

        return responses;
    }

    function getRequest(uint id, 
                        address sender, 
                        address receiver) public view returns(Request memory) {
        if (!isRequestExist(id, sender, receiver)) {
            revert Error.AlreadyExistsRequestError(false);
        }
        uint length = _totalOwnedRequest[receiver];
        Request memory req;
        for (uint i = 0; i < length; i++) {
            req = _requests[receiver][i];

            if(req.sender == sender && req.id == id) {
                return req;
            }
        }
        return req; 
    }

    function getResponse(uint id, 
                        address sender, 
                        address receiver) public view returns(Response memory) {
        if (!isResponseExist(id, sender, receiver)) {
            revert Error.AlreadyExistsResponseError(false);
        }
        uint length = _totalOwnedResponse[receiver];
        Response memory res;
        for (uint i = 0; i < length; i++) {
            res = _responses[receiver][i];

            if(res.sender == sender && res.id == id) {
                return res;
            }
        }
        return res; 
    }
}