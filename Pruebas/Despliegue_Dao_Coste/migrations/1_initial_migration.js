// eslint-disable-next-line no-undef
const electoralToken = artifacts.require('ElectoralToken');
const electoralManager = artifacts.require('ElectoralManager');
const governorContract = artifacts.require('GovernorContract');
const timeLock = artifacts.require('TimeLock');

module.exports = function (deployer) {
    deployer.deploy(electoralToken);
    deployer.deploy(electoralManager, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000");
    deployer.deploy(governorContract, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", 2, 2, 2, 2);
    deployer.deploy(timeLock, 2, [], [], "0x0000000000000000000000000000000000000000");
}