import React, { Component } from "react";
import "./App.css";
import Web3 from 'web3';
const Network = require("@maticnetwork/meta/network");
const Matic = require("@maticnetwork/maticjs").default;


const network = new Network("testnet","v3");
const MaticNetwork = network.Matic;
const MainNetwork = network.Main;



const Ropsten_Erc20Address = '0xec5c207897c4378658f52bccce0ea648d1f17d65'; 

  


const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
};

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const from = accounts;
     
  const matic = new Matic({
    maticProvider: this.web3,
    parentProvider: this.web3,
    rootChain: MainNetwork.Contracts.RootChain,
    withdrawManager: MainNetwork.Contracts.WithdrawManagerProxy,
    depositManager: MainNetwork.Contracts.DepositManagerProxy,
    registry: MainNetwork.Contracts.Registry  
    }); 
  }
  
 
  



  constructor(props) {  
    super(props);
 
    

    this.state = {
      tokenaddress: null,
      amount: null,
      formErrors: {
        tokenaddress: "",
        amount: ""
      }
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        Address: ${this.state.tokenaddress}
        Amount: ${this.state.amount}
      `);
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }

    let amount = this.state.amount;
    let token = Ropsten_Erc20Address;
      matic
    .approveERC20TokensForDeposit(token, amount, {
      from,
      onTransactionHash: (hash) => {
        // action on Transaction success
        console.log(hash) // eslint-disable-line
      },
    })
    .then(() => {
      // Deposit tokens
       matic.depositERC20Tokens(token, from, amount, {
        from,
        onTransactionHash: (hash) => {
          // action on Transaction success
          console.log(hash) // eslint-disable-line
        },
      })
    })
      
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "tokenaddress":
        formErrors.tokenaddress =
          value.length < 3 ? "minimum 3 characaters required" : "";
        break;
      case "amount":
        formErrors.amount =
          value.length < 3 ? "minimum 3 characaters required" : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors } = this.state;

    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>Create Account</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="tokenaddress">
              <label htmlFor="tokenaddress">Enter token address</label>
              <input
                className={formErrors.tokenaddress.length > 0 ? "error" : null}
                placeholder="First Name"
                type="text"
                name="tokenaddress"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.tokenaddress.length > 0 && (
                <span className="errorMessage">{formErrors.tokenaddress}</span>
              )}
            </div>
            <div className="amount">
              <label htmlFor="amount">Amount</label>
              <input
                className={formErrors.amount.length > 0 ? "error" : null}
                placeholder="Last Name"
                type="text"
                name="amount"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.amount.length > 0 && (
                <span className="errorMessage">{formErrors.amount}</span>
              )}
            </div>
            
            <div className="createAccount">
              <button type="submit">Deposit to matic!</button>
              <small>Deploy your token on matic</small>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
