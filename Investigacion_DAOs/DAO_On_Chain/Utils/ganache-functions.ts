import { ethers } from "hardhat";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Contract, ContractFactory } from "ethers";
import { User } from "./model/user-model";
import fs from "fs";
import {
  ZERO_ADDRESS,
  ELECTORAL_TOKEN,
  GOVERNOR_CONTRACT,
  MIN_DELAY,
  PROPOSAL_THRESHOLD,
  QUORUM_PERCENTAGE,
  TIME_LOCK,
  VOTING_DELAY,
  VOTING_PERIOD,
  ELECTORAL_MANAGER,
  FUNC_APPROVE_PROMISE,
  PROPOSAL_ID_FOR_APPROVE,
  DESCRIPCION_PROPUESTA,
  FOR,
  PROPOSALSTATE,
} from "./helper-constants";
import { moveBlocks, moveTime } from "./move-blocks-forward";

export const checkBalance = async (
  account: string,
  provider: JsonRpcProvider
) => {
  try {
    console.log(
      `Saldo ${account} --> ${ethers.utils.formatEther(
        await provider.getBalance(account)
      )} ethers`
    );
  } catch (error) {
    console.error(error);
  }
};

export const registerUser = async (
  debug: boolean,
  signer: JsonRpcSigner,
  user: User,
  electoralManager: Contract
) => {
  const registerIdTx = await electoralManager
    .connect(signer)
    .registerUser(user.name, user.politicalParty, user.isPolitical);

  const registerEndTx = await registerIdTx.wait(1);
  if (debug) {
    console.log("Registro correcto", registerEndTx);
  }
};

export const createPromise = async (
  debug: boolean,
  signer: JsonRpcSigner,
  electoralManager: Contract,
  URI: string
) => {
  const registerTx = await electoralManager
    .connect(signer)
    .createElectoralPromise(URI, true);

  await registerTx.wait(1);
  if (debug) {
    console.log("Registro de promesa realizado ", URI);
  }
};

export const createPropose = async (
  debug: boolean,
  signer: JsonRpcSigner,
  governorContract: Contract,
  electoralManager: Contract,
  electoralManagerAddress: string
): Promise<string> => {
  const encodeFunctionParameter = electoralManager.interface.encodeFunctionData(
    FUNC_APPROVE_PROMISE,
    [PROPOSAL_ID_FOR_APPROVE]
  );

  // ENVIO DE UNA PROPUESTA:
  const proposeTxResponse = await governorContract
    .connect(signer)
    .propose(
      [electoralManagerAddress],
      [0],
      [encodeFunctionParameter],
      DESCRIPCION_PROPUESTA
    );

  const proposeReceipt = await proposeTxResponse.wait(1);

  await moveBlocks(VOTING_DELAY + 1);

  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log(`
    #################################
          proposeId:${proposalId}
    #################################
  `);

  return proposalId;
};

export const queryAndExecutePeriod = async (
  debug: boolean,
  governorContract: Contract,
  electoralManager: Contract,
  electoralManagerAddress: string,
  signer: JsonRpcSigner,
  proposalId: string
) => {
  const args = [PROPOSAL_ID_FOR_APPROVE];

  // CODIFICACION DE FUNCION QUE GOBIERNA LA DAO
  const encodeFunctionParameter = electoralManager.interface.encodeFunctionData(
    FUNC_APPROVE_PROMISE,
    args
  );
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(DESCRIPCION_PROPUESTA)
  );
  const queueTxResponse = await governorContract
    .connect(signer)
    .queue(
      [electoralManagerAddress],
      [0],
      [encodeFunctionParameter],
      descriptionHash
    );

  let stateProposal = await governorContract.connect(signer).state(proposalId);
  console.log(
    `STATE proposal ${proposalId} is ${stateProposal} ${PROPOSALSTATE[stateProposal]}`
  );

  await moveTime(MIN_DELAY + 1);
  await moveBlocks(1);

  stateProposal = await governorContract.connect(signer).state(proposalId);
  console.log(`STATE proposal ${proposalId} is ${stateProposal}`);

  const executeTxResponse = await governorContract
    .connect(signer)
    .execute(
      [electoralManagerAddress],
      [0],
      [encodeFunctionParameter],
      descriptionHash
    );

  await executeTxResponse.wait(1);
};

