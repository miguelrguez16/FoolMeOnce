// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "ERCs/ERC165/IERC165.sol";

/// @title Abstract contract EIP-165
abstract contract ERC165 is IERC165 {
    /**
     * @dev returns true it this contract implements the interface defined by `interfaceId'
     * @param {interfaceId} Identifier of the interface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return type(IERC165).interfaceId == interfaceId;
    }
}
