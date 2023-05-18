//@ts-ignore
import { expect } from "chai"; //@ts-ignore
import { ethers, network } from "hardhat";
import { ElectoralManager } from "../typechain-types"; //@ts-ignore
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

//@ts-ignore
describe("ElectoralManager", function () {
  // contrat for deploy
  let ElectoralManager;
  let electoralManager: ElectoralManager;

  // constructor data
  const _name: string = "FoolMeOnce";
  const _symbol: string = "FMO";
  const _baseUri: string = "ipfs://";
  const _secondsLegislature: number = 126144000;

  // address manage
  let deployer: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  // ERRORS MESSAGE
  const _errorNewRegister = "Error: ElectoralManager author already exists";
  const _errorAuthorNotExists = "Error: ElectoralManager author not exists";
  const _errorApprovePromiseNotExists: string =
    "Error: electoral promise do not exists";
  const _errorApprovePromiseLegislatureGone =
    "Error: a legislature already gone";

  const _errorNotTheOwner = "Ownable: caller is not the owner";

  // BASIC INFO FOR REGISTER
  const _completeName1 = "Juan Alberto Rodriguez";
  const _namePoliticalParty1 = "Partido Por La BlockChain";
  const _isPoliticalParty = false;
  const _newIdentifierOne = 1;
  const _isNotObligatory = false;
  const _isNotPoliticalParty = false;

  /** #######################################################################
   *          DEPLOY SMART CONTRACT ELECTORAL MANAGER
   * #######################################################################
   */

  //@ts-ignore
  beforeEach(async () => {
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
    ElectoralManager = await ethers.getContractFactory("ElectoralManager");
    electoralManager = await ElectoralManager.deploy(_name, _symbol, _baseUri);
  });

  /** #######################################################################
   *          TEST BASIC INFO ELECTORAL MANAGER
   * #######################################################################
   */

  //@ts-ignore
  describe("Deployment", function () {
    //@ts-ignore
    it("should track name, symbol and baseUri of the ElectoralManager, and other state variable", async function () {
      expect(await electoralManager.name()).to.equal(_name);
      expect(await electoralManager.symbol()).to.equal(_symbol);
      expect(await electoralManager.baseURI()).to.equal(_baseUri);
      expect(await electoralManager.SECONDS_LEGISLATURE()).to.equal(
        _secondsLegislature
      );
      // check state values
      expect(await electoralManager.counterElectoralPromises()).to.equal(0);
      expect(await electoralManager.counterPromisers()).to.equal(1);
      // check empty electoral promise
      const allEP = await electoralManager.getAllPromises();
      expect(allEP.length).to.equal(0);
    });
  });

  /** #######################################################################
   *          TEST REGISTER AND TEST PROMISER
   * #######################################################################
   */

  //@ts-ignore
  describe("Register and test promiser", function () {
    //@ts-ignore
    it("should track the register of a person", async function () {
      // write the first promiser
      await expect(
        electoralManager
          .connect(addr1)
          .registerUser(_completeName1, _namePoliticalParty1, _isPoliticalParty)
      ).to.emit(electoralManager, "NewPromiser");

      // on success try to put again
      await expect(
        electoralManager
          .connect(addr1)
          .registerUser(_completeName1, _namePoliticalParty1, _isPoliticalParty)
      ).to.be.revertedWith(_errorNewRegister);

      // on previous success check all data is registered in the correct position
      await expect(
        await electoralManager.connect(addr1).checkMyIdentifier()
      ).to.equal(_newIdentifierOne);

      const promiser = await electoralManager.listPromisers(addr1.address);

      expect(promiser.idAuthor).to.equal(_newIdentifierOne);
      expect(promiser.completeName).to.equal(_completeName1);
      expect(promiser.isPoliticalParty).to.equal(_isPoliticalParty);
      expect(await electoralManager.counterPromisers()).to.equal(2);
    });
  });

  /** #######################################################################
   *          TEST REGISTER A NEW ELECTORAL PROMISE
   * #######################################################################
   */

  //@ts-ignore
  describe("Register a new Electoral Promise", function () {
    //@ts-ignore
    it("should track the register of a new electoral promise without a login", async function () {
      const _isObligatory = false;
      const _tokenUriPromise: Promise<string> = Promise.resolve(_baseUri);
      // first attempt -> expect a user not exists
      await expect(
        electoralManager
          .connect(addr1)
          .createElectoralPromise(_tokenUriPromise, _isObligatory)
      ).to.be.revertedWith(_errorAuthorNotExists);

      expect(await electoralManager.balanceOf(addr1.address)).to.equal(0);
      expect(
        await electoralManager.connect(addr1).checkMyIdentifier()
      ).to.equal(0);
    });
    //@ts-ignore
    it("should track a correct register of a promise with a correct login", async function () {
      // basic information for an electoral promise
      const _tokenId = 0;
      const _idAuthor = 1;

      // first attempt to register a new user
      await expect(
        electoralManager
          .connect(addr1)
          .registerUser(
            _completeName1,
            _namePoliticalParty1,
            _isNotPoliticalParty
          )
      ).to.emit(electoralManager, "NewPromiser");

      await expect(
        await electoralManager.connect(addr1).checkMyIdentifier()
      ).to.equal(_idAuthor);

      // second attempt
      await expect(
        electoralManager
          .connect(addr1)
          .createElectoralPromise(_baseUri, _isNotObligatory)
      )
        .to.emit(electoralManager, "CreatedPromise")
        .withArgs(addr1.address, _tokenId);

      // expect to list increment
      expect(await electoralManager.counterElectoralPromises()).to.equal(1);

      const allEP = await electoralManager.getAllPromises();
      expect(allEP.length).to.equal(1);

      // expect all data is correct
      const electoralPromise = allEP[0];

      expect(electoralPromise.id).to.equal(_tokenId);
      expect(electoralPromise.nameAuthor).to.equal(_completeName1);
      expect(electoralPromise.namePoliticalParty).to.equal(
        _namePoliticalParty1
      );
      expect(electoralPromise.idAuthor).to.equal(_idAuthor);
      expect(electoralPromise.created).to.lt(Date.now()); // Timestamp
      expect(electoralPromise.dateApproved).to.equal(0);
      expect(electoralPromise.tokenUri).to.equal(_baseUri);
      expect(electoralPromise.isObligatory).to.equal(_isNotObligatory);

      // expect basic information to be correct
      expect(await electoralManager.tokenURI(_tokenId)).to.equal(
        "ipfs://" + _baseUri
      );
      expect(await electoralManager.ownerOf(_tokenId)).to.equal(addr1.address);
      expect(await electoralManager.balanceOf(addr1.address)).to.equal(1);
    });
  });

  /** #######################################################################
   *          TEST VERIFY AN ELECTORAL PROMISE
   * #######################################################################
   */

  //@ts-ignore
  describe("Register new promise and verified it", function () {
    //@ts-ignore
    beforeEach(async () => {
      // BASIC PROCEDURE TO CREATE A PROMISE
      const _tokenId = 0;

      // register a promiser on success
      await expect(
        electoralManager
          .connect(addr1)
          .registerUser(
            _completeName1,
            _namePoliticalParty1,
            _isNotPoliticalParty
          )
      ).to.emit(electoralManager, "NewPromiser");

      // generate a new electoral promise
      await expect(
        electoralManager
          .connect(addr1)
          .createElectoralPromise(_baseUri, _isNotObligatory)
      )
        .to.emit(electoralManager, "CreatedPromise")
        .withArgs(addr1.address, _tokenId);
    });
    //@ts-ignore
    it("should track the correct approve of an electoral promise", async function () {
      // basic information for an electoral promise

      const allEP = await electoralManager.getAllPromises();
      expect(allEP.length).to.equal(1);

      expect(await electoralManager.counterElectoralPromises()).to.equal(1);
      // APPROVE ELECTORAL PROMISE

      // First attempt expect to return error promise do not exists
      const _idTokenExists = 0;
      await expect(
        await electoralManager.connect(deployer).approvePromise(_idTokenExists)
      )
        .to.emit(electoralManager, "ApprovedPromise")
        .withArgs(_idTokenExists);

      // check metadata of electoral promise
      const allEPBeforeApprove = await electoralManager.getAllPromises();

      const electoralPromise = allEPBeforeApprove[_idTokenExists];
      expect(electoralPromise.dateApproved).to.gt(electoralPromise.created);
    });
    //@ts-ignore
    it("should track the incorrect attempt to approve an electoral promise", async function () {
      // Second attempt, promise do not exist
      const _idTokenNotExists = 1;
      // send tx
      await expect(
        electoralManager.connect(deployer).approvePromise(_idTokenNotExists)
      ).to.be.revertedWith(_errorApprovePromiseNotExists);
    });

    //@ts-ignore
    it("should track the incorrect attempt to approve an electoral promise before legislature ends", async function () {
      // Second attempt, promise exist
      const _idTokenExists = 0;
      // move time 4 years
      const nowInFourYears: number = Date.now() + _secondsLegislature;
      await network.provider.send("evm_setNextBlockTimestamp", [
        nowInFourYears,
      ]);

      await expect(
        electoralManager.connect(deployer).approvePromise(_idTokenExists)
      ).to.be.revertedWith(_errorApprovePromiseLegislatureGone);
    });

    //@ts-ignore
    it("Should emit an error when the caller is not the owner for function approve", async function () {
      const _idTokenExists = 0;
      expect(await electoralManager.counterElectoralPromises()).to.equal(1);
      await expect(
        electoralManager.connect(addr2).approvePromise(_idTokenExists)
      ).to.be.revertedWith(_errorNotTheOwner);
    });
  });
});

