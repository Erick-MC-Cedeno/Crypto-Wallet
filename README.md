# crypto-exchange

# START FRONTEND 
cd frontend 
npm install
npm start

# INSTALL BACKEND DEPENDENCIES
cd backend 
npm install 
npm install -g pm2 
npm install -g solc 

# START APP-CORE 
cd backend/app-core
 npm i -g @nestjs/cli
 npm install
 nest start --watch (listening mode)
 nest start

 # START DEAMONS 
 docker-compose up 
 download redis server 
 download mongo server 
 redis-server 
 mongod --port --

# DEPLOY SMART CONTRACT AND GENERATE WALLETS
cd backend/tasks/
npm install -g truffle
truffle deploy --network (--network name--)
node generate.js (--numer of wallets--) + (--networl ID--)
