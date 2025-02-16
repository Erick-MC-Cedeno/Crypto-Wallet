# BlockVault

## 🛠️ Technology Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Truffle](https://img.shields.io/badge/Truffle-5E464D?style=for-the-badge&logo=truffle&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## SETUP NODE ENV  
set NODE_OPTIONS=--openssl-legacy-provider  

## START FRONTEND  
cd frontend  
npm install  
npm start  

## INSTALL BACKEND DEPENDENCIES  
cd backend  
npm install  
npm install -g pm2  
npm install -g solc  

## START APP-CORE  
cd backend/app-core  
npm i -g @nestjs/cli  
npm install  
nest start --watch (listening mode)  
nest start  

## START DAEMONS AND WORKERS  
pm2 start process.json  
pm2 monit  
pm2 stop process.json  

## START INSTANCES  
docker-compose up  
download Redis server  
download MongoDB server  
redis-server  
mongod --port --  

## DEPLOY SMART CONTRACT AND GENERATE WALLETS  
cd backend/tasks/  
npm install -g truffle  
truffle deploy --network (--network name--)  
node generate.js (--number of wallets--) + (--network ID--)  

### Screenshots  

# Login  
![Login](frontend/src/assets/screenshots/Login.png)  

# Register  
![Register](frontend/src/assets/screenshots/Register.png)  

# 2FA Auth  
![2FA](frontend/src/assets/screenshots/2FA.png)  

# Dashboard  
![Home](frontend/src/assets/screenshots/Home.png)  

# Wallets  
![Wallets](frontend/src/assets/screenshots/wallets.png)  

# Settings  
![Settings](frontend/src/assets/screenshots/Settings.png)  

# Transactions  
![Transa](frontend/src/assets/screenshots/trans.png)  

# Transactions History  
![Transa](frontend/src/assets/screenshots/history.png)  

# Dashboard wallets  
![Wallet](frontend/src/assets/screenshots/wallet.png)  
