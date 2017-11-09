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
    return bettingContractInstance.placeBet("batman", 451296, 20, { from: accounts[3] }).then(function (tx) {
      return bettingContractInstance.getBalance("batman");
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 80, "balance after betting should be 80");
    });
  });

  it("Effective bet amount", function () {
    betContractInstance.getParticipantAmount("batman").then(function (balance) {
      assert.equal(balance.valueOf(), 451296, "Betting amount is different");
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
      console.log(response);
      bettingContractInstance.resolve({ from: accounts[3] }).then(function (tx) {
        assert(true, "Transaction success");
      }).catch(function (error) {
        console.log(error.toString());
      })

    });
  });

  it("Should emit Winner event", function () {
    var event = bettingContractInstance.LogWinner({}, { fromBlock: 0, toBlock: 'latest' });
    event.watch(function (error, response) {
      console.log(response);

    });
  });


});

  // console.log("Winner: "+web3.toAscii(response.args._winner).replace(/\u0000/g, ''));
  // bettingContractInstance.sendWinningAmount(response.args._winner,{from:accounts[3]}).then(function(tx){
  //   return bettingContractInstance.getBalance("superman");
  // }).then(function(balance){
  //   console.log("Winner account balance is "+balance.valueOf());
  //   assert.equal(balance.valueOf(), 120, "Winner amount is not updated");
  //   console.log("-----Test complete-----")
  // })  