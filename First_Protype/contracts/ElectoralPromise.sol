// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IElectoralPromise.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ElectoralPromise is IElectoralPromise {
    using Strings for uint256;

    /****************************
     *      DATA STRUCTURES
     ****************************/
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;
    // Base uri
    string private _baseUri;


    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to tokenUri
    mapping(uint256 => string) private _tokenURIs;

    /****************************
     *      CONSTRUCTOR
     ****************************/
    /**
    * @dev Initializes the contract by setting a `name`, a `symbol` and a `baseUri to the token collection
    */
    constructor(string memory name_, string memory symbol_, string memory baseUri_) {
        _name = name_;
        _symbol = symbol_;
        _baseUri = baseUri_;
    }


}
