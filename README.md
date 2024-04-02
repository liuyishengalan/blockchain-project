# Sample Hardhat Project

Deploy your own contract on Sepolia

Remember to create a `.env` file with the following content:
```shell
SEPOLIA_API_URL = "https://eth-sepolia.g.alchemy.com/v2/TBcmuWUU_TiijYWRaoNwlG49EtZsMyd4"
SEPOLIA_PRIVATE_KEY = 'THE-PRIVATE-KEY'
```
Next, run the following commands:
```shell
npm install
npx hardhat test
npx hardhat run scripts/deploy.ts --network sepolia
```
You will see a deployed message with the contract address. Copy the address and paste it in the `lotto.ts` file in the frontend folder.

Check the frontend readme to see how to run the frontend