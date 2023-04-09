# DAO_On_Chain

- [DAO\_On\_Chain](#dao_on_chain)
  - [Procedimientos](#procedimientos)
  - [Instalación](#instalación)
  - [Compilación](#compilación)
  - [Test](#test)
  - [Cobertura](#cobertura)
    - [Cobertura 08/04/2023](#cobertura-08042023)
  - [Deploy DAO](#deploy-dao)
    - [Realizar el deploy](#realizar-el-deploy)

## Procedimientos

## Instalación

Para proceder con la instalación de las bibliotecas una vez clonado este repositorio

`$> yarn`

Si se require realizar el proceso total ver el archivo [ARRANQUE](ARRANQUE.md)

## Compilación

`$> yarn hardhat compile --show-stack-traces`

## Test

`$> yarn hardhat test .\test\ElectoralManager.ts`

## Cobertura

`$> yarn hardhat coverage`

### Cobertura 08/04/2023

Test correctos para proceder con el lanzamiento de la DAO
File                    |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------------|----------|----------|----------|----------|----------------|
 ElectoralManager\      |    97.62 |    70.83 |      100 |    98.15 |                |
  DataInfo.sol          |      100 |      100 |      100 |      100 |                |
  ElectoralManager.sol  |      100 |      100 |      100 |      100 |                |
  ElectoralPromise.sol  |    95.24 |    56.25 |      100 |     96.3 |            113 |
  IElectoralPromise.sol |      100 |      100 |      100 |      100 |                |
All files               |    97.62 |    70.83 |      100 |    98.15 |                |

> La linea marcada **113** como con falta de cobertura es imposible de alcanzar.

## Deploy DAO

Para esta parte de verificación en la que perfectamente podría entrar también la parte de tiempo de legislatura, solo se implementará para la verificación. Quedaría como una mejora a futuro.

### Realizar el deploy

Primero: se despliega el contrato que funciona como voto, es decir, nuestro ElectoralToken.
