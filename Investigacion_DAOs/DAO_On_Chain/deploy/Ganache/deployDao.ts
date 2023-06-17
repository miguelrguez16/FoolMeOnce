//@ts-ignore
import { ethers } from "hardhat";

import { ADDRESS_GANACHE } from "../../Utils/helper-ganache-constants";

import {
  ELECTORAL_TOKEN,
  GOVERNOR_CONTRACT,
  TIME_LOCK,
  ELECTORAL_MANAGER,
} from "../../Utils/helper-constants";

import { Contract, ContractFactory } from "ethers";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import {
  checkBalance,
  deployAndConfigGovernorContract,
  deployElectoralManager,
  deployElectoralToken,
  deployTimeLock,
  printAddress,
  registerUser,
  saveMap,
} from "../../Utils/ganache-functions";
import { User } from "../../Utils/model/user-model";

const deployDaoGanache = async (debug: boolean) => {
  const contractsDeployed: Map<string, string> = new Map<string, string>();

  try {
    const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      ADDRESS_GANACHE
    );
    const accounts = await provider.listAccounts();
    console.log(`Cuenta -> ${accounts[0]}`);
    const account: string = accounts[0];

    const signer: JsonRpcSigner = await provider.getSigner(account);
    await signer.unlock("");
    //console.log("Cuenta desbloqueada correctamente");
    const balance = await provider.getBalance(account);
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
  } catch (error) {
    console.error("Error ", error);
  }
};

deployDaoGanache(false).catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
