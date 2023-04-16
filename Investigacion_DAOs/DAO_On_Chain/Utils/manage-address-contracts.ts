//@ts-ignore
import * as fs from "fs";

import { JSON_FILE_DEPLOYMENT_ADDRESS } from "./helper-constants";

/**
 * Read an address from file
 * @param contractName the contract name
 * @returns address of the contract name
 */
export async function readAddressForDeployedContract(
  contractName: string
): Promise<string> {
  let listAddress: any;
  console.log("reading address for: ", contractName);
  if (fs.existsSync(JSON_FILE_DEPLOYMENT_ADDRESS)) {
    listAddress = JSON.parse(
      fs.readFileSync(JSON_FILE_DEPLOYMENT_ADDRESS, "utf8")
    );
    return listAddress[contractName][0];
  }

  return "";
}

/**
 *
 * @returns
 */
export async function readAllAddress(): Promise<any> {
  let list: any;
  console.log("reading all address");
  if (fs.existsSync(JSON_FILE_DEPLOYMENT_ADDRESS)) {
    list = JSON.parse(fs.readFileSync(JSON_FILE_DEPLOYMENT_ADDRESS, "utf8"));
  }
  return list;
}

/**
 * Save the address un a file
 * @param contractName
 * @param address
 */
export async function storeAddressContract(
  contractName: string,
  address: string
) {
  console.log(`Saving address -> ${contractName} ${address}`);
  let listAddress: any;

  if (fs.existsSync(JSON_FILE_DEPLOYMENT_ADDRESS)) {
    listAddress = JSON.parse(
      fs.readFileSync(JSON_FILE_DEPLOYMENT_ADDRESS, "utf8")
    );
  } else {
    listAddress = {};
    listAddress[contractName] = [];
  }
  // machacamos el valor por si ha cambiado con respecto al anterior
  listAddress[contractName][0] = address;
  fs.writeFileSync(
    JSON_FILE_DEPLOYMENT_ADDRESS,
    JSON.stringify(listAddress),
    "utf8"
  );
}
