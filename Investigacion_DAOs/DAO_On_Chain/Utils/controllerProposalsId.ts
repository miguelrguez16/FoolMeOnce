//@ts-ignore
import * as fs from "fs";

import { JSON_FILE_PROPOSALS_ID } from "./helper-constants";

export async function storeProposalId(proposalId: string) {
  console.log(`New Proposal saving -> ${proposalId}`);
  let listProposals: any;

  if (fs.existsSync(JSON_FILE_PROPOSALS_ID)) {
    listProposals = JSON.parse(fs.readFileSync(JSON_FILE_PROPOSALS_ID, "utf8"));
  } else {
    listProposals = {};
    listProposals["PropuestaElectoralManager"] = [];
  }
  // machacamos el valor por si ha cambiado con respecto al anterior
  listProposals["PropuestaElectoralManager"].push(proposalId);
  fs.writeFileSync(
    JSON_FILE_PROPOSALS_ID,
    JSON.stringify(listProposals),
    "utf8"
  );
}

export async function readLastProposalId() {
  let list: any;
  console.log("reading Last ProposalId");
  if (fs.existsSync(JSON_FILE_PROPOSALS_ID)) {
    list = JSON.parse(fs.readFileSync(JSON_FILE_PROPOSALS_ID, "utf8"));
  }

  const returnValue = list["PropuestaElectoralManager"].pop();
  console.log(returnValue);

  return returnValue;
}

readLastProposalId().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
