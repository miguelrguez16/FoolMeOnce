const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const ElectoralManager = await ethers.getContractFactory('ElectoralManager');
    const electoralManager = await ElectoralManager.deploy("FoolMeOnce", "FMO", "ipfs://");

    // save the abi copy and address for the front
    saveFrontendFiles(electoralManager, "ElectoralManager");
}

function saveFrontendFiles(contract, name) {
    const fs = require("fs");
    const contractsDirFront = __dirname + "/../../Frontend/fool-me-once/src/contractsData";
    const contractsDirDao = __dirname + "/../../../Investigacion_DAOs/DAO_On_Chain/scripts/ganache/electoralManagerData"


    const directories = [contractsDirFront, contractsDirDao];

    directories.forEach(directory => {
        console.log("creating in ", directory);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }

        fs.writeFileSync(
            directory + `/${name}-address.json`,
            JSON.stringify({ address: contract.address }, undefined, 2)
        );

        const contractArtifact = artifacts.readArtifactSync(name);

        fs.writeFileSync(
            directory + `/${name}.json`,
            JSON.stringify(contractArtifact, null, 2)
        );
    });


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});