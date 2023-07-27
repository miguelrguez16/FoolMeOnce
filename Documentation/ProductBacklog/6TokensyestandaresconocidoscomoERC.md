# Contenido

<!-- markdownlint-disable MD033 -->
<html><style>*{scroll-behavior:smooth}</style></html>

- [Contenido](#contenido)
  - [Introducción](#introducción)
  - [Estudio de los estándares conocidos como ERC y su origen](#estudio-de-los-estándares-conocidos-como-erc-y-su-origen)
  - [Ethereum Improvements Proposals (EIPs)](#ethereum-improvements-proposals-eips)
  - [Ethereum Request for Comments (ERCs)](#ethereum-request-for-comments-ercs)
  - [Fungible y no fungible](#fungible-y-no-fungible)
  - [Desglosando interfaces](#desglosando-interfaces)
    - [Interfaz IERC-20](#interfaz-ierc-20)
    - [Interfaz IERC-777](#interfaz-ierc-777)
    - [Interfaz IERC-721](#interfaz-ierc-721)
      - [InterfazERC721Metadata](#interfazerc721metadata)
      - [Interfaz ERC721URIStorage](#interfaz-erc721uristorage)
    - [Interfaz ERC-5114 (Propuesta)](#interfaz-erc-5114-propuesta)
    - [Interfaz ERC-1155](#interfaz-erc-1155)
  - [Pros y Contras de los anteriores estándares y qué es lo que mejoraron](#pros-y-contras-de-los-anteriores-estándares-y-qué-es-lo-que-mejoraron)
    - [Desventajas del ERC-20 y su evolución ERC-777](#desventajas-del-erc-20-y-su-evolución-erc-777)
    - [Desventaja del ERC-5114](#desventaja-del-erc-5114)
    - [Desventajas ERC-20 y ERC-721](#desventajas-erc-20-y-erc-721)
  - [¿Qué ERC mejor se acopla a nuestro proyecto?](#qué-erc-mejor-se-acopla-a-nuestro-proyecto)
  - [Referencias](#referencias)

## Introducción

Para este proyecto, se quiere lograr un almacenamiento en la red Blockchain, por ello se debe adentrar en los conocidos tokens. Los tokens pueden ser más que una divisa que regula una plataforma, es decir, pueden ser programados para cumplir con una función, pueden representar recursos, arte digital (NFTs), coleccionables, Equidad (accionistas de una organización con DAOs),Votaciones, Certificados, etc. En Ethereum, existe una criptodivisa que es el ETHER, que funciona como un Token con valor en la red, la cual permite regular las transacciones, seguridad, ...

## Estudio de los estándares conocidos como ERC y su origen

En Ethereum existen propuestas para la mejora continua del protocolo permitiendo adaptarse a nuevas tecnologías, a nuevos usos sobre este protocolo, todo comienza con una Propuesta de Mejora, que para este protocolo se denomina EIPs

## Ethereum Improvements Proposals (EIPs)

Para este estudio, las [EIPs](https://ethereum.org/es/eips/) (Ethereum Improvements Proposals) que nos interesan son las encargadas de la generación de tokens, es decir, generación de ítems dentro de la cadena, los tres más importantes y conocidos son los siguientes tres estándares:

- [EIP-20:](https://eips.ethereum.org/EIPS/eip-20) Propuesta para la estandarización de generación, transferencia, aprobación de tokens, ...
- [EIP-721:](https://eips.ethereum.org/EIPS/eip-721) Propuesta de estándar para la transferencia y rastreabilidad de Tokens No Fungibles.
- [EIP-777:](https://eips.ethereum.org/EIPS/eip-777) Mejora del EIP-20, ofrece mayor control sobre la transferencia de tokens
- [EIP-1155:](https://eips.ethereum.org/EIPS/eip-1155) Propuesta de estándar para el manejo de los tipos de tokens anteriores, es decir, tanto fungibles como no fungibles, además de una serie de funciones nuevas.
- [EIP-5114:](https://eips.ethereum.org/EIPS/eip-5114) (Soulbound Badget) propuesta de estándar de token asociado a un token no fungible sin permiso de transferencia.

## Ethereum Request for Comments (ERCs)

Estas propuestas, las EIP, se convirtieron tras la discusiones en foros públicos en estándares en Ethereum, es decir, en los conocidos como ERCs [(Ethereum Request for Comments)](https://ethereum.org/es/developers/docs/standards/tokens/), a saber ERC-20, ERC-721, ERC-1155 y ERC-165 (ERC-5114 está en proceso).

1. ERC-20: Se trata de una interfaz que brinda una funcionalidad básica para el manejo de tokens fungibles.
2. ERC-721: Se trata de un estándar para la generación de tokens no fungibles, esta interfaz establece la creación de tokens únicos, cada uno de los tokens difieren en sus propiedades, ya sean generales (nombre, fecha de creación) o especificas (rareza).
   1. Este estándar (y el resto de estándares) no solo especifican una única interfaz sino que propone extensiones, para este estándar existe una ampliamente acogida, se trata de la extensión, ERC721URIStorage. La cual permite dar a un NFTs una URI individual, permitiendo grabar en la BlockChain una ruta hacia [IPFS](https://docs.ipfs.tech/concepts/what-is-ipfs/#what-is-ipfs) donde se podrían almacenar ciertas propiedades de dicho NFT y/o una imagen de dicho NFT siendo accesible desde cualquier lugar.
3. ERC-1155: Interfaz denominada **multitoken**, ya que permite la creación de tokens ERC-20 y NFTs (ERC-721). Se trata de un estándar que mejora los dos anteriores permitiendo socavar los errores de estos.
4. ERC-5114: Este EIP, a la hora de desarrollar este proyecto, no ha sido completada su revisión para convertirse 100% en un estándar de la red. Su cometido es permitir la creación de tokens únicos que no tenga un propietario distinto al que se asigno con su creación.

## Fungible y no fungible

Atendiendo a la definición de la rae, [fungible](https://dle.rae.es/fungible) significa:

> "1. adj. Que se consume con el uso."

Esa es la principal diferencia entre los tokens creados en la red, los ERC-20 son consumibles, pero los NFTs brindan una posibilidad mayor, este tipo de tokens pueden representar algo más que una divisa, de aquí que exista el conocido arte digital, este estándar permite almacenar datos únicos del arte que los hacen diferentes, y para nuestra plataforma, promesas electorales.

## Desglosando interfaces

Los estándares definen interfaces, y gracias a la librería OpenSource de OpenZeppelin se tiene acceso a las versiones actualizadas de estas, además de una implementación segura.

### [Interfaz IERC-20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol)

```Solidity
interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
```

Un análisis rápido de la interfaz ERC20 nos muestra las diferentes posibilidades que brinda, desde conocer el balance de un usuario dada su dirección dentro de la red hasta el préstamo (allowance). Este token fungible "gastable" no deja de ser un estándar para crear "fichas", se podría crear un token como el euro, que funcionando sobre la blockchain podría tener multitud de usos sobre diferentes plataformas.

### [Interfaz IERC-777](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC777/IERC777.sol)

```Solidity
interface IERC777 {

    event Minted(address indexed operator, address indexed to, uint256 amount, bytes data, bytes operatorData);
    event Burned(address indexed operator, address indexed from, uint256 amount, bytes data, bytes operatorData);
    event AuthorizedOperator(address indexed operator, address indexed tokenHolder);
    event RevokedOperator(address indexed operator, address indexed tokenHolder);

    event Sent(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes data,
        bytes operatorData
    );

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);

    function granularity() external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function send(address recipient, uint256 amount, bytes calldata data) external;
    function burn(uint256 amount, bytes calldata data) external;
    function isOperatorFor(address operator, address tokenHolder) external view returns (bool);
    function authorizeOperator(address operator) external;
    function revokeOperator(address operator) external;
    function defaultOperators() external view returns (address[] memory);
    function operatorSend(
        address sender,
        address recipient,
        uint256 amount,
        bytes calldata data,
        bytes calldata operatorData
    ) external;
    function operatorBurn(address account, uint256 amount, bytes calldata data, bytes calldata operatorData) external
}
```

Partiendo del [ERC-20](#pros-y-contras-de-los-anteriores-estándares-y-qué-es-lo-que-mejoraron), estándar que lo mejora, incluye métodos como son la transferencia y notificación de tokens en una única ejecución y también aclara el concepto de los decimales, a través de la función de granularidad, sencillamente muestra cual es la mínima cantidad que permita realizar las operaciones de un token (erc-20).

### [Interfaz IERC-721](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol)

```Solidity
interface IERC721 is IERC165 {

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool approved) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}
```

Basándose en el token ERC-20, esta interfaz ofrece otras funciones más como setApprovalForAll, permite dar permisos a una dirección especifica para que maneje los NFTs del usuario owner. Pero también añade extensiones que implementan la interfaz IERC721:

#### InterfazERC721Metadata

```Solidity
interface IERC721Metadata is IERC721 {
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
```

#### Interfaz ERC721URIStorage

La extensión [ERC721URIStorage](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol) :

```Solidity
abstract contract ERC721URIStorage is ERC721 {
    using Strings for uint256;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
}
```

Esta clase abstracta permite almacenar URIs dentro de la blockChain permitiendo así el conocido como arte digital, de esta manera permite utilizar IPFS, se explica más adelante.

### Interfaz ERC-5114 (Propuesta)

```Solidity
interface IERC5114 {

    event Mint(uint256 indexed tokenId, address indexed nftAddress, uint256 indexed nftTokenId);
    function ownerOf(uint256 index) external view returns (address nftAddress, uint256 nftTokenId);
    function collectionUri() external pure returns (string collectionUri);
    function tokenUri(uint256 tokenId) external view returns (string tokenUri);
    function metadataFormat() external pure returns (string format);
}
```

Esta interfaz, aún no ha sido aprobada por la comunidad y por tanto su interfaz podría variar al igual que su implementación. Debido a este estado del EIP, no se encuentra en OpenZeppelin una implementación acorde. Las mejoras que viene a incluir en Ethereum serán mencionadas más adelante.

### [Interfaz ERC-1155](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/IERC1155.sol)

Esta interfaz hereda de IERC165 (estándar para la identificación de interfaces) añadiendo funciones importantes, el manejo de grupos de Tokens o _batch_, permitiendo manejar dentro de un mismo SmartContract sendos tipos de tokens (fungibles y no fungibles) esta interfaz tiene los siguientes métodos específicos de ella:

```Solidity
event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);

    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    event ApprovalForAll(address indexed account, address indexed operator, bool approved);

    event URI(string value, uint256 indexed id);

    function balanceOf(address account, uint256 id) external view returns (uint256);


    function balanceOfBatch(
        address[] calldata accounts,
        uint256[] calldata ids
    ) external view returns (uint256[] memory);

    function setApprovalForAll(address operator, bool approved) external;

    function isApprovedForAll(address account, address operator) external view returns (bool);

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;

```

Con una sola llamada se puede obtener el balance de tokens de un conjunto de direcciones y sus ids. En cuanto al safeBatchTransferFrom permite mandar tanto identificadores como tokens sin requerir en múltiples transacciones sobre la red. Este ERC permite trabajar con grupos de tokens, desde transferirlos, comprobar balance, ... todo ello con una única transacción.

## Pros y Contras de los anteriores estándares y qué es lo que mejoraron

En primer lugar, el estándar ERC-20 trajo consigo un manera de generar tokens sobre cualquier BlockChain, pero sobre todo sobre Ethereum haciendolos interoperables en la red o _dapp_ que los maneje, como los _exchange_, lo mismo viene a ser también para los ERC-721.

### Desventajas del ERC-20 y su evolución ERC-777

Uno de los problemas de los ERC20, se debe a que para transferir son necesarios dos operaciones o en este caso, dos transferencias. Para permitir que una segunda persona pueda gastar un allowance (un préstamo), se deben realizar dos transferencias, bajando el rendimiento de la operación e incrementando el coste para las dos personas. Los usuarios deben hacer los siguiente:

```Sequence
Sender-->Contrato: approve(...)
Spender-->Contrato: allowance (...)
```

Pasa exactamente lo mismo con las transferencias, donde primero se necesita que el owner ejecute el approve y luego el transferido ejecute la función transferFrom:

```Sequence
Sender-->Contrato: approve(...)
Spender-->Contrato: transferFrom (..)
```

Además, estás operaciones, no es que tengan solo que ser divididas en dos transacciones teniendo que pagar el coste del minero, sino que también se ve incrementado el tiempo entre transacciones. por estas razones

### Desventaja del ERC-5114

Aún no se recomienda su uso debido a la falta de estandarización, no serían interoperables y podrían variar en su especificación.

### Desventajas ERC-20 y ERC-721

El problema de estos ERCs, ilustrándolo con un problema dado con los NFTs, viene a ser el manejo, creación y transferencia del conjunto de grupos de ellos, de ahí surgió el estándar ERC-1155, el cual es muy recomendable en el caso de manejar sendos tokens. Este ERC 1155 cambia el paradigma de las aplicaciones descentralizadas.

Este estándar surge por las limitaciones mencionadas tanto con ERC-20 y ERC-721, pero además ante el creciente número de tokens erc-20 desplegados en la red de ethereum.

<div style="width:100%; height:fit-content; display:flex; justify-content:center; align-items:center;">
<img src="https://media.licdn.com/dms/image/C4D22AQFlqMg1SqLJjw/feedshare-shrink_1280/0/1675184641819?e=1679529600&v=beta&t=ZGGP2B3TLQa7km6sqZykbEa7-wz9N19iHE3r9zQEz5g" width="500px">
</div>

## ¿Qué ERC mejor se acopla a nuestro proyecto?

El alcance de este proyecto, en una primera instancia, es la generación de una plataforma que permita grabar las promesas electorales en la BlockChain, siendo el estándar ERC-721 el que más se ajusta a nuestro objetivo.
Nos permite crear tokens únicos para cada promesa electoral, estableciéndole unos atributos, como son partido político, título, texto, fecha, además mediante la extensión [ERC721URIStorage](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol) nos permitirá guardar un identificador único de IPFS (o cualquier otra plataforma) llamado CID; este CID es el resultado de guardar de manera distribuida unos datos en la red de IPFS, los cuales podrían ser el conjunto de datos de la promesa y/o una imagen de está. Una imagen sería una representación más accesible de la promesa, algo más visual para el usuario. Aún en estudio esta última parte.

## Referencias

- Fabian Vogelsteller, Vitalik Buterin, "EIP-20: Token Standard," Ethereum Improvement Proposals, no. 20, November 2015. [Online serial]. Available: [https://eips.ethereum.org/EIPS/eip-20.](https://eips.ethereum.org/EIPS/eip-20.)
- Jacques Dafflon <mail@0xjac.com>, Jordi Baylina <jordi@baylina.cat>, Thomas Shababi <tom@truelevel.io>, "ERC-777: Token Standard," Ethereum Improvement Proposals, no. 777, November 2017. [Online serial]. Available: [https://eips.ethereum.org/EIPS/eip-777](https://eips.ethereum.org/EIPS/eip-777).
- William Entriken, Dieter Shirley, Jacob Evans, Nastassia Sachs, "EIP-721: Non-Fungible Token Standard," Ethereum Improvement Proposals, no. 721, January 2018. [Online serial]. Available: [https://eips.ethereum.org/EIPS/eip-721](https://eips.ethereum.org/EIPS/eip-721).
- Witek Radomski, Andrew Cooke, Philippe Castonguay, James Therien, Eric Binet, Ronan Sandford, "EIP-1155: Multi Token Standard," Ethereum Improvement Proposals, no. 1155, June 2018. [Online serial]. Available: [https://eips.ethereum.org/EIPS/eip-1155](https://eips.ethereum.org/EIPS/eip-1155).
- Micah Zoltu ([@MicahZoltu](https://github.com/MicahZoltu)), "ERC-5114: Soulbound Badge [DRAFT]," Ethereum Improvement Proposals, no. 5114, May 2022. [Online serial]. Available: [https://eips.ethereum.org/EIPS/eip-5114](https://eips.ethereum.org/EIPS/eip-5114).
- [docs openzeppelin erc20](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20)
- [Fungible vs no fungible](https://medium.com/0xcert/fungible-vs-non-fungible-tokens-on-the-blockchain-ab4b12e0181a)
- [Estándar de token erc-777 -. ethereum.org](https://ethereum.org/es/developers/docs/standards/tokens/erc-777/)
- [¿Qué es el token ERC-1155 por bit2me - academy](https://academy.bit2me.com/que-es-token-erc-1155/)
- [EIPs](https://ethereum.org/es/eips/)
- [publicación tipos de token en Ethereum por Eustacio Cabrera](https://www.linkedin.com/feed/update/urn:li:activity:7026249768498511872/)
- [OpenZeppelin](https://www.openzeppelin.com/)
