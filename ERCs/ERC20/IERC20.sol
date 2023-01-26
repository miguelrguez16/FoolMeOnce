// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;


/// @title Interface of the ERC for fungible
/// @author Miguel Rodríguez González
interface IERC20 {
    
    /// Events for the control, we cans subscribe and query for search something
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /// Get the total number of tokens
    function totalSupply() external view returns (uint256);

    /// Get the balance of tokens for a specific count
    function getBalanceOf(address account) external view returns (uint256);


/// 
    function transfer(address _to, uint256 amount) external returns (bool);

    /// owner lends some tokens to the spender
    // @returns uint value of tokens to use by the spender
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256) external returns (bool);

    function transferFrom(
        address _from,
        address _to,
        uint256 amount
    ) external returns (bool); 
}