require("dotenv").config(); // Load environment variables from .env
const { ethers } = require("ethers");
const fs = require("fs");

// Read environment variables
const FUJI_RPC_URL = process.env.FUJI_RPC_URL; // Avalanche Fuji Testnet RPC URL
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Wallet private key

if (!FUJI_RPC_URL || !PRIVATE_KEY) {
  console.error("Please set FUJI_RPC_URL and PRIVATE_KEY in your .env file.");
  process.exit(1);
}

// Load the compiled contract ABI and bytecode
const CONTRACT_PATH = "../contracts/WOOL.json"; // Adjust this to your contract JSON location
const contractJson = JSON.parse(fs.readFileSync(CONTRACT_PATH));
const { abi, bytecode } = contractJson;

// Create provider and wallet
const provider = new ethers.providers.JsonRpcProvider(FUJI_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function getWalletBalance() {
  const balance = await wallet.getBalance();
  const formattedBalance = ethers.utils.formatEther(balance);
  console.log(`Wallet Balance: ${formattedBalance} AVAX`);
}

async function main() {
  console.log("Checking wallet balance...");
  await getWalletBalance();

  console.log("Deploying contract to Fuji Testnet...");
  
  // Create a contract factory
  const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);

  // Deploy the contract
  const contract = await contractFactory.deploy(); // Add constructor arguments if needed
  console.log("Transaction hash:", contract.deployTransaction.hash);

  // Wait for deployment to complete
  await contract.deployed();
  console.log("Contract deployed at:", contract.address);

  console.log("Checking wallet balance after deployment...");
  await getWalletBalance();
}

main().catch((error) => {
  console.error("Error deploying contract:", error);
  process.exit(1);
});
