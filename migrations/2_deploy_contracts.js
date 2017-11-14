var Betting = artifacts.require("./Betting.sol");
var Bet = artifacts.require("./Bet.sol");

module.exports = function (deployer) {
  deployer.deploy(Betting, 100).then(function () {
    return deployer.deploy(Bet, Betting.address);
  });
};
