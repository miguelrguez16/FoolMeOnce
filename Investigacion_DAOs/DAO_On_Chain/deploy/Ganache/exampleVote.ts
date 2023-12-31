//@ts-ignore
import { ethers } from "hardhat";
import fs from "fs";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import {
  ADDRESS_GANACHE,
  URI_ONE,
  URI_TWO,
} from "../../Utils/helper-ganache-constants";
import { User } from "../../Utils/model/user-model";
import {
  ELECTORAL_MANAGER,
  GOVERNOR_CONTRACT,
} from "../../Utils/helper-constants";
import { Contract } from "ethers";
import {
  checkBalance,
  createPromise,
  createPropose,
  registerUser,
  votePeriod,
  queryAndExecutePeriod,
} from "../../Utils/ganache-functions";
import { moveBlocks } from "../../Utils/move-blocks-forward";

const exampleVote = async (debug: boolean) => {
  const myMap: Map<string, string> = new Map<string, string>(readAddress());
  console.log("#\treading address");
  console.table(myMap);

  try {
    const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      ADDRESS_GANACHE
    );
    const accounts = await provider.listAccounts();
    if (debug) {
      console.log(`#\tCuenta -> ${accounts[0]}`);
    }
    const account: string = accounts[0];
    const signer: JsonRpcSigner = provider.getSigner(account);

    await signer.unlock("");
    if (debug) {
      console.log("#\tCuenta desbloqueada correctamente");
    }
    await checkBalance(account, provider);

    const electoralManagerAddress: string = String(
      myMap.get(ELECTORAL_MANAGER)
    );

    const governorContractAddress: string = String(
      myMap.get(GOVERNOR_CONTRACT)
    );

    const electoralManager: Contract = await ethers.getContractAt(
      ELECTORAL_MANAGER,
      electoralManagerAddress
    );
    const governorContract: Contract = await ethers.getContractAt(
      GOVERNOR_CONTRACT,
      governorContractAddress
    );

    // //? Generate proposal

    const proposalId = await Promise.resolve(
      createPropose(
        debug,
        signer,
        governorContract,
        electoralManager,
        electoralManagerAddress
      )
    );

    await votePeriod(debug, governorContract, signer, proposalId);

    await queryAndExecutePeriod(
      debug,
      governorContract,
      electoralManager,
      electoralManagerAddress,
      signer,
      proposalId
    );
    await moveBlocks(5);

    const listElectoralPromise = await electoralManager
      .connect(signer)
      .getAllPromises();
    console.log(listElectoralPromise);

    await checkBalance(account, provider);
  } catch (error) {
    console.error(error);
  }
};

const readAddress = (): Map<string, string> => {
  const jsonData = fs.readFileSync("mapData.json", "utf-8");

  if (!jsonData) {
    return new Map<string, string>();
  }

  const myMap = new Map<string, string>(Object.entries(JSON.parse(jsonData)));

  return myMap;
};

exampleVote(true).catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
