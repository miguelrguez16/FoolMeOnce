// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./IElectoralPromise.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

///@author Miguel Rodriguez Gonzalez
///@title ElectoralPromise to manage the mint of promises
///@dev Smart Contract similar to ERC721
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
    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseUri_
    ) {
        _name = name_;
        _symbol = symbol_;
        _baseUri = baseUri_;
    }

    /****************************
     *      FUNCTIONS
     ****************************/

    /**
     * @dev Emitted when `tokenId` token is created from `from`.
     */
    function name() external view returns (string memory) {
        return _name;
    }

    /**
     * @dev Approved when `tokenId` token is approved.
     */
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address _owner) external view returns (uint256 balance) {
        require(
            _owner != address(0),
            "ElectoralPromise: owner is zero address"
        );
        return _balances[_owner];
    }

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner) {
        address ownerOfPromise = _owners[tokenId];
        require(
            ownerOfPromise != address(0),
            "ElectoralPromise: owner query for nonexistent token"
        );
        return ownerOfPromise;
    }

    /**
     * @dev Returns true if the `tokenId` exists.
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Returns the `_baseUri` for the tokens.
     */
    function baseURI() external view virtual returns (string memory) {
        return _baseUri;
    }

    /**
     * @dev creat a new token 
     * @param to the address of the owner
     * @param tokenId the identifier of the new token
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ElectoralPromise: mint to the zero address");
        require(!_exists(tokenId), "ElectoralPromise: token already minted");

        _balances[to] += 1;
        _owners[tokenId] = to;
    }

    /**
     * 
     * @param tokenId the identifier of the token
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ElectoralPromise: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = this.baseURI();

        // it can not exits a situation where base uri do not exist
        // if (bytes(base).length == 0)

        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return "";
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) internal virtual {
        require(
            _exists(tokenId),
            "ElectoralPromise: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }
}
