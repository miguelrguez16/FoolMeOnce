// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/// @title Interface EIP-165
interface IERC165 {
    /**
     * @dev returns true it this contract implements the interface defined by `interfaceId'
     * @param {interfaceId} Identifier of the interface
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
