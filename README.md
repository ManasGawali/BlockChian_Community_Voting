# 🗳️ ChainVote - Decentralized Voting Platform

## 🌐 Introduction
Welcome to **ChainVote**, a modern, blockchain-based election system enabling communities to conduct **transparent**, **secure**, and **gasless** voting on the Ethereum Sepolia testnet.

## 🚀 Features
- 👤 **Admin Role**: Create and manage elections with MetaMask
- 🧑‍🤝‍🧑 **Voter Access**: Participate in elections without MetaMask
- 💸 **Gasless Voting**: Backend relays transactions, gas fees covered by contract
- 📢 **Result Publishing**: Admins can publish results and reclaim unused ETH
- 🔐 **Secure JWT Authentication** for users
- 🎨 Sleek UI with **React + TailwindCSS**

## 🏗️ Architecture
- **Frontend**: Vite + React + Tailwind
- **Backend**: Node.js + Express.js + MongoDB
- **Smart Contracts**: Solidity (Hardhat)

## 🗂️ Directory Structure
```
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

## ⚙️ Setup Guide

### 1. 📥 Clone Repo
```bash
git clone https://github.com/yourusername/chainvote.git && cd chainvote
```

### 2. 📦 Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../contracts && npm install
```

### 3. 🧪 Environment Setup

#### Backend `.env`
```
MONGO_URI=mongodb://localhost:27017/chainvote
JWT_SECRET=supersecretkey
PORT=5001
```

#### Frontend `.env`
```
VITE_ELECTION_FACTORY_ADDRESS=0xYourContract
VITE_BACKEND_URL=http://localhost:5001
```

### 4. 📤 Contract Deployment
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
Copy the `ElectionFactory` contract address to `frontend/.env`.

### 5. 🧾 Start Servers
```bash
cd backend && npm start
cd ../frontend && npm run dev
```

## 🧑‍💻 Usage

### 👩‍💼 Admin
- Create an election
- Set parameters: name, candidates, duration
- MetaMask required to sign transaction

### 🧑‍🗳️ Voter
- Join election using invite link
- Vote without MetaMask
- Your vote is relayed via backend

### 📣 Publish Results
- After election ends
- Admin clicks "Publish Results"
- Funds withdrawn to admin wallet

## 📜 Contracts Overview
- **ElectionFactory.sol**: Deploys and tracks all elections
- **Election.sol**: Manages voting, stores candidates, emits results

## 🔐 Security Considerations
- ✅ Private key usage only on admin MetaMask
- ✅ Votes are anonymized and relayed
- ✅ Environment variables secured server-side

## ✨ Future Additions
- 🎯 Mainnet deployment
- 📊 Enhanced analytics dashboard
- 📬 Email verification for voters

## 📄 License
[MIT](./LICENSE)

---

🛡️ Built with ❤️ for democratic communities
