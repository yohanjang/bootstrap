// import { ethers } from "hardhat";
const { Web3 } = require("web3");

async function main() {
  const fs = require("fs");
  const { abi, bytecode } = JSON.parse(fs.readFileSync("./artifacts/contracts/SimpleStorage.sol/SimpleStorage.json"));
  const network = "hyperledger-besu";
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `http://localhost:8545`,
    ),
  );
  const signer = web3.eth.accounts.privateKeyToAccount(
    '0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
  );
  web3.eth.accounts.wallet.add(signer);

  const contract = new web3.eth.Contract(abi);
  // contract.options.data = bytecode;
  // let args:string[] = ["50"];
  // contract.options.arguments = args;
  const deployTx = contract.deploy({
    data: bytecode,
    arguments: [50]
  });
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: await deployTx.estimateGas(),
    })
    .once("transactionHash", (txhash: any) => {
      console.log(`Mining deployment transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
  // The contract is now deployed on chain!
  console.log(`Contract deployed at ${deployedContract.options.address}`);
  console.log(
    `Add DEMO_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
