// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ElectoralPromise.sol";

contract ElectoralManager is ElectoralPromise {
    constructor() ElectoralPromise("FoolMeOnce", "FMO", "ipfs://") {
        COUNTER = 0;
    }

    struct Promise {
        uint256 id;
        uint256 created;
        bool isObligatory;
        bool isApproved;
        string author;
        string tokenUri;
        uint256[] relationalPromises;
    }

    Promise[] public listPromises;
    uint256 public COUNTER;

    function newPromise(
        string memory _tokenURI,
        bool _isObligatory,
        string memory author,
        uint256[] memory _relationalPromises
    ) external returns (uint256) {
        Promise memory tmpPromise = Promise(
            COUNTER,
            block.timestamp,
            _isObligatory,
            false,
            author,
            _tokenURI,
            _relationalPromises
        );
        listPromises.push(tmpPromise);

        _mint(msg.sender, COUNTER);
        _setTokenURI(COUNTER, _tokenURI);

        COUNTER++;
        return COUNTER;
    }

    function getAllPromises() public view returns (Promise[] memory) {
        return listPromises;
    }

    // TODO?: unction getPromiseFromAuthor()
}
