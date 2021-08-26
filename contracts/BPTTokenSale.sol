pragma solidity >=0.4.21 <0.7.0;

import "./BPTToken.sol";

contract BPTTokenSale{

    address payable admin;
    BPTToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    //constructor
    constructor(BPTToken _tokenContract, uint _tokenPrice) public{
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        require(msg.value == (_numberOfTokens*tokenPrice),"Send Correct Number of ether");
        require(_numberOfTokens <= tokenContract.balanceOf(address(this)),"Not enough Tokens available to buy");
        require(tokenContract.transfer(msg.sender, _numberOfTokens),"Transfer Function Failed");

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(admin == msg.sender,"Only admin can call this function");
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))),"Transfer function could not be executed");
        selfdestruct(admin);
    }
}