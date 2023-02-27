# Ballot Project - Encode Club Solidity Bootcamp Week 2

With this app you can:

- Deploy The Ballot contract

- Giving voting rights

- Voting

- Delegating

- Proposals

## Installation

1. Clone this repo

   ```sh
   git clone https://github.com/tianbuyung/encode-club-solidity-bootcamp-week2-ballot-project.git
   ```

2. Mount the directory using terminal.

   ```sh
   cd encode-club-solidity-bootcamp-week2-ballot-project
   ```

3. Install dependencies via terminal

   ```sh
   yarn
   ```

4. Compile the contract

   ```sh
   yarn hardhat compile
   ```

5. Create `.env` file in root project directory with contents according to the example (see [.env.example](/.env.example)) ensure you fill `PRIVATE_KEY` & `ALCHEMY_API_KEY` with your data

## How to run scripts

1. Deployment

   ```sh
   yarn run ts-node --files ./scripts/Deployment.ts "arg1" "arg2" "arg3"
   ```

2. Add voters

   ```sh
   yarn run ts-node --files ./scripts/GiveRightToVote.ts <BALLOT_ADDRESS_FROM_DEPLOYMENT> "voterAddress1" "voterAddress2" "voterAddressN"
   ```

3. Voting

   ```sh
   yarn run ts-node --files ./scripts/Voting.ts <BALLOT_ADDRESS> <SELECTED_PROPOSAL_INDEX>
   ```

4. Delegating vote

   ```sh
   yarn run ts-node --files scripts/Delegating.ts <BALLOT_ADDRESS> <DELEGATE_ADDRESS>
   ```

5. Check the proposal result

   ```sh
   yarn run ts-node --files scripts/ProposalResult.ts <BALLOT_ADDRESS>
   ```
