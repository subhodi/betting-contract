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
    return bettingContractInstance.placeBet("batman", 400100, 20, { from: accounts[3] }).then(function (tx) {
      return bettingContractInstance.getBalance("batman");
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 80, "balance after betting should be 80");
    });
  });

  it("Effective bet amount", function () {
    betContractInstance.getParticipantAmount("batman").then(function (balance) {
      assert.equal(balance.valueOf(), 400100, "Betting amount is different");
    });
  });

  it("Register 2nd user", function () {
    return bettingContractInstance.register("superman", { from: accounts[3] }).then(function (tx) {
      return bettingContractInstance.getBalance("superman");
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 100, "Secon d user: Initial balance different");
      return bettingContractInstance.placeBet("superman", 477200, 30, { from: accounts[3] }).then(function (tx) {
        return bettingContractInstance.getBalance("superman");
      }).then(function (balance) {
        assert.equal(balance.valueOf(), 70, "balance after betting should be 70");
        return betContractInstance.getParticipantAmount("superman").then(function (balance) {
          return balance;
        });
      }).then(function (bettingAmount) {
        assert.equal(bettingAmount.valueOf(), 477200, "Betting amount is different");
      });
    });
  });

  it("Register 3nd user", function () {
    return bettingContractInstance.register("thor", { from: accounts[3] }).then(function (tx) {
      return bettingContractInstance.getBalance("thor");
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 100, "Secon d user: Initial balance different");
      return bettingContractInstance.placeBet("thor", 410000, 40, { from: accounts[3] }).then(function (tx) {
        return bettingContractInstance.getBalance("thor");
      }).then(function (balance) {
        assert.equal(balance.valueOf(), 60, "balance after betting should be 70");
        return betContractInstance.getParticipantAmount("thor").then(function (balance) {
          return balance;
        });
      }).then(function (bettingAmount) {
        assert.equal(bettingAmount.valueOf(), 410000, "Betting amount is different");
      });
    });
  });

  it("Declare winner", function () {
    bettingContractInstance.declare({ from: accounts[3], gas: 900000 }).then(function (tx) {
      assert(true, "Transaction success");
    }).catch(function (error) {
      console.log(error.toString());
    });
  });

  it("Should emit market price event", function () {
    var event = betContractInstance.LogMarketPrice({}, { fromBlock: 0, toBlock: 'latest' });
    event.watch(function (error, response) {
      console.log("Market price fetched: " + response.args._marketPrice);
      bettingContractInstance.resolve({ from: accounts[3], gas: 900000 }).then(function (tx) {
        assert(true, "Transaction success");
      }).catch(function (error) {
        console.log(error.toString());
      })

    });
  });

  it("Should emit Winner event", function () {
    var event = bettingContractInstance.LogWinner({}, { fromBlock: 0, toBlock: 'latest' });
    event.watch(function (error, response) {
      var winner = web3.toAscii(response.args._winner).replace(/\u0000/g, '');
      console.log("Winner is: " + winner);
      bettingContractInstance.getBalance("thor").then(function (balance) {
          assert.equal(balance.valueOf(), 160, "Winner amount is not updated");
          console.log("-----Test complete-----")
      });
    });
  });


});
