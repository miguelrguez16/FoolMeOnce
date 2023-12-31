// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

///@author Miguel Rodriguez Gonzalez
///@title Interface for Electoral Promise
///@dev Interface similar to IERC721
interface IElectoralPromise {
    /**
     * @dev Emitted when `tokenId` token is created from `from`.
     */
    event CreatedPromise(address indexed from, uint256 indexed tokenId);

    /**
     * @dev Approved when `tokenId` token is approved.
     */
    event ApprovedPromise(uint256 indexed tokenId);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
