# Hardhat Project - Lotto on blockchain

Deploy this contract on Sepolia
Detailed guide is [here](https://docs.alchemy.com/docs/how-to-deploy-a-smart-contract-to-the-sepolia-testnet#:~:text=To%20deploy%20a%20smart%20contract%20on%20Sepolia%20Testnet%2C%20there%20are,Solidity%2C%20Hardhat%2C%20and%20Alchemy)

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
