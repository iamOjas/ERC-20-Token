import React, {
  useEffect,
  useState
} from "react";
import BPTTokenSaleContract from "./contracts/BPTTokenSale.json";
import BPTTokenContract from "./contracts/BPTToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

var App = () => {
  const [balance, setBalance] = useState(0);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [Contract, setContract] = useState(undefined);
  const [tokenContract, setTokenContract] = useState(undefined);
  const [numberOfToken, SetnumberOfToken] = useState(0);
  const [tokenPrice,setTokenPrice] = useState("");
  const [tokensSold,setTokensSold] = useState("");
  const [totalTokens,setTotalTokens] = useState("");
  const [button,toggle] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = BPTTokenSaleContract.networks[networkId];
        const deployedNetwork1 = BPTTokenContract.networks[networkId];
        
        const Tokeninstance = new web3.eth.Contract(
          BPTTokenContract.abi,
          deployedNetwork1 && deployedNetwork1.address,
          {from:accounts[0]}
        );

        const instance = new web3.eth.Contract(
          BPTTokenSaleContract.abi,
          deployedNetwork && deployedNetwork.address,
          {from:accounts[0]}
        );

        

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setTokenContract(Tokeninstance);
        setContract(instance);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, [])

  useEffect(() => {
    const init = async () => {
      const balance = await tokenContract.methods.balanceOf(accounts[0]).call();
      const tokenPrice = await Contract.methods.tokenPrice().call();
      var tokenssold = await Contract.methods.tokensSold().call();
      console.log(Contract._address);
      const totaltokens = await tokenContract.methods.balanceOf(Contract._address).call();
      setTotalTokens(totaltokens.toString());
      setTokensSold(tokenssold);
      setTokenPrice(tokenPrice.toString());
      setBalance(balance.toString())
    }
    if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof Contract !== 'undefined' && typeof tokenContract !== 'undefined') {
      init();
    }

  }, [web3, accounts, Contract, tokenContract,button])

  if (typeof web3 === 'undefined') {
    return <div> Loading Web3, accounts, and contract... </div>;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await Contract.methods.buyTokens(numberOfToken).send({
      from: accounts[0],
      value: tokenPrice*numberOfToken
    });
    
    toggle(!button);
  }


  return(
    <div className="App" >
      <h1>BLOCKCHAIN PRACTICE TOKEN SALE</h1>
      <p>You currently have {balance} tokens</p>
      <p>Token Price is {web3.utils.fromWei(tokenPrice, 'ether')} ether</p>
    <form onSubmit = {handleSubmit} >
      <input type="number" 
        placeholder = "Enter the number of Tokens you want to buy..... "
        onChange = {(event)=>{SetnumberOfToken(event.target.value)}}    
        min = "1"  
      />
      <button type="submit">BUY</button>
    </form>
    <p>Tokens Sold : {tokensSold}</p>
    <p>Tokens left :{totalTokens}</p>
    <p>Your address : {accounts} </p>
  </div>
  )

}

export default App;