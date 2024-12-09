const { ethers } = require("ethers");
const fs = require("fs");

async function createWallet() {
  // Generate a new wallet
  const wallet = ethers.Wallet.createRandom();

  // Save the private key and address to a file
  const walletDetails = {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };

  fs.writeFileSync("wallet.json", JSON.stringify(walletDetails, null, 2));
  console.log("Wallet created!");
  console.log("Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);
  console.log("Details saved to wallet.json");
}

createWallet();