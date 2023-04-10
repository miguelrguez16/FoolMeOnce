//@ts-ignore
import { ethers } from "hardhat"; //@ts-ignore
import { ELECTORAL_TOKEN } from "../Utils/helper-hardhat";
import { storeAddressContract } from "../Utils/save-address";

async function deployElectoralToken() {
  const ElectoralToken = await ethers.getContractFactory(ELECTORAL_TOKEN);
  const electoralToken = await ElectoralToken.deploy();

  let deployer, addrs;
  [deployer, ...addrs] = await ethers.getSigners();
  await electoralToken.deployed();

  console.log(`Electoral Token deployed at [${electoralToken.address}]`);
  console.log(`ElectoralToken address deployer at [${deployer.address}]`);

  await delegate(electoralToken.address, deployer.address);

  storeAddressContract(ELECTORAL_TOKEN, electoralToken.address);
}

const delegate = async (
  electoralTokenAddress: string,
  delegateAccount: string
) => {
  const electoralToken = await ethers.getContractAt(
    "ElectoralToken",
    electoralTokenAddress
  );
  const tx = await electoralToken.delegate(delegateAccount);
  await tx.wait(1);
  console.log(
    `Checkpoints ${await electoralToken.numCheckpoints(delegateAccount)} `
  );
};

deployElectoralToken().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
