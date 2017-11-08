var Betting = artifacts.require("./Betting.sol");
var Bet = artifacts.require("./Bet.sol");

var bettingContractInstance;
var betContractInstance;
contract('Betting', function (accounts) {

  it("Deploy both contracts", function () {
    return Betting.new(100, { from: accounts[3] }).then(function (bettingInstance) {
      bettingContractInstance = bettingInstance;
      return Bet.new(bettingInstance.address, { from: accounts[3] }).then(function (betInstance) {
        betContractInstance = betInstance;
        return bettingInstance.newRound(betInstance.address, { from: accounts[3] }).then(function (tx) {
          return bettingInstance.register("batman", { from: accounts[3] }).then(function (tx) {
            return bettingInstance.getBalance("batman");
          });
        })
      })
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 100, "Deployment failed: Initial balance different");
    });
  });

  it("Check balance", function () {
    return bettingContractInstance.getBalance("batman").then(function (balance) {
      assert.equal(balance.valueOf(), 100, "Initial balance is different");
    })
  });

  it("Place bet transaction", function () {
    return bettingContractInstance.placeBet("batman",451296, 20,{from:accounts[3]}).then(function (tx) {
      return bettingContractInstance.getBalance("batman");
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 80, "balance after betting should be 80");
    });
  });

  
  // it("Place bet", function () {
  //   return Betting.deployed().then(function (instance) {
  //     instance.placeBet("jon", 465741, 20, { "from": accounts[2] });
  //     return instance.getBalance("jon");
  //   }).then(function (balance) {
  //     console.log(balance);
  //     return Bet.deployed().then(function (instance) {
  //       console.log(instance.address);
  //       return instance.getParticipantAmount("jon");
  //     }).then(function (bettingAmount) {
  //       console.log(bettingAmount);
  //       assert.equal(bettingAmount.valueOf(), 465741, "betting amount is incorrect");
  //     }).catch(function(error) {
  //       console.log(error);
  //     });

  //   });
  // });

});

