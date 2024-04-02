import dotenv from 'dotenv';
dotenv.config(); // Make sure this is at the top
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockConformations: 1,
      allowUnlimitedContractSize: true
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_API_URL || '',
      accounts:
        process.env.SEPOLIA_PRIVATE_KEY !== undefined
          ? [process.env.SEPOLIA_PRIVATE_KEY]
          : []
    }
  },
  namedAccounts:{
    deployer: {
      default: 0
    }
  }
};

export default config;
