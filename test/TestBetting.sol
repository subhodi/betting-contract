pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Betting.sol";

contract TestBetting {

  function testInitialBalanceWithNewBetting() {
     Betting bet = new Betting(1000);

     uint expected = 1000;

     Assert.equal(bet.initialBalance(), expected, "New contract deployment failed: Initial balance is different");
  }

}
