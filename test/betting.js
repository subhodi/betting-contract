const Betting = artifacts.require("./Betting.sol");
const Bet = artifacts.require("./Bet.sol");

var bettingContractInstance;
var betContractInstance;

contract('Betting', function (accounts) {

  it('Deploy both contracts', () => {
    return Betting.new(100, { from: accounts[3] })
      .then(instance => {
        bettingContractInstance = instance;
        return instance.newRound({ from: accounts[3] });
      })
      .then(tx => bettingContractInstance.currentBet())
      .then(instance => {
        betContractInstance = Bet.at(instance);
        return betContractInstance.getOwner();
      })
      .then(ownerAddress => {
        assert.equal(ownerAddress, bettingContractInstance.address, "Deployment failed: Owner address different");
      });
  });

  it("Register 1st user", () => {
    return bettingContractInstance.register("batman", { from: accounts[3] })
      .then(tx => {
        return bettingContractInstance.getBalance("batman");
      })
      .then(balance => {
        assert.equal(balance.valueOf(), 100, "Initial balance is different");
      });
  });

  it("Place bet transaction", () => {
    return bettingContractInstance.placeBet("batman", 451296, 20, { from: accounts[3] })
      .then(tx => {
        return bettingContractInstance.getBalance("batman");
      })
      .then(balance => {
        assert.equal(balance.valueOf(), 80, "balance after betting should be 80");
      });
  });

  it("Effective bet amount", () => {
    betContractInstance.getParticipantAmount("batman").then(function (amount) {
      assert.equal(amount.valueOf(), 451296, "Betting amount is different");
    });
  });

  it("Register 2nd user", () => {
    return bettingContractInstance.register("superman", { from: accounts[3] }).then(function (tx) {
      return bettingContractInstance.getBalance("superman");
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 100, "Second user: Initial balance different");
      return bettingContractInstance.placeBet("superman", 477200, 30, { from: accounts[3] })
        .then(function (tx) {
          return bettingContractInstance.getBalance("superman");
        })
        .then(function (balance) {
          assert.equal(balance.valueOf(), 70, "balance after betting should be 70");
          return betContractInstance.getParticipantAmount("superman")
            .then(function (balance) {
              return balance;
            });
        })
        .then(function (bettingAmount) {
          assert.equal(bettingAmount.valueOf(), 477200, "Betting amount is different");
        });
    });
  });

  it("Declare winner", () => {
    bettingContractInstance.declare({ from: accounts[3], gas: 900000 }).then(function (tx) {
      assert(true, "Transaction success");
    }).catch(function (error) {
      console.error(error.toString());
    });
  });

  it("Should emit market price event", () => {
    const event = betContractInstance.LogMarketPrice({}, { fromBlock: 0, toBlock: 'latest' });
    event.watch(function (error, response) {
      console.log("Market price fetched: " + response.args._marketPrice);
      bettingContractInstance.resolve({ from: accounts[3] }).then(function (tx) {
        assert(true, "Transaction success");
      }).catch(function (error) {
        console.error(error.toString());
      });
    });
  });

  it("Should emit Winner event", () => {
    const event = bettingContractInstance.LogWinner({}, { fromBlock: 0, toBlock: 'latest' });
    event.watch(function (error, response) {
      const winner = web3.toAscii(response.args._winner).replace(/\u0000/g, '');
      console.log("Winner is: " + winner);
      bettingContractInstance.getBalance("batman").then(function (balance) {
        assert.equal(balance.valueOf(), 130, "Winner amount is not updated");
        console.log("-----Test complete-----");
      });
    });
  });


});
