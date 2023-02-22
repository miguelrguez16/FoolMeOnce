// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;


import "ERCs/ERC721/ERC721.sol";


/// @author Miguel Rodriguez Gonzalez
contract PromesaElectoral721 is ERC721 {

    /// constructor
    constructor(string memory _name, string memory _symbol)
        ERC721("FoolMeOnce", "FMO")
    {}

    /// Contador ids ERC721
    uint256 COUNTER;

    // Struct for the Promise
    struct Promise {
        string title;
        string description;
        uint256 id;
        string name;
        address onwer;
    }

    Promise[] public electoralPromises;

    /// new promise
    function createElectoralPromise(
        string memory _title,
        string memory _description,
        string memory _name
        ) public {
            Promise memory newPromise = Promise(_title, _description, COUNTER,_name, msg.sender);
            electoralPromises.push(newPromise);
            _safeMint(msg.sender, COUNTER);
            COUNTER++;
        }

}