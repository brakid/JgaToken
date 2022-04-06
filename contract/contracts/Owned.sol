// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract Owned {
  address public owner = msg.sender;

  event TransferOwnership(address indexed oldOwner, address indexed newOwner);

  modifier onlyOwner {
    require(msg.sender == owner, 'Only the owner is allowed to call this operation');
    _;
  }

  function setOwner(address newOwner) onlyOwner external {
    require(newOwner != address(0), 'Owner must not be the nul address');
    require(newOwner != owner, 'Owner must not be the same');

    address oldOwner = owner;
    owner = newOwner;

    emit TransferOwnership(oldOwner, newOwner);
  }
}