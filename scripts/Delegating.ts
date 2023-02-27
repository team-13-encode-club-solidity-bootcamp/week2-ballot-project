import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// yarn run ts-node --files scripts/Delegating.ts <BALLOT_ADDRESS> <DELEGATE_ADDRESS>

async function delegating() {
  const args = process.argv;

  // Store the params from terminal into variable
  const ballotAddress = args.slice(2)?.[0];
  const delegateAddress = args.slice(2)?.[1];

  // Validation
  if (!ballotAddress || ballotAddress.length <= 0)
    throw new Error("Missing parameter: ballot address");
  if (delegateAddress.length <= 0)
    throw new Error("Missing parameter: delegate address");

  // get default provider from hardhat config
  const provider = ethers.provider;
  // console.log(provider);

  // import wallet
  const pkey = process.env.PRIVATE_KEY; // can change with mnemonic/private key
  // Validation
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

  // pick develop ballot factory, attach a voter to delegate his choice and console.log output
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = ballotContractFactory.attach(ballotAddress);
  const delegated = await ballotContract.delegate(delegateAddress);
  const delegatedTxReceipt = await delegated.wait();
  console.log(`Your vote has been delegated to ${delegateAddress}`);
  console.log({ delegatedTxReceipt });
}

delegating().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
