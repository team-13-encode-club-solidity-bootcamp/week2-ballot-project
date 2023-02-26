import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// To run this script:
// yarn run ts-node --files scripts/Deployment.ts "arg1" "arg2" "arg3"

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function deployment() {
  // take argument from terminal
  const args = process.argv;
  // console.log({ args });
  // return;
  const proposals = args.slice(2);
  if (proposals.length <= 0) throw new Error("Missing parameter : proposals");

  // get default provider from hardhat config
  const provider = ethers.provider;
  //   console.log({ provider });

  // import wallet
  const pkey = process.env.PRIVATE_KEY; // can change with mnemonic/private key
  if (!pkey || pkey.length <= 0)
    throw new Error(
      "Missing environment : Private key, please check your .env file"
    );
  const wallet = new ethers.Wallet(pkey); // ethers.Wallet.fromMnemonic(mnemonic);
  console.log(`Connected to the wallet address ${wallet.address}`);

  // connect with signer and check the balance
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`Wallet balance: ${balance} Wei`);

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  // pick develop ballot factory, deploy contract and console.log output
  const ballotContractFactory = new Ballot__factory(signer);
  console.log("Deploying contract ...");
  const ballotContract = await ballotContractFactory.deploy(
    convertStringArrayToBytes32(proposals)
  );
  const deployTxReceipt = await ballotContract.deployTransaction.wait();
  console.log(
    `The contract was deployed at the address ${ballotContract.address}`
  );
  console.log({ deployTxReceipt });
}

deployment().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
