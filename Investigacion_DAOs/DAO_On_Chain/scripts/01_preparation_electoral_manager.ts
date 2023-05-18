//@ts-ignore
import { ethers } from "hardhat";
import { ELECTORAL_MANAGER } from "../Utils/helper-constants";
import { readAddressForDeployedContract } from "../Utils/manage-address-contracts";

const prepare = async () => {
  let deployer, addr1, addrs;
  [deployer, addr1, ...addrs] = await ethers.getSigners();
  // Una vez desplegada la DAO, obtengo la dirección de electoralManager

  const electoralManagerAddress = await readAddressForDeployedContract(
    ELECTORAL_MANAGER
  );

  // obtengo contrato (abi)
  const electoralManagerContract = await ethers.getContractAt(
    ELECTORAL_MANAGER,
    electoralManagerAddress
  );

  // DATA USER
  const _completeName = "Miguel Rodríguez González";
  const _namePoliticalParty = "Partido por la Web3.0";
  const _isPoliticalParty = false;

  console.log(`Registrando usuario :
      create: ${_completeName}  
      _namePoliticalParty: ${_namePoliticalParty}  
      _isPoliticalParty: ${_isPoliticalParty}  
  `);

  const registerIdTx = await electoralManagerContract
    .connect(addr1)
    .registerUser(_completeName, _namePoliticalParty, _isPoliticalParty);

  const registerEndTx = registerIdTx.wait(1);
  console.log(registerEndTx);

  // DATA PROMISE
  const _tokenUri = "random uri";
  const _isObligatory = false;

  const createElectoralPromise = await electoralManagerContract
    .connect(addr1)
    .createElectoralPromise(_tokenUri, _isObligatory);

  const allElectoralPromise = await electoralManagerContract
    .connect(addr1)
    .getAllPromises();

  console.log(`Promise created:
      create: ${allElectoralPromise[0].created}  
      dateApproved: ${allElectoralPromise[0].dateApproved}  
      tokenUri: ${allElectoralPromise[0].tokenUri}  
      nameAuthor: ${allElectoralPromise[0].nameAuthor}  
      namePoliticalParty: ${allElectoralPromise[0].namePoliticalParty}  
  `);
};

prepare().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
