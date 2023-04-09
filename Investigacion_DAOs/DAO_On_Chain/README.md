# DAO_On_Chain

- [DAO\_On\_Chain](#dao_on_chain)
  - [Procedimientos](#procedimientos)
  - [Compilación](#compilación)
  - [Test](#test)
  - [Cobertura](#cobertura)
    - [Cobertura 08/04/2023](#cobertura-08042023)

## Procedimientos

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
