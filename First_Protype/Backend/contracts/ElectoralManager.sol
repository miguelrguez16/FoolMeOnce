// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ElectoralPromise.sol";
import "./DataInfo.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title manage all data for electoralPromise
///@author Miguel Rodriguez Gonzalez
contract ElectoralManager is ElectoralPromise, Ownable {
    /****************************
     *      CONSTRUCTOR
     ****************************/

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseUri_
    ) ElectoralPromise(name_, symbol_, baseUri_) {
        counterElectoralPromises = 0;
        counterPromisers = 1;
    }

    ///@dev number of seconds on four years
    uint256 public constant SECONDS_LEGISLATURE = 126_144_000;

    ///@dev number of promise, it is use for id
    uint256 public counterElectoralPromises;

    ///@dev identify the next id for a new user
    uint256 public counterPromisers;

    ///@dev list of all electoral promise
    DataInfo.DataPromise[] public electoralPromises;

    ///@dev list promisers
    mapping(address => DataInfo.Promiser) public promisers;

    ///@dev event create user
    event NewPromiser(address indexed owner);

    /****************************
     *      PUBLIC FUNCTIONS
     ****************************/

    /**
     * @notice register a new user
     * @param _completeName string of the user
     * @param _namePoliticalParty string that identifies the political party
     * @param _isPoliticalParty boolean that identifies whether it is a political party
     * @return the id of the new user
     */
    function registerUser(
        string memory _completeName,
        string memory _namePoliticalParty,
        bool _isPoliticalParty
    ) external returns (uint256) {
        /// check if msg.sender is not registerd
        require(
            _checkPromiser(msg.sender) == 0,
            "Error: ElectoralManager author already exists"
        );
        uint256 idAssignedAuthor = counterPromisers;
        /// register a new user
        DataInfo.Promiser memory promiserData = DataInfo.Promiser(
            idAssignedAuthor,
            _isPoliticalParty,
            _completeName,
            _namePoliticalParty
        );

        promisers[msg.sender] = promiserData;

        counterPromisers++; //increment

        /// emit new user
        emit NewPromiser(msg.sender);

        // return the identifier
        return idAssignedAuthor;
    }

    /**
     * @notice register a new Electoral promise
     * @param _tokenURI string with all data
     * @param _isObligatory boolean representing the mandatory of the electoral promise
     * @return the id of the new promise
     */
    function createElectoralPromise(
        string memory _tokenURI,
        bool _isObligatory
    ) external returns (uint256) {
        require(
            _checkPromiser(msg.sender) != 0,
            "Error: ElectoralManager author not exists"
        );

        /// new ElectoralPromise
        DataInfo.DataPromise memory dataPromise = DataInfo.DataPromise(
            counterElectoralPromises,
            block.timestamp,
            0,
            listPromisers[msg.sender].idAuthor,
            _isObligatory,
            _tokenURI,
            listPromisers[msg.sender].completeName,
            listPromisers[msg.sender].namePoliticalParty
        );

        /// save into the list
        electoralPromises.push(dataPromise);

        /// mint the newPromise
        _mint(msg.sender, counterElectoralPromises);
        _setTokenURI(counterElectoralPromises, _tokenURI);
        uint256 idtoken = counterElectoralPromises;
        counterElectoralPromises++;
        emit CreatedPromise(msg.sender, idtoken);
        // return the total electoral Promises
        return idtoken;
    }

    /**
     * @dev approve an electoral promise updating the parameter dateApproved
     * @param promiseId uint that identifies the electoral promise
     */
    function approvePromise(uint256 promiseId) external onlyOwner {
        require(
            promiseId < counterElectoralPromises,
            "Error: electoral promise do not exists"
        );
        DataInfo.DataPromise storage promiseToApprove = electoralPromises[
            promiseId
        ];
        require(
            promiseToApprove.dateApproved == 0,
            "Error: electoral promise already approved"
        );
        //check if 4 years of legislature have passed
        uint256 currentSeconds = block.timestamp;
        uint256 difference = currentSeconds - promiseToApprove.created;
        require(
            difference < SECONDS_LEGISLATURE,
            "Error: a legislature already gone"
        );

        promiseToApprove.dateApproved = currentSeconds;
        emit ApprovedPromise(promiseId);
    }

    /**
     * @notice returns the associated identifier
     */
    function checkMyIdentifier() external view returns (uint256) {
        return promisers[msg.sender].idAuthor;
    }

    /**
     * @notice returns all electoral promises
     */
    function getAllPromises()
        public
        view
        returns (DataInfo.DataPromise[] memory)
    {
        return electoralPromises;
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
