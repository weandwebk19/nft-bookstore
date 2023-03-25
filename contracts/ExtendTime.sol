// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

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
        address sender; // Borrower
        bool isAccept;
    }

    event CreatedRequest (
        uint id,
        uint time,
        address sender,
        bool isAccept
    );

    struct Response {
        uint id;
        uint time;
        address sender; // Renter
    }

    event CreatedResponse (
        uint id,
        uint time,
        address sender
    );

    // Borrower => index =>  request
    mapping (address => mapping (uint => Response)) private _responsesOfBorrower;
    // Borrower => total requests
    mapping (address => uint) private _totalOwnedResponse;

    // Renter => index =>  request
    mapping (address => mapping (uint => Request)) private _requestsOfRenter;
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
            if (_requestsOfRenter[receiver][i].id == id &&
                 _requestsOfRenter[receiver][i].sender == sender) {
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
            if (_requestsOfRenter[receiver][i].id == id &&
                 _requestsOfRenter[receiver][i].sender == sender &&
                 _requestsOfRenter[receiver][i].isAccept == true) {
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
            if (_responsesOfBorrower[receiver][i].id == id &&
                 _responsesOfBorrower[receiver][i].sender == sender) {
                return true;
            }
        }
        return false;
    }

    function _createRequest(uint id, 
                           uint time, 
                           address sender, 
                           address receiver) internal {
        require(!isRequestExist(id, sender, receiver), "Request is existed");
        uint index = _totalOwnedRequest[receiver];
        _requestsOfRenter[receiver][index] = Request(id, time, sender, false);
        _totalOwnedRequest[receiver] += 1;
        emit CreatedRequest(id, time, sender, false);
    }

    function _createResponse(uint id, 
                           uint time, 
                           address sender, 
                           address receiver) internal {
        require(!isResponseExist(id, sender, receiver), "Response is existed");
        uint index = _totalOwnedResponse[receiver];
        _responsesOfBorrower[receiver][index] = Response(id, time, sender);
        _totalOwnedResponse[receiver] += 1;
        emit CreatedResponse(id, time, sender);
    }


    function _updateTimeOfRequest(uint id, 
                                 uint newtime, 
                                 address sender, 
                                 address receiver) internal {
        uint length = _totalOwnedRequest[receiver];
        require(length > 0, "You don't have any request");
        Request memory request;
        for (uint i; i < length; i++) {
            request = _requestsOfRenter[receiver][i];
            if(request.id == id && 
               request.sender == sender && 
               newtime > request.time) {
               _requestsOfRenter[receiver][i].time = newtime;
               return;
            }
        }
        require(false, "Updation does not change anything");                          
    }

    function _cancelRequest(uint id,  
                           address sender, 
                           address receiver) internal {

        uint length = _totalOwnedRequest[receiver];
        require(length > 0, "You don't have any request");
        Request memory request;
        for (uint i; i < length; i++) {
            request = _requestsOfRenter[receiver][i];
            if(request.id == id && 
               request.sender == sender) {
                uint lastIndex = _totalOwnedRequest[receiver] - 1;
                Request memory lastRequest = _requestsOfRenter[receiver][lastIndex];

                _requestsOfRenter[receiver][i] = lastRequest;

                delete _requestsOfRenter[receiver][lastIndex];
                _totalOwnedRequest[receiver] -= 1;
                return;
            }
        }                          
    }

    function _cancelResponse(uint id,  
                            address sender, 
                            address receiver) internal {

        uint length = _totalOwnedResponse[receiver];
        require(length > 0, "You don't have any response");
        Response memory response;
        for (uint i; i < length; i++) {
            response = _responsesOfBorrower[receiver][i];
            if(response.id == id && 
               response.sender == sender) {
                uint lastIndex = _totalOwnedResponse[receiver] - 1;
                Response memory lastResponse = _responsesOfBorrower[receiver][lastIndex];

                _responsesOfBorrower[receiver][i] = lastResponse;

                delete _responsesOfBorrower[receiver][lastIndex];
                _totalOwnedResponse[receiver] -= 1;
                return;
            }
        }                          
    }

    function _setAcceptionForRequest(uint id, 
                                    address sender, 
                                    address receiver) internal {
        uint length = _totalOwnedRequest[receiver];
        require(length > 0, "You don't have any request");
        Request memory req;
        for (uint i = 0; i < length; i++) {
            req = _requestsOfRenter[receiver][i];

            if(req.sender == sender && req.id == id) {
                require(!_requestsOfRenter[receiver][i].isAccept, "Status of request is updated");
                _requestsOfRenter[receiver][i].isAccept = true;
            }
        }                          
    }

    function getAllOwnedRequest(address receiver) public view returns(Request[] memory) {
        uint length = _totalOwnedRequest[receiver];
        Request[] memory requests;
        if (length > 0) {
            requests = new Request[](length);
            Request memory request;

            for (uint i = 0; i < length; i++) {
                request = _requestsOfRenter[receiver][i];

                requests[i] = request;
            }
        }

        return requests;
    }

    function getAllOwnedResponse(address receiver) public view returns(Response[] memory) {
        uint length = _totalOwnedResponse[receiver];
        Response[] memory responses;

        if (length > 0) {
            responses = new Response[](length);
            Response memory response;

            for (uint i = 0; i < length; i++) {
                response = _responsesOfBorrower[receiver][i];

                responses[i] = response;
            }
        }

        return responses;
    }

    function getExtendedTimeOfRequest(uint id, 
                                    address sender, 
                                    address receiver) public view returns(uint) {
        require(isRequestExist(id, sender, receiver), "Request is not existed");
        uint length = _totalOwnedRequest[receiver];
        require(length > 0, "You don't have any request");
        Request memory req;
        for (uint i = 0; i < length; i++) {
            req = _requestsOfRenter[receiver][i];

            if(req.sender == sender && req.id == id) {
                return req.time;
            }
        }
        return 0;
        
    }
}