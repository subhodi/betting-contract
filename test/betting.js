var Betting = artifacts.require("./Betting.sol");

contract('Betting', function(accounts) {
  it("Initial balance should be 100", function() {
    return Betting.deployed().then(function(instance) {
      instance.register("jon");
      return instance.getBalance("jon");
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 100, "Should be 100");
    });
  });
 
 
});
