// Importing modules
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {tokenaddress1,abi1,tokenaddress2,abi2,tokenaddress3,abi3,fraxaddress,abi4} from "./abi";
import web3 from "./web3";
import {useRef} from "react";



function App() {

// usetstate for storing and retrieving wallet details
const [data, setdata] = useState({
	address: "",
	Balance: null,
});

const[amount,setAmount]=useState("");
const[amount1,setAmount1]=useState("");
const[amount2,setAmount2]=useState("");
const[amount3,setAmount3]=useState("");
const[collatratio,setratio]=useState("");
const inputamt=useRef(null);
const inputamt1=useRef(null);
const inputamt2=useRef(null);

const erc20contract1 = new web3.eth.Contract(abi1, tokenaddress1);
const erc20contract2 = new web3.eth.Contract(abi2, tokenaddress2);
const erc20contract3 = new web3.eth.Contract(abi3, tokenaddress3);
const fraxcontract = new web3.eth.Contract(abi4, fraxaddress);




// Button handler button for handling a
// request event for metamask
const btnhandler = () => {

	// Asking if metamask is already present or not
	if (window.ethereum) {

	// res[0] for fetching a first wallet
	window.ethereum
		.request({ method: "eth_requestAccounts" })
		.then((res) => accountChangeHandler(res[0]));
	} else {
	alert("install metamask extension!!");
	}
};

const mint = async(val)=>{
    console.log("Transfering....",val);
	
    const accounts = await  web3.eth.getAccounts();
    await fraxcontract.methods.Mintfrax(web3.utils.toBN(val)).send({from:accounts[0]});
    
  }
  function handle() {
    console.log(inputamt.current.value);
	
    let f=inputamt.current.value;
	
    setAmount(f*1000000000000000000);
    mint(f);
  }

const redeem = async()=>{
    console.log("Transfering....");
	
    const accounts = await  web3.eth.getAccounts();
    await fraxcontract.methods.Redeem().send({from:accounts[0]});
    setAmount3(await fraxcontract.methods.collatamt(accounts[0]).call());
  }
  
  const buyback = async(val1)=>{
    console.log("Transfering....",val1);
	
    const accounts = await  web3.eth.getAccounts();
    await fraxcontract.methods.buyback(web3.utils.toBN(val1)).send({from:accounts[0]});
    
  }
  function handle1() {
    console.log(inputamt1.current.value);
	
    let g=inputamt1.current.value;
	
    setAmount1(g*1000000000000000000);
    buyback(g);
  }

  const recolateralise = async(val2)=>{
    console.log("Transfering....",val2);
	
    const accounts = await  web3.eth.getAccounts();
    await fraxcontract.methods.recollateralise(web3.utils.toBN(val2)).send({from:accounts[0]});
	
    
  }
  function handle2() {
    console.log(inputamt2.current.value);
	
    let h=inputamt2.current.value;
	

	setAmount2(h*1000000000000000000);
    recolateralise(h);
  }
// getbalance function for getting a balance in
// a right format with help of ethers
const getbalance = (address) => {

	// Requesting balance method
	window.ethereum
	.request({
		method: "eth_getBalance",
		params: [address, "latest"]
	})
	.then((balance) => {
		// Setting balance
		setdata({
		Balance: ethers.utils.formatEther(balance),
		});
	});
};

// Function for getting handling all events
const accountChangeHandler = (account) => {
	// Setting an address data
	setdata({
	address: account,
	});

	// Setting a balance
	getbalance(account);
};
	  	


		  const cratio = async()=>{
			
	        const accounts = await web3.eth.getAccounts();
	        await fraxcontract.methods.Collatratio().send({from:accounts[0]});
			let a = await fraxcontract.methods.collatratio().call();
			setratio(a);
			console.log("calculate ratio..");
	
			
			  }
			

         const approve = async()=>{
			const accounts = await  web3.eth.getAccounts();
			await erc20contract1.methods.approve("0x44Aa3A67aae3a3817cde172BB88C64091e31D9d7",web3.utils.toBN(100000000000000000000)).send({from:accounts[0]});
			await erc20contract2.methods.approve("0x44Aa3A67aae3a3817cde172BB88C64091e31D9d7",web3.utils.toBN(100000000000000000000)).send({from:accounts[0]});
			await erc20contract3.methods.approve("0x44Aa3A67aae3a3817cde172BB88C64091e31D9d7",web3.utils.toBN(100000000000000000000)).send({from:accounts[0]});
			await erc20contract1.methods.approve(accounts[0],web3.utils.toBN(100000000000000000000)).send({from:accounts[0]});
			await erc20contract2.methods.approve(accounts[0],web3.utils.toBN(100000000000000000000)).send({from:accounts[0]});
			await erc20contract3.methods.approve(accounts[0],web3.utils.toBN(100000000000000000000)).send({from:accounts[0]});
		}

	  
		  
	

return (
	<div className="App">
	{/* Calling all values which we
	have stored in usestate */}

	<Card className="text-center">
		<Card.Header>
		<strong>Address: </strong>
		{data.address}
		</Card.Header>
		<Card.Body>
		<Card.Text>
			<strong>Balance: </strong>
			{data.Balance}
		</Card.Text>
		<Button onClick={btnhandler} variant="primary">
			Connect to wallet
		</Button>
		
		
		
		<br/>
		<br/>
		<Button onClick={approve} >
		approve
		</Button><br/><br/>

		<h2>Mint Amount</h2>
		<br/>
		<label>Amount</label>&nbsp;&nbsp;<input ref={inputamt}
        type="text"
        id="amt"
        name="amt"/>&nbsp;&nbsp;
       <button onClick={handle}>Mint</button>
       <p>{amount}</p><br/><br/>
		
		<h2>Redeem Amount</h2>
		<br/>
		
        <button onClick={redeem}>Redeem</button>
		<p>{amount3}</p>
        <br/><br/>
		
		<Button onClick={cratio} >
		Collateral ratio
		</Button>
		<p>{collatratio}</p>
	    <br/><br/>
	
	    <h2>Buy back</h2>
		<br/>
		<label>Amount</label>&nbsp;&nbsp;<input ref={inputamt1}
        type="text"
        id="amt1"
        name="amt1"/>&nbsp;&nbsp;
     <Button onClick={handle1}>Buyback</Button>	

	 <h2>Recolateralise</h2>
		<br/>
		<label>Amount</label>&nbsp;&nbsp;<input ref={inputamt2}
        type="text"
        id="amt2"
        name="amt2"/>&nbsp;&nbsp;
     <Button onClick={handle2}>Recolateralise</Button>	
		
		</Card.Body>
	</Card>
	</div>
);

}
export default App;

