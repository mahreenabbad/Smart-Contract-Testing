require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

// Ensure your configuration variables are set before executing the script
// const { vars } = require("hardhat/config");

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and add its key to the configuration variables
const API_KEY = process.env.ALCHEMY_API_KEY;
const SEPOLIA_KEY = process.env.SEPOLIA_PRIVATE_KEY;


// Add your Sepolia account private key to the configuration variables
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts


module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`,
      accounts: [SEPOLIA_KEY]
    }
  }
};