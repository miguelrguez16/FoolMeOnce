# Hardhat Project - First Prototype

Para esta version comenzaremos a utilizar una de las famosos entornos de desarrollo. Permitirá compilación, despliegue y test en ganache

## Instalación

Requerimientos de la instalación:
1. [Node y npm](https://nodejs.org/en/): Última versión estable: 18.14.2
   2. Se puede utilizar [NVM](https://github.com/nvm-sh/nvm) el cual permite manejar múltiples versiones de node js (recomendado)
2. Instalación de hardhat
```shell
$> nvm use 18.14.2 // nos situamos en la version correspondiente de nodejs

# Instalamos Hardhat
$> npm install --save-dev hardhat //seguimos

# Iniciamos un proyecto de Hardhat
$>  npx hardhat
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

Welcome to Hardhat v2.12.7

√ What do you want to do? · Create a JavaScript project
√ Hardhat project root: · ..\epi-foolmeonce\First_Protype
√ Do you want to add a .gitignore? (Y/n) · y

You need to install these dependencies to run the sample project:
  npm install --save-dev "hardhat@^2.12.7" "@nomicfoundation/hardhat-toolbox@^2.0.0"

Project created
# Instalamos la dependencia requerida
$> npm install --save-dev "hardhat@^2.12.7" "@nomicfoundation/hardhat-toolbox@^2.0.0"

# Instalamos la biblioteca de OpenZepellin para hacer uso de librerías
$> npm install @openzeppelin/contracts
```



## Comandos básicos de HardHat

```shell
npx hardhat help # Ayuda de Hardhat
npx hardhat test # Lanzar Test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js # Lanzar Deploy
```

## Comandos para hardhat
### 1. Arranque de la Blockchain de desarrollo local

`$ npx hardhat node`

### 2. Conectar las cuentas del blockchain de desarrollo a Metamask

- Copiar la clave privada de las direcciones e importarla a Metamask
- Conecta tu metamask al hardhat blockchain, 127.0.0.1:8545.

### 3. Migrar los Smart Contracts

`npx hardhat run src/backend/scripts/deploy.js --network ganache`

### 4. Ejecutar los Tests

`$ npx hardhat test`

## Referencias

- [Node y npm](https://nodejs.org/en/)
- [NVM](https://github.com/nvm-sh/nvm)
- [hardhat](https://www.npmjs.com/package/hardhat?activeTab=readme)
