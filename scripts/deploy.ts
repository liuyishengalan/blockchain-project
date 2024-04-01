import { ethers } from "hardhat";

async function main() {
  // Fetch the contract factory
  const Lotto649 = await ethers.getContractFactory("Lotto649");

  // Sign and deploy the contract
  const lotto649 = await Lotto649.deploy();

  // Wait for the deployment to finish
  await lotto649.waitForDeployment();

  console.log("Lotto649 deployed to:", lotto649.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
