//@ts-ignore
import * as fs from "fs";

import { JSON_DEPLOYMENT_ADDRESS } from "./helper-hardhat";

export async function storeAddressContract(
  contractName: string,
  address: string
) {
  let listAddress: any;

  if (fs.existsSync(JSON_DEPLOYMENT_ADDRESS)) {
    listAddress = JSON.parse(fs.readFileSync(JSON_DEPLOYMENT_ADDRESS, "utf8"));
  } else {
    listAddress = {};
    listAddress[contractName] = [];
  }
  // machacamos el valor por si ha cambiado con respecto al anterior
  listAddress[contractName][0] = address;
  fs.writeFileSync(
    JSON_DEPLOYMENT_ADDRESS,
    JSON.stringify(listAddress),
    "utf8"
  );
}
