//@ts-ignore
import { ethers } from "hardhat";

import {
  ADDRESS_GANACHE,
  URI_ONE,
  URI_TWO,
} from "../../Utils/helper-ganache-constants";

import {
  ELECTORAL_TOKEN,
  GOVERNOR_CONTRACT,
  TIME_LOCK,
  ELECTORAL_MANAGER,
} from "../../Utils/helper-constants";

import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import {
  checkBalance,
  createPromise,
  deployAndConfigGovernorContract,
  deployElectoralManager,
  deployElectoralToken,
  deployTimeLock,
  printAddress,
  registerUser,
  saveMap,
} from "../../Utils/ganache-functions";
import { User } from "../../Utils/model/user-model";
import { Contract } from "ethers";

const deployDaoGanache = async (debug: boolean) => {
  const contractsDeployed: Map<string, string> = new Map<string, string>();

  try {
    const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      ADDRESS_GANACHE
    );
    const accounts = await provider.listAccounts();
    console.log(`Cuenta -> ${accounts[0]}`);
    const account: string = accounts[0];

    const signer: JsonRpcSigner = provider.getSigner(account);
    await signer.unlock("");

    await checkBalance(account, provider);

    const electoralTokenAddress: string = await Promise.resolve(
      deployElectoralToken(debug, signer)
    );
    await checkBalance(account, provider);
    contractsDeployed.set(ELECTORAL_TOKEN, electoralTokenAddress);

    const timeLockAddress: string = await Promise.resolve(
      deployTimeLock(debug, signer)
    );
    await checkBalance(account, provider);
    contractsDeployed.set(TIME_LOCK, timeLockAddress);

    const governorContractAddress: string = await Promise.resolve(
      deployAndConfigGovernorContract(
        debug,
        electoralTokenAddress,
        timeLockAddress,
        signer
      )
    );
    await checkBalance(account, provider);
    contractsDeployed.set(GOVERNOR_CONTRACT, governorContractAddress);

    const electoralManagerAddress: string = await Promise.resolve(
      deployElectoralManager(debug, timeLockAddress, signer)
    );
    await checkBalance(account, provider);
    contractsDeployed.set(ELECTORAL_MANAGER, electoralManagerAddress);
    printAddress(contractsDeployed);
    saveMap(contractsDeployed);

    //? Prepare Electoral Manager
    const electoralManager: Contract = await ethers.getContractAt(
      ELECTORAL_MANAGER,
      electoralManagerAddress
    );
    const user: User = {
      id: 1,
      name: "Miguel Rodriguez",
      politicalParty: "Partido por la BlockChain",
      isPolitical: true,
    };
    // //? Register user
    await registerUser(debug, signer, user, electoralManager);

    await createPromise(debug, signer, electoralManager, URI_ONE);
    await createPromise(debug, signer, electoralManager, URI_TWO);
  } catch (error) {
    console.error("Error ", error);
  }
};

deployDaoGanache(true).catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
