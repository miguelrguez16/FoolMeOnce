const {expect} = require('chai');
const {ethers} = require('hardhat');

describe("TestElectoralManager", function () {

  // address deploy contract
  let ElectoralManager;
  let electoralManager;
  // address fot interact
  let deployer;
  let addr1;
  let addr2;
  let addrs;
  let URI = 'sample uri for new electoral promise';

  // Deploy contract
  beforeEach(async function () {
    ElectoralManager = await ethers.getContractFactory('ElectoralManager');
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
    electoralManager = await ElectoralManager.deploy();
    console.log(`
         Deployer: [${deployer.address}]
         addr1: [${addr1.address}]
         addr2: [${addr2.address}]
     `)
  })

  describe("Deployment", function () {
    it('should track name, symbol and baseUri of the ElectoralManager', async function () {
      const nameContract = 'FoolMeOnce';
      const symbolContract = 'FMO';
      const ipfsName = 'ipfs://';
      expect(await electoralManager.name()).to.equal(nameContract);
      expect(await electoralManager.symbol()).to.equal(symbolContract);
      expect(await electoralManager.baseURI()).to.equal(ipfsName);
    });

  });


});
