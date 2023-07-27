# BlockChain dedicadas al despliegue de aplicaciones descentralizadas

- [BlockChain dedicadas al despliegue de aplicaciones descentralizadas](#blockchain-dedicadas-al-despliegue-de-aplicaciones-descentralizadas)
  - [Introducción](#introducción)
  - [Despliegue de un Token ERC20](#despliegue-de-un-token-erc20)
  - [Despliegue Plataforma FoolMeOnce: Creación y Verificación de Promesas Electorales](#despliegue-plataforma-foolmeonce-creación-y-verificación-de-promesas-electorales)
    - [Resumen Costes](#resumen-costes)
  - [Otras Redes Blockchain](#otras-redes-blockchain)
    - [Polygon](#polygon)
    - [Avalanche](#avalanche)
    - [Binance](#binance)
      - [La prueba de autoridad (PoA)](#la-prueba-de-autoridad-poa)
    - [Conclusiones y mejoras](#conclusiones-y-mejoras)
  - [Referencias](#referencias)

## Introducción

La plataforma ha sido creada bajo el protocolo Ethereum y su criptomoneda ETH, implica un problema, el precio de la moneda es alto, lo que implica que desplegar contratos o aplicaciones complejas sea costoso.

Para ilustrar este coste se puede hacer uso de la herramienta **Truffle**, muy parecida a Hardhat, esta permite desplegar Smart Contracts tanto en una red simulada, en una red de test (testnet) o también en una red como es Ethereum (una mainnet); en esta muestra se realizará sobre Ganache.

Ganache es una herramienta de simulación de la cadena de bloques de Ethereum, la cual dispone de una interfaz de usuario sencilla y visual, también brinda un conjunto de cuentas con Ethereum.

## Despliegue de un Token ERC20

Haciendo uso de la herramienta truffle, se despliega un contrato tipico el del token ERC20:

```bash
Compiling your contracts...
===========================
> Compiling .\contracts\ERC20.sol
> Compiling .\contracts\ERC20.sol
> Compiling .\contracts\customERC20.sol
> Compiling .\contracts\customERC20.sol
> Artifacts written to C:\...\build\contracts
> Compiled successfully using:
   - solc: 0.8.4+commit.c7e474f2.Emscripten.clang

   > block timestamp:     1673256127
   > account:             0xCD052B05A4Ee665b3A7977eF3B3DB8b2660018E9
   > balance:             497.99330252
   > gas used:            1455373 (0x16350d)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02910746 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.02910746 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.02910746 ETH
```

Truffle en su proceso de despliegue muestra el coste final en "ethers", a día 29 de abril del 2023, el coste de un ether es de 1710,00€, esto supone un coste de 49,77€. En enero de este mismo año el precio de despliegue se encontraba en 38,18€, el ether estaba sobre los 1311€.

¿Pero y que pasa con aplicaciones más grandes?¿Qué coste se asumiría en el caso de desplegar la plataforma de FoolMeOnce completa, con la DAO, en Ethereum?

## Despliegue Plataforma FoolMeOnce: Creación y Verificación de Promesas Electorales

Al igual que con el token ERC20 se ilustrará una prueba con el coste de despliegue del conjunto de contratos que conforman el backend de la plataforma y se incluirá también la DAO creada. Por tanto, se tendrán que desplegar el siguiente conjunto de contratos:

- ElectoralManager: funcionalidad creación y verificación de promesas
- ElectoralToken: poder de voto de la DAO
- GovernorContract: funcionalidad de voto, propuestas, ...
- TimeLock: control

```bash

Compiling your contracts...
===========================
...
> Compiling .\contracts\ElectoralManager\DataInfo.sol
> Compiling .\contracts\ElectoralManager\ElectoralManager.sol
> Compiling .\contracts\ElectoralManager\ElectoralPromise.sol
> Compiling .\contracts\ElectoralManager\IElectoralPromise.sol
> Compiling .\contracts\Gobierno\ElectoralToken.sol
> Compiling .\contracts\Gobierno\Estandar\GovernorContract.sol
> Compiling .\contracts\Gobierno\Estandar\TimeLock.sol
> Artifacts written to C:\Users\migue\OneDrive\Escritorio\epi-foolmeonce\Pruebas\Despliegue_Dao_Coste\build\contracts
> Compiled successfully using:
   - solc: 0.8.17+commit.8df45f5f.Emscripten.clang


Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

   Deploying 'ElectoralToken'
   ----------------------------
   ....
   > total cost:          0.03652668 ETH


   Deploying 'ElectoralManager'
   ----------------------------
   ....
   > total cost:          0.03684388 ETH


   Deploying 'GovernorContract'
   ----------------------------
   ....
   > total cost:          0.069549 ETH


   Deploying 'TimeLock'
   ----------------------------
   ....
   > total cost:          0.03701132 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.17993088 ETH

Summary
=======
> Total deployments:   4
> Final cost:          0.17993088 ETH
```

El coste total del despliegue, solo el despliegue de los contratos, sin realizar ningún procedimiento de configuración son 0.17993088 ETH, pasado a euros, se queda en unos 307,68€, un precio muy alto.

### Resumen Costes

| Contrato         | Coste ETH  | Coste euros |
| ---------------- | ---------- | ----------- |
| ElectoralToken   | 0.03652668 | 62,46 €     |
| ElectoralManager | 0.03684388 | 63,00 €     |
| GovernorContract | 0.069549   | 118,93      |
| TimeLock         | 0.03701132 | 63,29 €     |
| Total            | 0.17993088 | 307,68 €   |

## Otras Redes Blockchain

Existen otras redes blockchain creadas para el despliegue de aplicaciones, donde su objetivo es ser escalables y más baratas

Algunas de ellas son:

- Polygon:
- Avalanche
- Binance

### Polygon

Este proyecto, de previo nombre MATIC, propone una solución de escalabilidad, permitiendo ejecutar en su red una gran cantidad de transacciones a menor coste. Con el nacimiento de las aplicaciones descentralizadas, las ICO y las DeFi, la red de Ethereum tenia un problema, no era capaz de gestionar este gran flujo de transacciones.

La solución que ofrece Polygon es posicionarse por encima de Ethereum. De esta manera se tendría una red blockchain con dos capas, donde la inferior, la capa 1, es Ethereum y la capa 2, o sidechain, es Polygon.
![Imagen](https://raw.githubusercontent.com/maticnetwork/whitepaper/master/matic-architecture.png)
Los usuarios realizan el conjunto de transacciones, despliegues, etc mediante la red de Polygon, la cual cuenta con un conjunto de validadores que utilizan el protocolo de consenso de prueba de participación. Además, cada cierto tiempo, el conjunto de transacciones generadas en la sidechain serán llevadas a la red de Ethereum. Este traspaso se lleva a cabo reuniendo el conjunto de hashes de cada transacción y generando un único hash mediante el árbol de Merkel.

![árbol](https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Hash_Tree.svg/1280px-Hash_Tree.svg.png)

Lo que hace tan rápido, fiable y barato a Polygon, no solo es que utilice Proof of Stake y su propia red de validación, sino que Polygon utilizando el árbol de Merkel sobre el conjunto de transacciones de varios bloques, solo guarda el hash raíz del conjunto de transacciones, en la red de Ethereum. Con esto se consigue, evitar guardar cientos de transacciones en ethereum solo salvando un hash de ellas.

### Avalanche

Se trata de un red blockchain con altas capacidades, permitiendo alta escalabilidad y tiempos para la confirmación de transacciones [mínimos](https://decrypt.co/es/resources/que-es-avalanche-network-avax-el-competidor-flexible-de-ethereum). llegando a asegurar las [4500 transacciones por segundo](https://decrypt.co/es/resources/que-es-avalanche-network-avax-el-competidor-flexible-de-ethereum)

Al contrario que Polygon esta no se apoya en Ethereum sino que se compone de uns sistema formado por tres redes blockchain distintas, y que mediante subredes permiten la interoperatividad entre ellas

Las tres blockchain son:

- X-Chain (Exchange Chain): especifica para activos digitales.
- P-Chain (Platform Chain): Organiza a los validadores y se encarga de crear otras redes más pequeñas.
- C-Chain (Contract Chain): sus nodos siguen una implementación de la máquina virtual de Ethereum y permite la creación de contratos inteligentes.

Otra diferencia que distingue a Avalanche, es su protocolo de consenso "Snowman", basado en el protocolo de prueba de participación, pero mejorado para ofrecer la escalabilidad y velocidad que Ethereum no ofrece. [consenso](https://learn.bybit.com/es/altcoins/what-is-avalanche-avax/)

Esta plataforma se rige por su token AVAX con la que también se puede hacer staking dentro de una de las redes.

Además, recientemente Amazon Web Service se ha asociado a Avalanche para impulsar

### Binance

Binance es una empresa dedicada al intercambio de criptomonedas o exchange, pero también posee una red blockchain, [presentada en 2018](https://www.binance.com/es/blog/all/binance-chain-la-blockchain-para-intercambiar-el-mundo-304219301536473088) para llevar su exchange a un entorno descentralizado (DEX: Exchange Descentralizado), esta red esta centrada en el intercambio de activos digitales ya sean criptomonedas, tokens, NFTs, ...

Su blockchain denominada Binance Smart Chain lanzada en 2020, especifica para contratos inteligentes, se lanzó de manera independiente pero posteriormente 2021 se unificaron en una, la **BNB Chain** donde el token que rige es **BNB**.

BNB Chain es una red más barata y rápida que Ethereum, pero se critica que no es tan descentralizada como la creada por Vitalik, este crítica de descentralización se debe a su protocolo de consenso, un híbrido entre Prueba de Participación (PoS) y Prueba de Autoridad (PoA).

#### La prueba de autoridad (PoA)

La prueba de autoridad (PoA) es un algoritmo de consenso donde los nodos de confianza, también llamadas validadores o autoridades, son entidades reales con una reputación, de esta manera garantizan la confianza para validad los bloques generados.

Según el medio [criptonoticias](https://www.criptonoticias.com/criptopedia/que-es-como-funciona-bnb-chain-ex-binance-smart-chain/) Binance posee 21 validadores en la fecha de realización del artículo, esta diferencia con el conjunto de validadores de Ethereum 2.0 ya sobrepasan los [400 000 validadores](https://www.criptonoticias.com/finanzas/cuanto-puede-ganar-validador-ethereum-20/#:~:text=Al%20momento%20de%20redacci%C3%B3n%20de,de%204%2C5%25%20aproximadamente.) de aquí que se critique la descentralización.

[bnb](https://www.bloomberglinea.com/2022/11/08/binance-y-bnb-chain-cual-es-la-diferencia/#:~:text=La%20BNB%20Chain%2C%20que%20significa,de%20Web3%20y%20sus%20aplicaciones.)

### Conclusiones y mejoras

Pensando a futuro, en el caso de un despliegue más atractivo para el bolsillo se debería de valorar el despliegue de la plataforma en una red que permita dApps escritas en Solidity (así se evita migrar la aplicación) y barata para los politicos que deseen crear sus promesas y los usuarios que participen en la DAO.

## Referencias

- POLYGON <https://polygon.technology/>
- AVALANCHE <https://www.avax.network/>
- BINANCE
- [Prueba de Autoridad](https://es.wikipedia.org/wiki/Prueba_de_autoridad)
