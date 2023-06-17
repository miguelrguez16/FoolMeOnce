# Deploy DAO on Ganache and Vote for One of them

- [Deploy DAO on Ganache and Vote for One of them](#deploy-dao-on-ganache-and-vote-for-one-of-them)
  - [Introducción](#introducción)
  - [Comandos](#comandos)
    - [Levantar BlockChain Ganache CLI](#levantar-blockchain-ganache-cli)
    - [Despliegue dao](#despliegue-dao)
    - [Proceso Dao](#proceso-dao)

## Introducción

## Comandos

### Levantar BlockChain Ganache CLI

`yarn ganache`

### Despliegue dao

`yarn hardhat run .\deploy\Ganache\deployDao.ts --network ganacheCli`

### Proceso Dao

`yarn hardhat run .\deploy\Ganache\exampleVote.ts --network ganacheCli`
