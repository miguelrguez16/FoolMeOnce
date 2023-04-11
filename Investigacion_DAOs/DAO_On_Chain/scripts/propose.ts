//@ts-ignore
import { ethers, network } from "hardhat";
import {
  ELECTORAL_MANAGER,
  FUNC_APPROVE_PROMISE,
  GOVERNOR_CONTRACT,
  VOTING_DELAY,
} from "../Utils/helper-constants";
import { readAddressForDeployedContract } from "../Utils/read-address";
import { moveBlocks } from "../Utils/move-blocks-forward";

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
  const _nombreFuncionLlamada = FUNC_APPROVE_PROMISE;
  const _identificadorPromesaElectoral = 0;
  const _descripcionPropuesta = "Quiero aprobar la propuesta";

  // CODIFICACION DE FUNCION QUE GOBIERNA LA DAO
  const encode = electoralManagerContract.interface.encodeFunctionData(
    _nombreFuncionLlamada,
    [_identificadorPromesaElectoral]
  );

  // ENVIO DE UNA PROPUESTA:
  const proposeTx = await governorContract.propose(
    [electoralManagerAddress],
    [0],
    [encode],
    _descripcionPropuesta
  );

  const proposeReceipt = await proposeTx.wait(1);

  await moveBlocks(VOTING_DELAY + 1);

  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log(`
    #################################
          proposeId:${proposalId}
    #################################
  `);
};

propose().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
