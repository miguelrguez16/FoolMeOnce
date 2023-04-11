//@ts-ignore
import * as fs from "fs";

import { JSON_FILE_DEPLOYMENT_ADDRESS } from "./helper-constants";

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
