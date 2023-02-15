// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/// @dev import IERC165
import "../ERC165/IERC165.sol";

/// @title Interface EIP-721
interface IERC721 is IERC165 {
    /// Events
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );
    event Approval(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );
    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    /**
     * @dev returns the amount of an address
     * @param _owner addressz
     */
    function balanceOf(address _owner) external view returns (uint256);

    /**
     * @dev returns the onwer address given the id
     * @param _tokenId uint256
     */
    function ownerOf(uint256 _tokenId) external view returns (address);

    /**
     * @dev transfer a tokenid from `from' to a `to`
     * @param _from address
     * @param _to address
     * @param _tokenId uint256
     * @param data bytes
     */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) external payable;

    ///@dev similar
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable;

    ///@dev similar to safeTransferFrom but without knowing if the recipient can receive the token
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable;

    ///@dev Gives permission to `to` to transfer `tokenId` token to another account
    function approve(address _approved, uint256 _tokenId) external payable;

    ///@dev give an operator the permission to transfer tokens
    function setApprovalForAll(address _operator, bool _approved) external;

    ///@dev Returns the account approved for `tokenId` token
    function getApproved(uint256 _tokenId) external view returns (address);

    ///@dev similar to getapproved, but with an owner
    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool);
}
