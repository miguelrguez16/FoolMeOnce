//@ts-ignore
import * as fs from "fs";

import { JSON_DEPLOYMENT_ADDRESS } from "./helper-hardhat";

export async function readAddressForDeployedContract(
  contractName: string
): Promise<string> {
  let listAddress: any;
  console.log("reading address for: ", contractName);
  if (fs.existsSync(JSON_DEPLOYMENT_ADDRESS)) {
    listAddress = JSON.parse(fs.readFileSync(JSON_DEPLOYMENT_ADDRESS, "utf8"));
    return listAddress[contractName][0];
  }

  return "";
}
