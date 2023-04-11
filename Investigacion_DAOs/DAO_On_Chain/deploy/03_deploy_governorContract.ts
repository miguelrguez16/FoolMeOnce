//@ts-ignore
import { ethers } from "hardhat"; //@ts-ignore
import {
  ELECTORAL_TOKEN,
  TIME_LOCK,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  PROPOSAL_THRESHOLD,
  GOVERNOR_CONTRACT,
} from "../Utils/helper-constants";
import { readAddressForDeployedContract } from "../Utils/read-address";
import { storeAddressContract } from "../Utils/save-address";

// main function
export async function deployGovernorContract(debug: boolean) {
  let deployer, addrs;
  [deployer, ...addrs] = await ethers.getSigners();

  // Governor Contract necesita:
  //1. Token de gobernanza <-- direccion
  //2. Contrato TimeLock <-- direccion
  //3. Parametros de configuracion
  // --> _votingDelay, _votingPeriod, _quorumPercentage,_proposalThreshold

  let electoralTokenAddress = await readAddressForDeployedContract(
    ELECTORAL_TOKEN
  );

  const electoralToken = await ethers.getContractAt(
    ELECTORAL_TOKEN,
    electoralTokenAddress
  );

  let timeLockAddress = await readAddressForDeployedContract(TIME_LOCK);

  if (debug) {
    console.log(`
    electoral Token address = [${electoralTokenAddress}]
    timeLock contract address = [${timeLockAddress}]
  `);
  }
  const GovernorContract = await ethers.getContractFactory(GOVERNOR_CONTRACT);
  const governorContract = await GovernorContract.deploy(
    electoralTokenAddress,
    timeLockAddress,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    PROPOSAL_THRESHOLD
  );

  await governorContract.deployed();
  if (debug) {
    console.log(`GovernorContract deployed at [${governorContract.address}]`);
    console.log(`GovernorContract address deployer at [${deployer.address}]`);
  }
  await storeAddressContract(GOVERNOR_CONTRACT, governorContract.address);
}

deployGovernorContract(false).catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
