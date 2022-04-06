// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './Owned.sol';

contract JgaToken is ERC721, Owned {
  mapping(address => string) private whitelist;

  constructor() ERC721('VaultToken', 'VLT') {}

  function _baseURI() internal view virtual override returns (string memory) {
    return "https://brakid-vault.web.app/vault/";
  }

  function mint(uint256 tokenId) external onlyOwner returns (uint256) {
    _safeMint(msg.sender, tokenId);
    return tokenId;
  }
}