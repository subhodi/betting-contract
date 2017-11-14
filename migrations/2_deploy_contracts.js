const Bet = artifacts.require("./Bet.sol");
const Betting = artifacts.require("./Betting.sol");

module.exports = function (deployer) {
  deployer.deploy(Bet);
  deployer.link(Bet, Betting);
  deployer.deploy(Betting, 100);
};
