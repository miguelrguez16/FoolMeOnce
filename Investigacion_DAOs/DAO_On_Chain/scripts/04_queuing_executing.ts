//@ts-ignore
import { ethers } from "hardhat";
import { readLastProposalId } from "../Utils/controllerProposalsId";
import { readAddressForDeployedContract } from "../Utils/manage-address-contracts";
import {
  DESCRIPCION_PROPUESTA,
  ELECTORAL_MANAGER,
  FUNC_APPROVE_PROMISE,
  GOVERNOR_CONTRACT,
  MIN_DELAY,
  PROPOSALSTATE,
  PROPOSAL_ID_FOR_APPROVE,
} from "../Utils/helper-constants";
import { moveBlocks, moveTime } from "../Utils/move-blocks-forward";

const queueAndExecute = async () => {
  const electoralManagerAddress = await readAddressForDeployedContract(
    ELECTORAL_MANAGER
  );
  const electoralManagerContract = await ethers.getContractAt(
    ELECTORAL_MANAGER,
    electoralManagerAddress
  );

  const governorContractAddress = await readAddressForDeployedContract(
    GOVERNOR_CONTRACT
  );

  const governorContract = await ethers.getContractAt(
    GOVERNOR_CONTRACT,
    governorContractAddress
  );

  const args = [PROPOSAL_ID_FOR_APPROVE];

  // CODIFICACION DE FUNCION QUE GOBIERNA LA DAO
  const encodeFunctionParameter =
    electoralManagerContract.interface.encodeFunctionData(
      FUNC_APPROVE_PROMISE,
      args
    );

  // Necesita descripcion hasheada
  // const descriptionHash = ethers.utils.formatBytes32String(
  //   DESCRIPCION_PROPUESTA
  // );
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(DESCRIPCION_PROPUESTA)
  );
  console.log(descriptionHash);

  const queueTxResponse = await governorContract.queue(
    [electoralManagerAddress],
    [0],
    [encodeFunctionParameter],
    descriptionHash
  );

  const proposalId: string = await readLastProposalId();

  let stateProposal = await governorContract.state(proposalId);
  console.log(
    `STATE proposal ${proposalId} is ${stateProposal} ${PROPOSALSTATE[stateProposal]}`
  );

  await moveTime(MIN_DELAY + 1);
  await moveBlocks(1);

  stateProposal = await governorContract.state(proposalId);
  console.log(`STATE proposal ${proposalId} is ${stateProposal}`);

  const executeTxResponse = await governorContract.execute(
    [electoralManagerAddress],
    [0],
    [encodeFunctionParameter],
    descriptionHash
  );

  await executeTxResponse.wait(1);

  /// Ahora se podría llamar a electoralManager para chequear si se actualizó de verdad

  const listElectoralPromise = await electoralManagerContract.getAllPromises();
  console.log(listElectoralPromise[0]);

  console.log(
    "Fecha de verificacion de la promesa: ",
    listElectoralPromise[0].dateApproved
  );
};

queueAndExecute().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
