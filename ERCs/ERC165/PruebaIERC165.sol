// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./../ERC721/IERC721.sol";

///@title Interfaz say hello
interface OtraInterfaz {
    function sayHello() external pure returns (string memory);
}

///@title Pruebas
contract PruebaIERC165 is IERC165, OtraInterfaz {
    bytes4 public interfaceOtra = type(OtraInterfaz).interfaceId;
    bytes4 public interfaceIERC165 = type(IERC165).interfaceId;

    function sayHello() external pure returns (string memory) {
        return "Hi";
    }

    function supportsInterface(bytes4 interfaceId)
        external
        view
        override
        returns (bool)
    {
        return
            type(IERC165).interfaceId == interfaceId ||
            interfaceOtra == interfaceId;
    }
}