//@ts-ignore
describe("ElectoralManager error deploy", function () {
  // contrat for deploy
  let ElectoralManager;
  let electoralManager: ElectoralManager;

  // constructor data
  const _name: string = "FoolMeOnce";
  const _symbol: string = "FMO";
  const _baseUri: string = "";
  const _SECONDS_LEGISLATURE: number = 126144000;
  // address manage
  let deployer: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const _completeName1 = "Juan Alberto Rodriguez";
  const _namePoliticalParty1 = "Partido Por La BlockChain";
  const _isNotObligatory = false;
  const _isNotPoliticalParty = false;

  //@ts-ignore
  it("should track the incorrect attempt on create the smart contract", async function () {
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
    ElectoralManager = await ethers.getContractFactory("ElectoralManager");
    electoralManager = await ElectoralManager.deploy(_name, _symbol, _baseUri);

    await expect(
      electoralManager
        .connect(addr1)
        .registerUser(
          _completeName1,
          _namePoliticalParty1,
          _isNotPoliticalParty
        )
    ).to.emit(electoralManager, "NewPromiser");

    const _idTokenExists = 0;
    // generate a new electoral promise
    await expect(
      electoralManager
        .connect(addr1)
        .createElectoralPromise(_baseUri, _isNotObligatory)
    )
      .to.emit(electoralManager, "CreatedPromise")
      .withArgs(addr1.address, _idTokenExists);

    console.log(await electoralManager.connect(addr1).tokenURI(_idTokenExists));
  });
});
