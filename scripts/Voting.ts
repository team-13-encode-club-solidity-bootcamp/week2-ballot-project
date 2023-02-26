import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// To run this script:
// yarn run ts-node --files scripts/Voting.ts <BALLOT_ADDRESS> <SELECTED_PROPOSAL OPTION 1/2/3>

async function voting() {
  const args = process.argv;

  // Store the params from terminal into variable
  const ballotAddress = args.slice(2, 3)[0];
  const selectedProposal = args.slice(3, 4)[0];

  // Validation
  if (!ballotAddress || ballotAddress.length <= 0)
    throw new Error("Missing parameter: ballot address");
  if (!selectedProposal)
    throw new Error("Missing parameter: selected proposal");

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

  // pick develop ballot factory, attach a voter to vote his choice and console.log output
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = ballotContractFactory.attach(ballotAddress);
  console.log(`You voted for this proposal: ${selectedProposal}`);
  const voted = await ballotContract.vote(selectedProposal);
  const votedTxReceipt = await voted.wait();
  console.log({ votedTxReceipt });
}

voting().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
