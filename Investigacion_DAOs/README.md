# Investigación Prácticas DAOs

- [Investigación Prácticas DAOs](#investigación-prácticas-daos)
  - [Introducción](#introducción)
  - [Parte 1: Gobernanza con OpenZeppelin](#parte-1-gobernanza-con-openzeppelin)
    - [Partes DAO explicación](#partes-dao-explicación)
      - [Contrato 1. Governor.sol](#contrato-1-governorsol)
      - [Contrato 2. voto](#contrato-2-voto)
      - [Contrato 3. Control de tiempo (TimeLockController)](#contrato-3-control-de-tiempo-timelockcontroller)
      - [Contrato 4. Sobre el que se ejecutara la DAO](#contrato-4-sobre-el-que-se-ejecutara-la-dao)
  - [Referencias](#referencias)

## Introducción

En este apartado se realizarán varias investigaciones y una implementación funcional de una DAO siguiendo el modulo de gobernanza ofrecido por OpenZeppelin

## Parte 1: Gobernanza con OpenZeppelin

OpenZeppelin ofrece un servicio de librería de contratos, implementaciones de los EIPs y un mantenimiento de estos. Además ofrecen una herramienta con la que crear una DAO, [openzeppelin wizzard](https://docs.openzeppelin.com/contracts/4.x/wizard).

En esencia una DAO como es [COMPOUND](https://compound.finance/) necesita cuatro contratos principales:

1. Contrato de Gobernanza
2. Contrato que funcione como voto
3. Contrato para el control de tiempo
4. Contrato sobre el que se ejecutarán el conjunto de acciones de gobernanza.

### Partes DAO explicación

#### Contrato 1. Governor.sol

Governor es un conjunto de contratos para la gobernanza en cadena, su núcleo implementa una interfaz IGovernor.sol con las operaciones básicas de una DAO:

- Propuesta, Votación, ejecución
- Configuración de tiempos para la votación

#### Contrato 2. voto

Para que el conjunto de la comunidad posea votos se utiliza los estándares ERC20 o ERC721, existen derivados especiales como el ERC20Votes. El derivado de ERC20 brinda la posibilidad de establecer puntos de control para contabilizar el número de tokens que poseen los usuarios antes y después de la votación.

#### Contrato 3. Control de tiempo (TimeLockController)

Este contrato se posiciona como dueño o owner del contrato sobre el que se va a ejecutar la gobernanza, de esta manera, cuando se requiera como en nuestro caso aprobar una promesa electoral, los usuarios llamarían a la función correspondiente al contrato de ElectoralManager creado para verificar una promesa.

Además comprende una segunda tarea, en su inicio se encarga de indicar el conjunto de personas que se permiten proponer y el conjunto de ejecutores, estos dos grupos son los encargados de generar nuevas propuestas y los que una vez aprobada una propuesta mandan la orden de ejecución, respectivamente.

#### Contrato 4. Sobre el que se ejecutara la DAO

Se necesita el contrato sobre el que la gobernanza tendrá su peso en este caso ElectoralManager, este contrato una vez desplegado tendrá como owner y administrador el contrato TimeLocker.

El traspaso de "poder" sobre el contrato a gobernar servirá para el proceso de verificación de las promesas, esta función sobre la que se ejecutará la verificación se marcará con el modificador onlyOwner, de esta manera, se permite la gobernanza sobre la verficacion de las promesas. El resto de funciones seguirán siendo igual de accesibles.

## Referencias
