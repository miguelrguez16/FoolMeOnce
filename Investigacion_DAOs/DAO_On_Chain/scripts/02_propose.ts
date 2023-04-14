//@ts-ignore
import { ethers } from "hardhat";
import {
  DESCRIPCION_PROPUESTA,
  ELECTORAL_MANAGER,
  FUNC_APPROVE_PROMISE,
  GOVERNOR_CONTRACT,
  PROPOSAL_ID_FOR_APPROVE,
  VOTING_DELAY,
} from "../Utils/helper-constants";
import { readAddressForDeployedContract } from "../Utils/manage-address-contracts";
import { moveBlocks } from "../Utils/move-blocks-forward";
import { storeProposalId } from "../Utils/controllerProposalsId";

const propose = async () => {
  let deployer, addr1, addrs;
  [deployer, addr1, ...addrs] = await ethers.getSigners();

  const electoralManagerAddress = await readAddressForDeployedContract(
    ELECTORAL_MANAGER
  );

  const governorContractAddress = await readAddressForDeployedContract(
    GOVERNOR_CONTRACT
  );

  // obtengo contrato (abi)
  const electoralManagerContract = await ethers.getContractAt(
    ELECTORAL_MANAGER,
    electoralManagerAddress
  );

  const governorContract = await ethers.getContractAt(
    GOVERNOR_CONTRACT,
    governorContractAddress
  );

  // DATOS PROPUESTA:
  // FUNC_APPROVE_PROMISE;
  //PROPOSAL_ID_FOR_APPROVE
  //DESCRIPCION_PROPUESTA

  // CODIFICACION DE FUNCION QUE GOBIERNA LA DAO
  const encodeFunctionParameter =
    electoralManagerContract.interface.encodeFunctionData(
      FUNC_APPROVE_PROMISE,
      [PROPOSAL_ID_FOR_APPROVE]
    );

  // ENVIO DE UNA PROPUESTA:
  const proposeTxResponse = await governorContract.propose(
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

  await storeProposalId(proposalId.toString());
};

propose().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
