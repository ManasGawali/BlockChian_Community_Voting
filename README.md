# ChainVote - Blockchain Election System

## Overview

ChainVote is a decentralized election platform built on the Ethereum blockchain (Sepolia testnet). It allows admins to create elections, voters to cast votes without needing MetaMask (via gasless voting), and admins to publish results and withdraw remaining funds. The frontend is built with React and Vite, styled with Tailwind CSS, and the backend uses Express.js with MongoDB for data storage. Smart contracts (Election and ElectionFactory) handle election logic on-chain.

## Features

- **Gasless Voting:** Voters can vote without MetaMask; the backend relays votes using ETH stored in the contract.
- **Admin Functions:** Admins can create multiple elections, publish results, and withdraw funds using MetaMask.
- **Secure Authentication:** JWT-based authentication for user roles (admin/voter).
- **Responsive UI:** A modern interface with a black and green theme, featuring a landing page, voting interface, and election management.

## Prerequisites

- Node.js (v18 or later)
- MetaMask (for admin interactions with the blockchain)
- MongoDB (local or cloud instance)
- Sepolia Testnet ETH (for deploying contracts and funding elections)
- Hardhat (for smart contract deployment)

## Project Structure

```
chainvote/
├── backend/                 # Express.js backend
│   ├── models/              # MongoDB schemas (e.g., Election, User)
│   ├── routes/              # API endpoints (e.g., createElection, vote, publishResults)
│   └── server.js            # Main backend entry point
├── contracts/               # Smart contracts
│   ├── Election.sol         # Election contract
│   └── ElectionFactory.sol  # Factory contract for creating elections
├── frontend/                # React + Vite frontend
│   ├── src/                 # React components and assets
│   │   ├── components/      # Reusable components (e.g., Sidebar, VerticalCard)
│   │   ├── abi/             # Contract ABIs (ElectionABI.json, ElectionFactoryABI.json)
│   │   └── pages/           # Page components (e.g., CreateElection, Elections)
│   └── .env                 # Environment variables
├── scripts/                 # Hardhat scripts for deployment
└── README.md                # This file
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chainvote.git
cd chainvote
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

#### Smart Contracts

```bash
cd contracts
npm install
```

### 3. Configure Environment Variables

#### Backend

Create a `.env` file in the `backend/` directory:

```
MONGO_URI=mongodb://localhost:27017/chainvote
JWT_SECRET=your_jwt_secret
PORT=5001
```

#### Frontend

Create a `.env` file in the `frontend/` directory:

```
VITE_ELECTION_FACTORY_ADDRESS=0xYourElectionFactoryAddress
VITE_BACKEND_URL=http://localhost:5001
```

### 4. Deploy Smart Contracts

Configure Hardhat in `contracts/hardhat.config.js` with your Sepolia provider (e.g., Infura) and MetaMask private key.

Then deploy the contracts:

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Update `VITE_ELECTION_FACTORY_ADDRESS` in `frontend/.env` with the deployed ElectionFactory address.

### 5. Run the Backend

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5001`.

### 6. Run the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port specified by Vite).

## Usage

### 1. Create an Election (Admin)

- Log in as an admin (role stored in localStorage).
- Navigate to `/communities/:name/createelections`.
- Enter election details (name, candidates, dates, etc.) and submit.
- MetaMask will prompt to sign the transaction to deploy the election contract via ElectionFactory.

### 2. Vote (Voter)

- Log in as a voter.
- Navigate to `/elections/vote`.
- Select a candidate and submit your vote.
- The backend relays the vote to the blockchain using the contract’s ETH balance (gasless for the voter).

### 3. Publish Results and Withdraw Funds (Admin)

- Navigate to `/elections` and switch to the "Past Elections" tab.
- Click "Publish Results" on an ended election.
- MetaMask will prompt to sign the `withdrawAllFunds` transaction, transferring remaining ETH to the admin.
- Results are then published and viewable by voters.

## Smart Contract Details

- **ElectionFactory.sol:** Deploys new Election contracts. Admins can create multiple elections.
- **Election.sol:** Manages election logic (voting, fund withdrawal). Includes `withdrawAllFunds` (admin-only) to return ETH to the admin after the election ends.

## Security Notes

- **Private Keys:** Never store private keys in the frontend `.env`. Use MetaMask for signing transactions.
- **JWT:** Ensure `JWT_SECRET` is secure and not exposed.
- **MongoDB:** Use a cloud instance (e.g., MongoDB Atlas) for production to avoid local exposure.

## Troubleshooting

- **MetaMask Errors:** Ensure MetaMask is on Sepolia and the admin account matches the contract’s admin address.
- **Backend Errors:** Check MongoDB connection and ensure the `MONGO_URI` is correct.
- **Frontend Errors:** Verify environment variables are prefixed with `VITE_` and the Vite server is restarted after changes.

## Future Improvements

- Add voter verification via digital signatures.
- Implement a results dashboard with charts.
- Support mainnet deployment for production use.

## License

MIT License - see `LICENSE` for details.