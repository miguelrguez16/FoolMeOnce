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

  // ERRORS MESSAGES
  const _errorNewRegister = "Error: ElectoralManager author already exists";
  const _errorAuthorNotExists = "Error: ElectoralManager author does not exist";
  const _errorApprovePromiseNotExists: string =
    "Error: electoral promise does not exists";
  const _errorApprovePromiseLegislatureGone =
    "Error: a legislature already gone";
  const _errorApprovePromiseAlreadyApproved =
    "Error: electoral promise already approved";

  const _errorNotTheOwner = "Ownable: caller is not the owner";

  // BASIC INFO FOR REGISTER
  const _completeName1 = "Juan Alberto Rodriguez";
  const _namePoliticalParty1 = "Partido Por La BlockChain";
  const _isPoliticalParty = false;
  const _newIdentifierOne = 1;
  const _isNotObligatory = false;
  const _isNotPoliticalParty = false;
  const _tokenIdZero = 0;

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
   *          CAMINO 1-2-3
   * #######################################################################
   */
  //@ts-ignore
  describe("Register a new User, create a promise and approve it", function () {
    //@ts-ignore
    beforeEach(async () => {
      await expect(
        electoralManager
          .connect(addr1)
          .registerUser(_completeName1, _namePoliticalParty1, _isPoliticalParty)
      ).to.emit(electoralManager, "NewPromiser");

      await expect(
        await electoralManager.connect(addr1).checkMyIdentifier()
      ).to.equal(_newIdentifierOne);

      const promiser = await electoralManager.promisers(addr1.address);
      expect(promiser.idAuthor).to.equal(_newIdentifierOne);
      expect(promiser.completeName).to.equal(_completeName1);
      expect(promiser.isPoliticalParty).to.equal(_isPoliticalParty);
      expect(await electoralManager.counterPromisers()).to.equal(
        _newIdentifierOne + 1
      );

      /**
       * CREATE PROMISE
       */

      await expect(
        electoralManager
          .connect(addr1)
          .createElectoralPromise(_baseUri, _isNotObligatory)
      )
        .to.emit(electoralManager, "CreatedPromise")
        .withArgs(addr1.address, _tokenIdZero);

      await expect(
        electoralManager
          .connect(addr2)
          .createElectoralPromise(_baseUri, _isNotObligatory)
      ).to.be.revertedWith(_errorAuthorNotExists);

      // expect to list increment
      expect(await electoralManager.counterElectoralPromises()).to.equal(1);

      const allEP = await electoralManager.getAllPromises();
      expect(allEP.length).to.equal(1);

      // expect all data is correct
      const electoralPromise = allEP[0];

      expect(electoralPromise.id).to.equal(_tokenIdZero);
      expect(electoralPromise.nameAuthor).to.equal(_completeName1);
      expect(electoralPromise.namePoliticalParty).to.equal(
        _namePoliticalParty1
      );
      expect(electoralPromise.idAuthor).to.equal(_newIdentifierOne);
      expect(electoralPromise.created).to.not.equal(Date.now()); // Timestamp
      expect(electoralPromise.dateApproved).to.equal(0);
      expect(electoralPromise.tokenUri).to.equal(_baseUri);
      expect(electoralPromise.isObligatory).to.equal(_isNotObligatory);

      // expect basic information to be correct
      expect(await electoralManager.tokenURI(_tokenIdZero)).to.equal(
        "ipfs://" + _baseUri
      );
      expect(await electoralManager.ownerOf(_tokenIdZero)).to.equal(
        addr1.address
      );
      expect(await electoralManager.balanceOf(addr1.address)).to.equal(1);
    });

    /**
     * APPROVE PROMISE
     */
    //@ts-ignore
    it("should track the correct attempt to approve an electoral promise", async function () {
      await expect(
        await electoralManager.connect(deployer).approvePromise(_tokenIdZero)
      )
        .to.emit(electoralManager, "ApprovedPromise")
        .withArgs(_tokenIdZero);

      // check metadata of electoral promise
      const allEPBeforeApprove = await electoralManager.getAllPromises();
      const electoralPromiseApproved = allEPBeforeApprove[_tokenIdZero];

      expect(electoralPromiseApproved.dateApproved).to.not.equal(
        electoralPromiseApproved.created
      );
    });

    /**
     * APPROVE PROMISE ALREADY APPROVED
     */
    //@ts-ignore
    it("should track the error when approve a promise that already was approved", async function () {
      await expect(
        await electoralManager.connect(deployer).approvePromise(_tokenIdZero)
      )
        .to.emit(electoralManager, "ApprovedPromise")
        .withArgs(_tokenIdZero);

      await expect(
        electoralManager.connect(deployer).approvePromise(_tokenIdZero)
      ).to.be.revertedWith(_errorApprovePromiseAlreadyApproved);
    });

    /**
     * APPROVE PROMISE NOT CREATED
     */
    //@ts-ignore
    it("should track the incorrect attempt to approve an electoral promise not created", async function () {
      // Second attempt, promise do not exist
      const _idTokenNotExists = 3;
      // send tx
      await expect(
        electoralManager.connect(deployer).approvePromise(_idTokenNotExists)
      ).to.be.revertedWith(_errorApprovePromiseNotExists);
    });

    //@ts-ignore
    it("should track the incorrect attempt to approve an electoral promise before legislature ends", async function () {
      // move time 4 years
      const nowInFourYears: number = Date.now() + _secondsLegislature;
      await network.provider.send("evm_setNextBlockTimestamp", [
        nowInFourYears,
      ]);

      await expect(
        electoralManager.connect(deployer).approvePromise(_tokenIdZero)
      ).to.be.revertedWith(_errorApprovePromiseLegislatureGone);
    });

    //@ts-ignore
    it("Should emit an error when the caller is not the owner for function approve", async function () {
      await expect(
        electoralManager.connect(addr2).approvePromise(_tokenIdZero)
      ).to.be.revertedWith(_errorNotTheOwner);
    });
  });

  /**
   * Crear un nuevo usuario y reintento
   */
  //@ts-ignore
  describe("Register and try again to register the same address", function () {
    //@ts-ignore
    it("should track the register of a person and return an error when register a person with the same address", async function () {
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

      const promiser = await electoralManager.promisers(addr1.address);

      expect(promiser.idAuthor).to.equal(_newIdentifierOne);
      expect(promiser.completeName).to.equal(_completeName1);
      expect(promiser.isPoliticalParty).to.equal(_isPoliticalParty);
      expect(await electoralManager.counterPromisers()).to.equal(
        _newIdentifierOne + 1
      );
    });
  });
});
