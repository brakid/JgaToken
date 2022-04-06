// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

import './Owned.sol';

contract JgaToken is ERC721, Owned {
  using Strings for uint256;

  event WhitelistedAddressEvent (
    address indexed whitelistedAddress,
    uint256 timestamp
  );

  mapping(address => bool) private whitelist;
  mapping(address => bool) private minted;

  constructor() ERC721('JgaToken', 'JGT') {}

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');

        return string(
          abi.encodePacked(
            'https://github.com/brakid/JgaToken/raw/master/images/', 
            tokenId.toString(),
            '.png'));
    }

  function mint(uint256 tokenId) external returns (uint256) {
    require(tokenId >= 1 && tokenId <= 11, 'Invalid Token Id');
    require(whitelist[msg.sender] == true, 'Sender is not whitelisted');
    require(minted[msg.sender] == false, 'Sender has already minted');
    minted[msg.sender] = true;
    _safeMint(msg.sender, tokenId);
    return tokenId;
  }

  function whitelistAddress(address addressToWhitelist) external onlyOwner {
    require(whitelist[addressToWhitelist] == false, 'Address is already whitelisted');
    whitelist[addressToWhitelist] = true;

    emit WhitelistedAddressEvent(addressToWhitelist, block.timestamp);
  }
}