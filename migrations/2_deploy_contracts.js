var BPTToken = artifacts.require("./BPTToken.sol");

module.exports = function(deployer) {
  deployer.deploy(BPTToken,10000000);
};
