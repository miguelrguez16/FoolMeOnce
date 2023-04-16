//@ts-ignore
import { ethers } from "hardhat"; //@ts-ignore
import { MIN_DELAY, TIME_LOCK } from "../Utils/helper-constants";
import { storeAddressContract } from "../Utils/manage-address-contracts";
export async function deployTimeLock(debug: boolean) {
  let deployer, addrs;
  [deployer, ...addrs] = await ethers.getSigners();
  const TimeLock = await ethers.getContractFactory(TIME_LOCK);
  const timeLock = await TimeLock.deploy(MIN_DELAY, [], [], deployer.address);

  await timeLock.deployed();
  if (debug) {
    console.log(`TimeLock contract deployed at [${timeLock.address}]`);
    console.log(`TimeLock address deployer at [${deployer.address}]`);
  }

  await storeAddressContract(TIME_LOCK, timeLock.address);
}

deployTimeLock(false).catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
