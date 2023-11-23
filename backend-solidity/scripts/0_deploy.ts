const hre = require("hardhat");
const ethershardhat = hre.ethers;
const { expect, assert } = require("chai");

async function main() {

  const [deployer] = await ethershardhat.getSigners();

  console.log('Deploying contracts with the deployer address:', deployer.address);

  const MyERC20 = await ethershardhat.getContractFactory("MyERC20");
  const myERC20 = await MyERC20.deploy("euroNumerique", "EUR");
  await myERC20.waitForDeployment();
  console.log(`deployed euroNumerique at ${myERC20.target}`);

  const OnlineBank = await ethershardhat.getContractFactory("OnlineBank");
  const onlineBank = await OnlineBank.deploy(myERC20.target);
  await onlineBank.waitForDeployment();
  console.log(`deployed onlineBank at ${onlineBank.target}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
