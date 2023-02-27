import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// To run this script:
// yarn run ts-node --files scripts/GiveRightToVote.ts <BALLOT_ADDRESS_FROM_DEPLOYMENT> "voterAddress1" "voterAddress2" "voterAddressN"

async function giveRightToVote() {
  const args = process.argv;

  // Store the params from terminal into variable
  const ballotAddress = args.slice(2, 3)[0];
  const voters = args.slice(3);

  // Validation
  if (!ballotAddress || ballotAddress.length <= 0)
    throw new Error("Missing parameter: ballot address");
  if (voters.length <= 0) throw new Error("Missing parameter: voters");

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

  // pick develop ballot factory, attach the voters and console.log output
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = ballotContractFactory.attach(ballotAddress);
  console.log(`Giving rights to vote to ballot with address ${ballotAddress}`);
  for (let index = 0; index < voters.length; index++) {
    console.log(`Giving right to vote to ${voters[index]}`);
    const rightToVote = await ballotContract.giveRightToVote(voters[index]);
    const rightToVoteTxReceipt = await rightToVote.wait();
    console.log({ rightToVoteTxReceipt });
  }
}

giveRightToVote().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
