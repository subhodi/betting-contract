var Betting = artifacts.require("./Betting.sol");
var Bet = artifacts.require("./Bet.sol");
var BettingInstance;
var BetInstance;
contract('Betting', function(accounts) {
  it("Initial balance should be 100", function() {
    return Betting.deployed().then(function(instance) {
      BettingInstance = instance;
      instance.register("jon",{"from":accounts[2]});
      return instance.getBalance("jon");
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 100, "Should be 100");
    });
  });

  it("Deploy Bet round", function() {
    return Betting.deployed().then(function(instance) {
      return instance.address
    }).then(function(address) {
      BetInstance = Bet.new(address);
      assert.equal(BetInstance.address, "0x0", "Should not be Ox0");
    });
  });
 

 
 
});
