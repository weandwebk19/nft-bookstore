// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.17;

contract ListRealOwners {

    mapping(uint => address[]) private _allRealOwnerOfTokenId;

    function isRealOwnerForTokenId(uint tokenId, address sender) public view returns (bool) {
        uint length = _allRealOwnerOfTokenId[tokenId].length;
        for (uint i = 0; i < length; i++) {
            if (_allRealOwnerOfTokenId[tokenId][i] == sender) {
                return true;
            } 
        }

        return false;
    }

    function getAllRealOwnerOfTokenId(uint tokenId) 
        public view returns (address[] memory) {
        return _allRealOwnerOfTokenId[tokenId];
    }

    function updateRealOwnerOfTokenIdIfNeed(uint realOwnerQuantity, 
                                            uint tokenId, 
                                            address sender) public {
        uint length = _allRealOwnerOfTokenId[tokenId].length;
        if (realOwnerQuantity > 0 && !isRealOwnerForTokenId(tokenId, sender)) {
            _allRealOwnerOfTokenId[tokenId].push(sender);
            return;
        } 
        if (realOwnerQuantity == 0) {
            for (uint i = 0; i < length; i++) {
                if (_allRealOwnerOfTokenId[tokenId][i] == sender) {
                    _allRealOwnerOfTokenId[tokenId][i] = _allRealOwnerOfTokenId[tokenId][length - 1];
                    _allRealOwnerOfTokenId[tokenId].pop();
                    return;
                } 
            }
        }
    }

}