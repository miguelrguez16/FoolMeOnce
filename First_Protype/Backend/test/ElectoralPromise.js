const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("TestElectoralManager", function () {

  // address deploy contract
  let ElectoralManager;
  let electoralManager;
  // address fot interact
  let deployer;
  let addr1;
  let addr2;
  let addrs;
  let _tokenURI = 'sample uri for new electoral promise';

  // ERRORS MESSAGE
  const errorNewRegister = 'ElectoralManager author already exists';
  const errorAuthorNotExists = 'ElectoralManager author not exists';


  // Deploy contract
  beforeEach(async function () {
    ElectoralManager = await ethers.getContractFactory('ElectoralManager');
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
    electoralManager = await ElectoralManager.deploy();
    // console.log(`
    //      Deployer: [${deployer.address}]
    //      addr1: [${addr1.address}]
    //      addr2: [${addr2.address}]
    //  `);
  })

  describe("Deployment", function () {
    it('should track name, symbol and baseUri of the ElectoralManager, and other state', async function () {
      const nameContract = 'FoolMeOnce';
      const symbolContract = 'FMO';
      const ipfsName = 'ipfs://';

      expect(await electoralManager.name()).to.equal(nameContract);
      expect(await electoralManager.symbol()).to.equal(symbolContract);
      expect(await electoralManager.baseURI()).to.equal(ipfsName);
      // check state values
      expect(await electoralManager.counterElectoralPromises()).to.equal(0);
      expect(await electoralManager.counterPromisers()).to.equal(1);
      // check empty electoral promise
      const allEP = await electoralManager.getAllPromises();
      expect(allEP.length).to.equal(0);

    });
  });

  describe("Register and test promiser", function () {
    it('should track the register of a person', async function () {
      const _completeName = "Juan Alberto Rodriguez";
      const _isPoliticalParty = false;
      const newIdentifier = 1;

      // write the first promiser
      await expect(electoralManager.connect(addr1)
        .registerUser(_completeName, _isPoliticalParty))
        .to.emit(electoralManager, 'NewPromiser');

      // on success try to put again
      await expect(electoralManager.connect(addr1)
        .registerUser(_completeName, _isPoliticalParty))
        .to.be.revertedWith(errorNewRegister);

      // on previous success check all data is registered in the correct position
      await expect(await electoralManager.connect(addr1).checkMyIdentifier()).to.equal(newIdentifier);

      const promiser = await electoralManager.listPromisers(addr1.address);

      expect(promiser.idAuthor).to.equal(newIdentifier);
      expect(promiser.completeName).to.equal(_completeName);
      expect(promiser.isPoliticalParty).to.equal(_isPoliticalParty);
      expect(await electoralManager.counterPromisers()).to.equal(2);


    });
  });


  describe("Register a new Electoral Promise", function () {
    it('should track the register of a new electoral promise without a login', async function () {
      const _isObligatory = false;
      const _relationalPromises = [];

      // first attempt -> expect a user not exists
      await expect(electoralManager.connect(addr1)
        .createElectoralPromise(_tokenURI, _isObligatory, _relationalPromises))
        .to.be.revertedWith(errorAuthorNotExists);

      expect(await electoralManager.balanceOf(addr1.address)).to.equal(0);

    });

    it('should track a correct register of a promise with a correct login', async function () {
      // basic information for an electoral promise
      const _isObligatory = false;
      const _relationalPromises = [];
      const _completeName = "Juan Alberto Rodriguez";
      const _isPoliticalParty = false;
      const _tokenId = 0;

      // first attempt
      await expect(electoralManager.connect(addr1)
        .registerUser(_completeName, _isPoliticalParty))
        .to.emit(electoralManager, 'NewPromiser');

      // second attempt
      await expect(electoralManager.connect(addr1)
        .createElectoralPromise(_tokenURI, _isObligatory, _relationalPromises))
        .to.emit(electoralManager, 'CreatedPromise')
        .withArgs(addr1.address, _tokenId);

      // expect to list increment
      expect(await electoralManager.counterElectoralPromises()).to.equal(1);

      const allEP = await electoralManager.getAllPromises();
      expect(allEP.length).to.equal(1);

      // expect all data is correct
      const electoralPromise = allEP[0];
      expect(electoralPromise.nameAuthor).to.equal(_completeName);
      expect(electoralPromise.idAuthor).to.equal(1);
      expect(electoralPromise.tokenUri).to.equal(_tokenURI);
      expect(electoralPromise.isObligatory).to.equal(false);
      expect(electoralPromise.relationalPromises.length).to.equal(0);
      expect(electoralPromise.isApproved).to.equal(false);

      // expect basic information to be okey
      expect(await electoralManager.tokenURI(_tokenId)).to.equal('ipfs://' + _tokenURI);
      expect(await electoralManager.ownerOf(_tokenId)).to.equal(addr1.address);
      expect(await electoralManager.balanceOf(addr1.address)).to.equal(1);

    });

  });


});
