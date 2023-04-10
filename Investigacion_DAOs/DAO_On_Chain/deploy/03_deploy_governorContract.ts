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
} from "../Utils/helper-hardhat";
import { readAddressForDeployedContract } from "../Utils/read-address";
import { storeAddressContract } from "../Utils/save-address";

// main function
export async function deployGovernorContract() {
  let deployer, addrs;
  [deployer, ...addrs] = await ethers.getSigners();

  // Governor Contract necesita:
  //1. Token de gobernanza <-- direccion
  //2. Contrato TimeLock <-- direccion
  //3. Parametros de configuracion
  // --> _votingDelay, _votingPeriod, _quorumPercentage,_proposalThreshold

  console.log("Reading deployment address");

  let electoralTokenAddress = await readAddressForDeployedContract(
    ELECTORAL_TOKEN
  );

  const electoralToken = await ethers.getContractAt(
    ELECTORAL_TOKEN,
    electoralTokenAddress
  );

  let timeLockAddress = await readAddressForDeployedContract(TIME_LOCK);

  const timeLock = await ethers.getContractAt(TIME_LOCK, timeLockAddress);

  console.log(`
    electoral Token address = [${electoralToken.address}]
    timeLock contract address = [${timeLock.address}]
  `);

  const GovernorContract = await ethers.getContractFactory(GOVERNOR_CONTRACT);
  const governorContract = await GovernorContract.deploy(
    electoralToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    PROPOSAL_THRESHOLD
  );

  await governorContract.deployed();

  console.log(`GovernorContract deployed at [${governorContract.address}]`);
  console.log(`GovernorContract address deployer at [${deployer.address}]`);

  storeAddressContract(GOVERNOR_CONTRACT, governorContract.address);
}

deployGovernorContract().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
