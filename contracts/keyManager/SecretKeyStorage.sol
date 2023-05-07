// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.17;

contract SecretKeyStorage {

  mapping(uint => string) private _tokenIdToIV;
  mapping(uint => string) private _tokenIdToPrivateKey;

  // add private key and add IV
  function addSecretKey(uint tokenId, 
                      string memory privateKey, 
                      string memory iv) public {
    if (keccak256(abi.encodePacked(_tokenIdToIV[tokenId])) 
      == keccak256(abi.encodePacked("")) &&
      keccak256(abi.encodePacked(_tokenIdToPrivateKey[tokenId])) 
      == keccak256(abi.encodePacked(""))) {
       
      _tokenIdToIV[tokenId] = iv;
      _tokenIdToPrivateKey[tokenId] = privateKey;
      return;
    }
    revert();
  }

  function getSecretKey(uint tokenId) 
    public view returns(string[] memory) {
     
    string[] memory sk = new string[](2);
    sk[0] = _tokenIdToIV[tokenId];
    sk[1] = _tokenIdToPrivateKey[tokenId];
    return sk;
  }

}