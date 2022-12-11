pragma solidity ^0.5.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract WhiteList {
  using SafeMath for uint256;

  struct Wallet {
    address addr;
    bool isWhitelisted;
  }

  mapping (address => Wallet) public wallets;
  uint256 public whitelistFee;
  address public owner;

  constructor() public {
    whitelistFee = 0.1 ether;
    owner = msg.sender;
  }

  function addToWhitelist() public payable {
    require(msg.value == whitelistFee, "Incorrect amount of ether");
    wallets[msg.sender].addr = msg.sender;
    wallets[msg.sender].isWhitelisted = true;
    emit SuccessfulTransaction(true);
  }

  function withdraw() public {
    require(msg.sender == owner, "Only owner can withdraw funds");
    msg.sender.transfer(address(this).balance);
  }

  event SuccessfulTransaction(bool success);
}
