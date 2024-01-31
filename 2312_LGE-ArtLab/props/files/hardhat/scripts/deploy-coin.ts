import { ethers } from "hardhat";
// import { coinAbi } from "../artifacts/contracts/Coin.sol/Coin.json"

async function main() {
  const tokenName = "MonachainToken";
  const tokenSymbol = "MONA";
  const coinDeploy = await ethers.deployContract("Coin", [tokenName, tokenSymbol]);
  await coinDeploy.waitForDeployment();

  // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAddress = coinDeploy.target;

  console.log(
    `Coin token[${tokenName}(${tokenSymbol})] deployed to ${contractAddress}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
