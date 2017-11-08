var Betting = artifacts.require("./Betting.sol");
var Bet = artifacts.require("./Bet.sol");

contract('Betting', function(accounts) {
  it("Initial balance should be 100", function() {
    return Betting.deployed().then(function(instance) {
      instance.register.sendTransaction("jon",{"from":accounts[2]});
      return instance.getBalance("jon");
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 100, "Should be 100");
    });
  });
 

 
 
});
