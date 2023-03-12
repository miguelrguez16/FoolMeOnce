// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ElectoralPromise.sol";
import "./DataInfo.sol";

///@author Miguel Rodriguez Gonzalez
contract ElectoralManager is ElectoralPromise {
    // using DataPromise for DataInfo.DataPromise;
    // using Promiser for DataInfo.Promiser;

    /****************************
     *      CONSTRUCTOR
     ****************************/

    constructor() ElectoralPromise("FoolMeOnce", "FMO", "ipfs://") {
        counterElectoralPromises = 0;
        counterPromisers = 1;
    }

    ///@dev number of promise, it is use for id
    uint256 public counterElectoralPromises;

    ///@dev identify the next id for a new user
    uint256 public counterPromisers;

    ///@dev list of all electoral promise
    DataInfo.DataPromise[] public listElectoralPromises;

    ///@dev list promisers
    mapping(address => DataInfo.Promiser) public listPromisers;

    event NewPromiser(address indexed owner);

    /****************************
     *      PUBLIC FUNCTIONS
     ****************************/

    /**
     * @notice register a new user
     * @param _completeName string of the user
     * @param _isPoliticalParty boolean that identifies whether it is a political party
     * @return the id of the new user
     */
    function registerUser(
        string memory _completeName,
        bool _isPoliticalParty
    ) external returns (uint256) {
        /// check if msg.sender is not registerd
        require(
            _checkPromiser(msg.sender) == 0,
            "ElectoralManager author already exists"
        );

        /// register a new user
        DataInfo.Promiser memory tmpPromiser = DataInfo.Promiser(
            counterPromisers,
            _completeName,
            _isPoliticalParty
        );

        listPromisers[msg.sender] = tmpPromiser;

        counterPromisers++; //increment

        /// emit new user
        emit NewPromiser(msg.sender);

        // return the identifier
        return tmpPromiser.idAuthor;
    }

    /**
     * @notice register a new Electoral promise
     * @param _tokenURI string with all data
     * @param _isObligatory boolean representing the mandatory of the electoral promise
     * @return the id of the new user
     */
    function createElectoralPromise(
        string memory _tokenURI,
        bool _isObligatory
    ) external returns (uint256) {
        require(
            _checkPromiser(msg.sender) != 0,
            "ElectoralManager author not exists"
        );

        /// new ElectoralPromise
        DataInfo.DataPromise memory tmpPromise = DataInfo.DataPromise(
            counterElectoralPromises,
            block.timestamp,
            0,
            listPromisers[msg.sender].idAuthor,
            _isObligatory,
            false,
            _tokenURI,
            listPromisers[msg.sender].completeName
        );

        /// save into the list
        listElectoralPromises.push(tmpPromise);

        /// mint the newPromise
        _mint(msg.sender, counterElectoralPromises);
        _setTokenURI(counterElectoralPromises, _tokenURI);
        uint256 idtoken = counterElectoralPromises;
        counterElectoralPromises++;
        emit CreatedPromise(msg.sender, idtoken);
        // return the total electoral Promises
        return counterElectoralPromises;
    }

    /**
     * @notice returns the associated identifier
     */
    function checkMyIdentifier() external view returns (uint256) {
        return listPromisers[msg.sender].idAuthor;
    }

    /**
     * @notice returns all electoral promises
     */
    function getAllPromises()
        public
        view
        returns (DataInfo.DataPromise[] memory)
    {
        return listElectoralPromises;
    }

    /****************************
     *      INTERNAL FUNCTIONS
     ****************************/

    /**
     * @dev returns the identifier for a user
     */
    function _checkPromiser(
        address _addressToCheck
    ) internal view returns (uint256) {
        return listPromisers[_addressToCheck].idAuthor;
    }
}
