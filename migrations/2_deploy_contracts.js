var BPTToken = artifacts.require("./BPTToken.sol");
var BPTTokenSale = artifacts.require("./BPTTokenSale.sol");

module.exports = function (deployer) {
  deployer.deploy(BPTToken,10000000).then(function () {
    // token price is 0.00000000000001 ether
    var tokenPrice = 10000;
    return deployer.deploy(BPTTokenSale, BPTToken.address, tokenPrice)
  });
};