export const votePeriod = async (
  debug: boolean,
  governorContract: Contract,
  signer: JsonRpcSigner,
  proposalId: string
) => {
  const voteTxResponse = await governorContract
    .connect(signer)
    .castVoteWithReason(
      proposalId,
      FOR, // A FAVOR
      "reasonVote"
    );

  await voteTxResponse.wait(1);

  await moveBlocks(VOTING_PERIOD + 1);

  const stateProposal = await governorContract
    .connect(signer)
    .state(proposalId);
  console.log(`STATE proposal ${proposalId} is ${stateProposal}`);
};

export const printAddress = (map: Map<string, string>) => {
  for (const [key, value] of map) {
    console.log(`${key},\tDirección: ${value}`);
  }
};

export const saveMap = (map: Map<string, string>) => {
  const obj = Object.fromEntries(map.entries());

  // Convertir el objeto en una cadena JSON
  const json = JSON.stringify(obj, null, 2);

  // Guardar la cadena JSON en un archivo
  fs.writeFileSync("mapData.json", json);
};

export const deployElectoralToken = async (
  debug: boolean,
  delegateAccount: JsonRpcSigner
): Promise<string> => {
  const delegateAddress: string = delegateAccount._address;
  const ElectoralToken = await ethers.getContractFactory(ELECTORAL_TOKEN);
  const electoralToken = await ElectoralToken.connect(delegateAccount).deploy();
  await electoralToken.deployed();

  const address: string = electoralToken.address;
  if (debug) {
    console.log(`Electoral Token deployed at [${address}]`);
  }
  const tx = await electoralToken
    .connect(delegateAccount)
    .delegate(delegateAddress);
  await tx.wait(1);

  if (debug) {
    console.log(
      `Checkpoints ${await electoralToken.numCheckpoints(delegateAddress)} `
    );
  }

  return address;
};

export const deployTimeLock = async (
  debug: boolean,
  delegateAccount: JsonRpcSigner
): Promise<string> => {
  const delegateAddress: string = delegateAccount._address;

  const TimeLock = await ethers.getContractFactory(TIME_LOCK);
  const timeLock = await TimeLock.connect(delegateAccount).deploy(
    MIN_DELAY,
    [],
    [],
    delegateAddress
  );
  await timeLock.deployed();
  if (debug) {
    console.log(`TimeLock deployed at [${timeLock.address}]`);
  }

  const address: string = timeLock.address;

  return address;
};

export const deployAndConfigGovernorContract = async (
  debug: boolean,
  electoralTokenAddress: string,
  timeLockAddress: string,
  signer: JsonRpcSigner
): Promise<string> => {
  const addressSigner: string = signer._address;

  const GovernorContract: ContractFactory = await ethers.getContractFactory(
    GOVERNOR_CONTRACT
  );
  const governorContract = await GovernorContract.connect(signer).deploy(
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
  }

  const timeLockContract = await ethers.getContractAt(
    TIME_LOCK,
    timeLockAddress
  );

  // role from timeLock
  const executorRole: string = await timeLockContract.EXECUTOR_ROLE();
  const proposerRole: string = await timeLockContract.PROPOSER_ROLE();
  const adminRole: string = await timeLockContract.TIMELOCK_ADMIN_ROLE();

  //1. set proposer rol to contract governor
  const proposerGovernorTransaction = await timeLockContract
    .connect(signer)
    .grantRole(proposerRole, governorContract.address);
  await proposerGovernorTransaction.wait(1);

  //2. set all address can execute proposals
  const canExecuteAll = await timeLockContract
    .connect(signer)
    .grantRole(executorRole, ZERO_ADDRESS);
  await canExecuteAll.wait(1);

  //3. Remove address deployer as adminRole
  const removeAdminRole = await timeLockContract
    .connect(signer)
    .revokeRole(adminRole, addressSigner);

  await removeAdminRole.wait(1);
  if (debug) {
    console.log("GovernorContract - Completed");
  }
  return governorContract.address;
};

export const deployElectoralManager = async (
  debug: boolean,
  timeLockAddress: string,
  signer: JsonRpcSigner
): Promise<string> => {
  const ElectoralManager = await ethers.getContractFactory(ELECTORAL_MANAGER);
  const electoralManager = await ElectoralManager.connect(signer).deploy(
    "FoolMeOnce",
    "FMO",
    "ipfs://"
  );

  await electoralManager.deployed();
  if (debug) {
    console.log(`ElectoralManager deployed at [${electoralManager.address}]`);
  }

  const transferAdmin = await electoralManager
    .connect(signer)
    .transferOwnership(timeLockAddress);
  await transferAdmin.wait(1);

  return electoralManager.address;
};
