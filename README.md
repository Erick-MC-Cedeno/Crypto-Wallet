# NicBlockVault

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

## START DAEMONS
docker-compose up  
download redis server  
download mongo server  
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

# Dashboard wallets
![Wallet](frontend/src/assets/screenshots/wallet.png)

# Wallets
![Wallets](frontend/src/assets/screenshots/wallets.png)


# Home3 
![Home (2)](frontend/src/assets/screenshots/Home3.png)

# Settings
![Settings](frontend/src/assets/screenshots/Settings.png)

# Transactions
![Transa](frontend/src/assets/screenshots/trans.png)

# Transactions History
![Transa](frontend/src/assets/screenshots/history.png)


