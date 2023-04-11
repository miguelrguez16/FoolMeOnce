//@ts-ignore
import { ethers } from "hardhat"; //@ts-ignore
import { ELECTORAL_MANAGER, TIME_LOCK } from "../Utils/helper-constants";
import { storeAddressContract } from "../Utils/save-address";
import { readAddressForDeployedContract } from "../Utils/read-address";

export const deployElectoralManagerAccount = async (debug: false) => {
  let deployer, addrs;
  [deployer, ...addrs] = await ethers.getSigners();

  const ElectoralManager = await ethers.getContractFactory(ELECTORAL_MANAGER);
  const electoralManagerContract = await ElectoralManager.deploy(
    "ElectoralManager",
    "EM",
    "ipfs://"
  );
  if (debug) {
    console.log(
      `ElectoralManager deployed at [${electoralManagerContract.address}]`
    );
  }

  await storeAddressContract(
    ELECTORAL_MANAGER,
    electoralManagerContract.address
  );

  // transfer admin to timeLock
  const timeLockAddress: string = await readAddressForDeployedContract(
    TIME_LOCK
  );

  const transferAdmin = await electoralManagerContract.transferOwnership(
    timeLockAddress
  );
  await transferAdmin.wait(1);
};

deployElectoralManagerAccount(false).catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
