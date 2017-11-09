# betting-contract
Smart Contract for Betting using Solidity

## Exection environment setup
```
https://github.com/subhodi/betting-contract.git
cd betting-contract
npm install -g truffle
npm install -g ethereumjs-testrpc
testrpc
```
## Ethreum-bridge setup
```
git clone https://github.com/oraclize/ethereum-bridge.git
cd ethereum-bridge
sudo apt-get install build-essential -y
npm install
node bridge -H localhost:8545 -a 1
Add OAR = OraclizeAddrResolverI(EnterYourOarCustomAddress); to your contract constructor

```
## Compile contract
```
truffle compile
truffle migrate
truffle test
```
