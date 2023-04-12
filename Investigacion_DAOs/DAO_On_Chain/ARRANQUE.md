# Arranque

- [Arranque](#arranque)
  - [Introducción](#introducción)
  - [Problemas](#problemas)
  - [Inicio del Proyecto](#inicio-del-proyecto)
    - [Instalación Yarn](#instalación-yarn)
      - [Requisitos](#requisitos)
      - [Inicio de un proyecto con Yarn](#inicio-de-un-proyecto-con-yarn)
      - [Instalacion y Arranque hardhat](#instalacion-y-arranque-hardhat)
    - [otras dependencias](#otras-dependencias)
  - [Lanzar DAO](#lanzar-dao)
    - [Primera ventana](#primera-ventana)
    - [Segunda ventana](#segunda-ventana)
  - [Proceso DAO](#proceso-dao)
    - [Preparación](#preparación)
    - [Propuesta](#propuesta)
    - [Votación](#votación)

## Introducción

Se seguirá para la instalación el siguiente enlace, se utilizará tanto typescript como el instalador de paquetes yarn
[new proyect hardhat](https://hardhat.org/tutorial/creating-a-new-hardhat-project)

## Problemas

Para esta parte del proyecto se cambiará de instalador de paquetes debido a problemas encontrados con npm en el intento de sobreescritura de librerías haciendo lento el proceso de desarrollo de aplicaciones. Por ello, se ha pasado a utilizar Yarn.

## Inicio del Proyecto

### Instalación Yarn

#### Requisitos

Para instalar yarn se sigue la siguiente referencia [guía instalación windows](https://yarnpkg.com/getting-started/install)

El único requisito imprescindible es tener node.js en version superior o igual a la 16.10,

Mi caso:
`$> node --version`
`v18.15.0`

Habilitamos corepack desde linea de comandos (modo administrador)
`$> corepack enable`

Y ya se podría comprobar la version de Yarn
`$> yarn --version`
`3.4.1`

#### Inicio de un proyecto con Yarn

`$> yarn init`

Este comando nos generará el archivo package.json por defecto:

```json
{
  "name": "DAO_On_Chain",
  "packageManager": "yarn@3.4.1",
}
```

Para crear un proyecto yarn en la carpeta actual crearemos un fichero vacío de nombre: **yarn.lock** para a continuación:
`$> yarn install`

#### Instalacion y Arranque hardhat

Añadimos la dependencia de hardhat
`$> yarn add --dev hardhat`

Iniciamos hardhat
`$>npx hardhat`

Con el que crearemos un proyecto TypeScript, este mismo arranque detectará que gestor de paquetes se está utilizando, de manera que indicará los comandos necesarios para proceder con la instalación de la paquetería necesaria

```bash
$> npx hardhat
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

Welcome to Hardhat v2.13.0

√ What do you want to do? · Create a TypeScript project
```

Como detecta el tipo de gestor de paquetes, nos arranca con ua configuración básica de ruta de proyecto y un gitignore. Además indica que dependencias añadir mediante yarn:

```bash
yarn add --dev "hardhat@^2.11.1" "@nomicfoundation/hardhat-toolbox@^2.0.0" "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-chai-matchers@^1.0.0" "@nomiclabs/hardhat-ethers@^2.0.0" "@nomiclabs/hardhat-etherscan@^3.0.0" "chai@^4.2.0" "ethers@^5.4.7" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.0" "@typechain/hardhat@^6.1.2" "typechain@^8.1.0" "@typechain/ethers-v5@^10.1.0" "@ethersproject/abi@^5.4.7" "@ethersproject/providers@^5.4.7" "@types/chai@^4.2.0" "@types/mocha@>=9.1.0" "@types/node@>=12.0.0" "ts-node@>=8.0.0" "typescript@>=4.5.0"
```

### otras dependencias

Se incluirá también la dependencia de openzeppellin contracts
`yarn add --dev @openzeppelin/contracts`

## Lanzar DAO

### Primera ventana

`yarn hardhat node`

### Segunda ventana

`yarn hardhat run .\deploy\01_deploy_electoralToken.ts --network localhost`
`yarn hardhat run .\deploy\02_deploy_timeLock.ts --network localhost`
`yarn hardhat run .\deploy\03_deploy_governorContract.ts --network localhost`
`yarn hardhat run .\deploy\04_configure_governorContract.ts --network localhost`
`yarn hardhat run .\deploy\05_deploy_electoralManager.ts --network localhost`

```
yarn hardhat run .\deploy\01_deploy_electoralToken.ts --network localhost |
yarn hardhat run .\deploy\02_deploy_timeLock.ts --network localhost |
yarn hardhat run .\deploy\03_deploy_governorContract.ts --network localhost |
yarn hardhat run .\deploy\04_configure_governorContract.ts --network localhost |
yarn hardhat run .\deploy\05_deploy_electoralManager.ts --network localhost 
```

## Proceso DAO

### Preparación

`yarn hardhat run .\scripts\preparation_electoral_manager.ts --network localhost`

### Propuesta

`yarn hardhat run .\scripts\propose.ts --network localhost`

### Votación
