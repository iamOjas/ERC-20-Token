// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract BPTToken{

  uint public totalSupply;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint)) public allowance;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);


  function name() public pure returns (string memory){
    return "BlockChain Practice Token";
  }

  function symbol() public pure returns (string memory){
    return "BPT";
  }

  constructor(uint _initialSupply) public{
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success){
    require(balanceOf[msg.sender] >= _value,"You dont have enough balance in your address");
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender,_to,_value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success){
    allowance[msg.sender][_spender] = _value;

    emit Approval(msg.sender,_spender,_value);

   return true;
  }


  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    require(balanceOf[_from] >= _value,"Sender does not have enough balance in his account");
    require(allowance[_from][msg.sender] >= _value, "The spender does not have enough allowance");

    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    allowance[_from][msg.sender] -= _value;

    emit Transfer(_from,_to,_value);
    return true;
     }



}
