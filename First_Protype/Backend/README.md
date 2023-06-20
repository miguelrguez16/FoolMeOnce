# Hardhat Project - First Prototype

Para esta version comenzaremos a utilizar una de las famosos entornos de desarrollo. Permitirá compilación, despliegue y test en ganache

- [Hardhat Project - First Prototype](#hardhat-project---first-prototype)
  - [Instalación](#instalación)
  - [Backend](#backend)
    - [Instalamos Hardhat](#instalamos-hardhat)
    - [Iniciamos un proyecto de Hardhat](#iniciamos-un-proyecto-de-hardhat)
    - [Instalamos la dependencia requerida](#instalamos-la-dependencia-requerida)
    - [Instalamos la biblioteca de OpenZeppelin para hacer uso de librerías](#instalamos-la-biblioteca-de-openzeppelin-para-hacer-uso-de-librerías)
    - [Comandos HardHat](#comandos-hardhat)
      - [Básicos](#básicos)
      - [Compilacion](#compilacion)
      - [Arranque de la Blockchain de desarrollo local](#arranque-de-la-blockchain-de-desarrollo-local)
      - [Conectar las cuentas del blockchain de desarrollo a Metamask](#conectar-las-cuentas-del-blockchain-de-desarrollo-a-metamask)
      - [Migrar los Smart Contracts a GANACHE UI](#migrar-los-smart-contracts-a-ganache-ui)
      - [Ejecutar los Tests](#ejecutar-los-tests)
      - [Comprobar cobertura de los test](#comprobar-cobertura-de-los-test)
    - [Generar diagrama UML del código](#generar-diagrama-uml-del-código)
    - [Deploy in ganache](#deploy-in-ganache)
  - [Front](#front)
  - [Referencias](#referencias)

## Instalación

Requerimientos de la instalación:

1. [Node y npm](https://nodejs.org/en/): Última versión estable: 18.14.2 2. Se puede utilizar [NVM](https://github.com/nvm-sh/nvm) el cual permite manejar múltiples versiones de node js (recomendado)
2. Instalación de hardhat

`$> nvm use 18.14.2 // nos situamos en la version correspondiente de nodejs`

## Backend

### Instalamos Hardhat

`$> npm install --save-dev hardhat //seguimos`

### Iniciamos un proyecto de Hardhat

```shell
$>  npx hardhat

  Welcome to Hardhat v2.12.7

  √ What do you want to do? · Create a JavaScript project
  √ Hardhat project root: · ..\epi-foolmeonce\First_Protype
  √ Do you want to add a .gitignore? (Y/n) · y

  You need to install these dependencies to run the sample project:
    npm install --save-dev "hardhat@^2.12.7" "@nomicfoundation/hardhat-toolbox@^2.0.0"

  Project created
```

### Instalamos la dependencia requerida

`$ > npm install --save-dev "hardhat@^2.12.7" "@nomicfoundation/hardhat-toolbox@^2.0.0"`

### Instalamos la biblioteca de OpenZeppelin para hacer uso de librerías

`$> npm install @openzeppelin/contracts`

### Comandos HardHat

#### Básicos

```shell
npx hardhat help # Ayuda de Hardhat
npx hardhat test # Lanzar Test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js # Lanzar Deploy
```

#### Compilacion

`$ npx hardhat compile --show-stack-traces`

#### Arranque de la Blockchain de desarrollo local

`$ npx hardhat node`

#### Conectar las cuentas del blockchain de desarrollo a Metamask

- Copiar la clave privada de las direcciones e importarla a Metamask
- Conecta tu metamask al hardhat blockchain, 127.0.0.1:7545.

#### Migrar los Smart Contracts a GANACHE UI

`npx hardhat run ./scripts/deployFirstPrototype.js --network ganache`

#### Ejecutar los Tests

`$ npx hardhat test`

#### Comprobar cobertura de los test

`$ npx hardhat coverage`

Este comando genera un reporte en la ruta donde se ejecuta el comando.

### Generar diagrama UML del código

`$ npm link sol2uml`

Ejecutar con:

`$ sol2uml .\Backend\contracts\ElectoralManager.sol`

### Deploy in ganache

`$ npx hardhat run .\Backend\scripts\deployFirstPrototype.js --network ganache`

## Front

## Referencias

- [Node y npm](https://nodejs.org/en/)
- [NVM](https://github.com/nvm-sh/nvm)
- [hardhat](https://www.npmjs.com/package/hardhat?activeTab=readme)
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts)
