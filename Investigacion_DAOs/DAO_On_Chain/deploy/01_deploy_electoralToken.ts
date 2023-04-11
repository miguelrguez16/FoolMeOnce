//@ts-ignore
import { ethers } from "hardhat"; //@ts-ignore
import { ELECTORAL_TOKEN } from "../Utils/helper-constants";
import { storeAddressContract } from "../Utils/save-address";

export async function deployElectoralToken(debug: boolean) {
  const ElectoralToken = await ethers.getContractFactory(ELECTORAL_TOKEN);
  const electoralToken = await ElectoralToken.deploy();

  let deployer, addrs;
  [deployer, ...addrs] = await ethers.getSigners();
  await electoralToken.deployed();
  if (debug) {
    console.log(`Electoral Token deployed at [${electoralToken.address}]`);
    console.log(`ElectoralToken address deployer at [${deployer.address}]`);
  }

  await delegate(debug, electoralToken.address, deployer.address);

  await storeAddressContract(ELECTORAL_TOKEN, electoralToken.address);
}

const delegate = async (
  debug: boolean,
  electoralTokenAddress: string,
  delegateAccount: string
) => {
  const electoralToken = await ethers.getContractAt(
    "ElectoralToken",
    electoralTokenAddress
  );
  const tx = await electoralToken.delegate(delegateAccount);
  await tx.wait(1);
  if (debug) {
    console.log(
      `Checkpoints ${await electoralToken.numCheckpoints(delegateAccount)} `
    );
  }
};

deployElectoralToken(false).catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
