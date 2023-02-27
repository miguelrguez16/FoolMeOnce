// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ElectoralPromise.sol";

contract ElectoralManager is ElectoralPromise {
    /****************************
     *      CONSTRUCTOR
     ****************************/

    constructor() ElectoralPromise("FoolMeOnce", "FMO", "ipfs://") {
        counterElectoralPromises = 0;
        counterPromisers = 1;
    }

    /****************************
     *      DATA STRUCTURES
     ****************************/

    ///@dev Basic info of a electoral promise
    struct DataPromise {
        uint256 id;
        uint256 created; // timestamp
        uint256 idAuthor;
        bool isObligatory;
        bool isApproved;
        string tokenUri;
        string nameAuthor;
        uint256[] relationalPromises;
    }
    ///@dev list of all electoral promise
    DataPromise[] public listElectoralPromises;

    ///@dev number of promise, it  is use for id
    uint256 public counterElectoralPromises;

    ///@dev basic info for a person or a
    struct Promiser {
        uint256 idAuthor;
        string completeName;
        bool isPoliticalParty;
    }
    uint256 public counterPromisers;
    ///@dev list promisers
    mapping(address => Promiser) public listPromisers;

    event NewPromiser(address indexed owner);

    /****************************
     *      PUBLIC FUNCTIONS
     ****************************/

    function registerUser(string memory _completeName, bool _isPoliticalParty)
        external
        returns (uint256)
    {
        require(
            _checkPromiser(msg.sender) == 0,
            "ElectoralManager author already exists"
        );

        Promiser memory tmpPromiser = Promiser(
            counterPromisers,
            _completeName,
            _isPoliticalParty
        );

        listPromisers[msg.sender] = tmpPromiser;

        counterPromisers++;

        emit NewPromiser(msg.sender);

        return tmpPromiser.idAuthor;
    }

    function checkMyIdentifier() external view returns (uint256) {
        return listPromisers[msg.sender].idAuthor;
    }

    function getAllPromises() public view returns (DataPromise[] memory) {
        return listElectoralPromises;
    }

    function createElectoralPromise(
        string memory _tokenURI,
        bool _isObligatory,
        uint256[] memory _relationalPromises
    ) external returns (uint256) {
        require(
            _checkPromiser(msg.sender) != 0,
            "ElectoralManager author not exists"
        );

        /// new ElectoralPromise
        DataPromise memory tmpPromise = DataPromise(
            counterElectoralPromises,
            block.timestamp,
            listPromisers[msg.sender].idAuthor,
            _isObligatory,
            false,
            _tokenURI,
            listPromisers[msg.sender].completeName,
            _relationalPromises
        );

        /// save into the list
        listElectoralPromises.push(tmpPromise);

        /// mint the newPromise
        _mint(msg.sender, counterElectoralPromises);
        _setTokenURI(counterElectoralPromises, _tokenURI);

        counterElectoralPromises++;
        emit CreatedPromise(msg.sender, counterElectoralPromises);
        return counterElectoralPromises;
    }

    /****************************
     *      PRIVATE FUNCTIONS
     ****************************/

    function _checkPromiser(address _addressToCheck)
        internal
        view
        returns (uint256)
    {
        return listPromisers[_addressToCheck].idAuthor;
    }
}
