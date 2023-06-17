//@ts-ignore
import { ethers } from "hardhat"; //@ts-ignore
import { readAllAddress } from "../Utils/manage-address-contracts";
import { TIME_LOCK, ZERO_ADDRESS } from "../Utils/helper-constants";

export async function configureGovernorContract(debug: boolean) {
  let deployer;
  let addrs;
  [deployer, ...addrs] = await ethers.getSigners();

  // First get all address deployment
  let all = await readAllAddress();
  if (debug) {
    console.log(all);
  }

  const electoralTokenAddress: string = all.ElectoralToken[0];
  const timeLockAddress: string = all.TimeLock[0];
  const governorContractAddress: string = all.GovernorContract[0];
  if (debug) {
    console.log(`
  Despliegue:
      electoralTokenAddress:  ${electoralTokenAddress}
      timeLockAddress:  ${timeLockAddress}
      governorContractAddress:  ${governorContractAddress}
  `);
  }
  // second get the contracts
  const timeLockContract = await ethers.getContractAt(
    TIME_LOCK,
    timeLockAddress
  );

  // role from timeLock
  const executorRole: string = await timeLockContract.EXECUTOR_ROLE();
  const proposerRole: string = await timeLockContract.PROPOSER_ROLE();
  const adminRole: string = await timeLockContract.TIMELOCK_ADMIN_ROLE();
  // console.log(timeLockContract);
  if (debug) {
    console.log(`
  ROLE 
        executorRole:   ${executorRole},
        proposerRole:   ${proposerRole}, 
        adminRole:      ${adminRole}
  `);
  }

  // third set up roles
  //1. set proposer rol to contract governor
  const proposerGovernorTransaction = await timeLockContract.grantRole(
    proposerRole,
    governorContractAddress
  );

  await proposerGovernorTransaction.wait(1);

  //2. set all address can execute proposals
  const canExecuteAll = await timeLockContract.grantRole(
    executorRole,
    ZERO_ADDRESS
  );
  await canExecuteAll.wait(1);

  //3. Remove address deployer as adminRole
  const removeAdminRole = await timeLockContract.revokeRole(
    adminRole,
    deployer.address
  );

  await removeAdminRole.wait(1);
}

configureGovernorContract(false).catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
