//@ts-ignore
import { ethers } from "hardhat"; //@ts-ignore
import { MIN_DELAY, TIME_LOCK } from "../Utils/helper-hardhat";
import { storeAddressContract } from "../Utils/save-address";

export async function deployTimeLock() {
  let deployer, addrs;
  [deployer, ...addrs] = await ethers.getSigners();
  const TimeLock = await ethers.getContractFactory(TIME_LOCK);
  const timeLock = await TimeLock.deploy(MIN_DELAY, [], [], deployer.address);

  await timeLock.deployed();

  console.log(`TimeLock contract deployed at [${timeLock.address}]`);
  console.log(`TimeLock address deployer at [${deployer.address}]`);

  storeAddressContract(TIME_LOCK, timeLock.address);
}

deployTimeLock().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
