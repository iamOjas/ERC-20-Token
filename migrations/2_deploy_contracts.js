var BPTToken = artifacts.require("./BPTToken.sol");
var BPTTokenSale = artifacts.require("./BPTTokenSale.sol");

module.exports = function (deployer) {
  deployer.deploy(BPTToken,10000000).then(function () {
    // token price is 0.00000000000001 ether
    var tokenPrice = 10000;
      return deployer.deploy(BPTTokenSale, BPTToken.address, tokenPrice)
    
  });
};

// module.exports = async function (deployer) {
//   deployer.deploy(BPTToken,10000000)
//   const token = await BPTToken.deployed();
//   var tokenPrice = 10000;
//   deployer.deploy(BPTTokenSale,token.address,tokenPrice);
//   const sale = await BPTTokenSale.deployed();

//   await token.transfer(sale.address,10000)
  
// };