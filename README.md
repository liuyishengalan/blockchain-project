# Hardhat Project - Lotto on blockchain

Deploy this contract on Sepolia

Remember to create a `.env` file with the following content:
```shell
SEPOLIA_API_URL = "https://eth-sepolia.g.alchemy.com/v2/[THE-API-KEY]"
SEPOLIA_PRIVATE_KEY = 'METAMASK-PRIVATE-KEY'
```
Next, run the following commands:
```shell
npm install
npx hardhat test
npx hardhat run scripts/deploy.ts --network sepolia
```
You will see a deployed message with the contract address. Copy the address and paste it in the `lotto.ts` file in the frontend folder.

Check the frontend readme under the directory `frontend` to see how to run the frontend.
