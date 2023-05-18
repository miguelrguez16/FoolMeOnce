# Coste de despliegues

- [Coste de despliegues](#coste-de-despliegues)
  - [Inicio](#inicio)
    - [Requisitos](#requisitos)
    - [Instalación](#instalación)
      - [Truffle](#truffle)
      - [Inicio de un proyecto truffle](#inicio-de-un-proyecto-truffle)
      - [Instalación de la librería Open Zeppelin](#instalación-de-la-librería-open-zeppelin)
  - [Compilación](#compilación)
  - [Desplegar contratos](#desplegar-contratos)
    - [Importante](#importante)

En este apartado se presentará el coste de despliegue de la DAO
Haciendo uso de la herramienta truffle, muy parecida a hardhat pero más simple.

## Inicio

### Requisitos

Se necesita tener Nodejs y npm instalado para los siguientes apartados

`$ npm --version`
9.1.2
`$ node --version`
v18.15.0

### Instalación

#### Truffle

`$ npm install truffle`

#### Inicio de un proyecto truffle

`$ npx truffle init`

Esto nos creara el archivo de configuración por defecto que necesita truffle con la definición de parámetros como la version de solidity o la red de despliegue.

#### Instalación de la librería Open Zeppelin

`$ npm install @openZeppelin/contracts`

## Compilación

`$ npx truffle compile`

## Desplegar contratos

`$ npx truffle deploy`

### Importante

El contrato de gobierno implica el uso de gran cantidad de código para la gestión de la DAO, por ello esta cantidad de datos implican también una cantidad de bytes a desplegar.
