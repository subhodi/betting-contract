var ConvertLib = artifacts.require("./ConvertLib.sol");
var Betting = artifacts.require("./Betting.sol")

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, Betting);
  deployer.deploy(Betting);
};
