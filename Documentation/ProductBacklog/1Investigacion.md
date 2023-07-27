# Investigación de los diferentes protocolos existentes aplicados a la tecnología BlockChain
<!-- markdownlint-disable MD033 -->
<html><style>*{scroll-behavior:smooth}</style></html>

- [Investigación de los diferentes protocolos existentes aplicados a la tecnología BlockChain](#investigación-de-los-diferentes-protocolos-existentes-aplicados-a-la-tecnología-blockchain)
  - [¿Qué es la _BlockChain_?](#qué-es-la-blockchain)
  - [Estructura de una Blockchain](#estructura-de-una-blockchain)
  - [¿Qué protocolos existen?](#qué-protocolos-existen)

## ¿Qué es la _BlockChain_?

La _BlockChain_ o cadena de bloques es un tipo de tecnología de libro mayor o DLT por sus siglas en ingles (_distributed ledger techonoloy_). Un DLT consiste en una lista simplemente enlazada, donde cada nodo se enlaza con otro mediante criptografía, estos nodos llamados bloques, guardan las transacciones realizadas en la red, además de ciertos metadatos que verifican la validez de dicho nodo.

## Estructura de una Blockchain

La estructura de una _BlockChain_ consta de:

- Una red de pares (P2P)
- Mensajes (transacciones)
- Un conjunto de reglas de consenso.
- Una maquina de estados (que procesa los mensajes o transacciones)
- Un algoritmo de consenso descentralizado (DAO: Decentralized Autonomous Organization)
- Una cadena de bloques criptográficamente segura.
- Un incentivo por la generación de nuevos bloques, que asegure la economía de las transacciones.

![20221128_110857](/uploads/a8c9b8605fbe2fa9cbe1ce33b820d957/20221128_110857.jpg)

## ¿Qué protocolos existen?

De entre los muchos protocolos que implementan la tecnología _BlockChain_ existen Bitcoin, Ethereum, Solana, principalmente.
Bitcoin fue concebido por un grupo de personas o una única persona bajo el nombre de Sathosi Nakamoto. Este protocolo busca un sistema de pago electrónico descentralizado basado en pruebas criptográficas, ver [whitepaper bitcoin](https://bitcoin.org/bitcoin.pdf)

A partir de ahora se diferenciarán tres características importantes: Tecnología,Protocolo y Token.
| Tecnología| BlockChain | BlockChain | BlockChain | BlockChain |
| ------ | ------ | ------ | ------ | ------ |
| Protocolo | Bitcoin | Ethereum | Solana | Cardano |
| Token | BTC | ETH | SOL | Ada |

¿Diferencias entre _Bitcoin_ , _Solana_, _Cardano_ y _Ethereum_?

Hay dos diferencias entre cada protocolo esencialmente, la forma en la que se genera un bloque y el tipo de lenguaje o script que se utilizada dentro del protocolo, ya sea para la ejecución del nodo o ejecución de un _Smart Contract_.
Empezando por el origen, por Bitcoin, siendo la primera implementación con una fuerte criptografía para el consenso, maneja unos scripts donde su lenguaje no fue pensado para el desarrollo de aplicaciones, su lenguaje no es Turing completo, no permite el uso de bucles, además su algoritmo de consenso es [_Proof of Work_](https://ethereum.org/es/developers/docs/consensus-mechanisms/pow/) (PoW), donde cada nodo compite por introducir un nuevo bloque en la red, lo que lo hace muy costoso en cuanto a consumo de energía se refiere.

En cuanto a **Ethereum**, recientemente este protocolo ha sido migrado mediante un fork en su cadena de bloques, pasando de un algoritmo de consenso por prueba de trabajo (PoW) a una [prueba de participación](https://ethereum.org/es/developers/docs/consensus-mechanisms/pos/) (_Proof of Stake_, PoS).
El _Proof of Stake_, consiste en la elección de un único nodo como generador de un bloque, este nodo se elige de manera aleatoria entre los demás nodos, pero aquellos nodos que posean mayor participación dentro de la red, tendrán una mayor probabilidad de ser elegidos. Siguiendo con la otra característica, que nos conviene en este caso, es decir, el lenguaje de programación, este protocolo consta de un lenguaje de alto nivel muy popular, _Solidity_, el cual posee un IDE llamado Remix IDE. También existe otro lenguaje que cogió bastante popularidad recientemente llamado _Vyper_.

Sobre **Solana**, este protocolo destaca por el número de transacciones que puede realizar por segundo, mejorando lo realizado en Ethereum, creando y validando miles y miles a cada segundo. También utiliza el algoritmo de consenso Proof Of Stake, pero contiene una mejora; las transacciones contienen una marca de tiempo que mejora el proceso de los validadores aumentando el rendimiento de la red. Para apoyar este consenso aplican un algoritmo más: [Proof of History](https://cryptorobin.es/proof-of-history-que-es-y-como-funciona/) se trata de un mecanismo basado en un concepto criptográfico llamado [Verifiable Delay Functions](https://cryptorobin.es/proof-of-history-que-es-y-como-funciona/) o VDF (o una sub-aplicación de esta), esta permite conocer el espacio de tiempo que hay entre las distintas transacciones permitiendo una validación sin la necesidad de sincronizar un bloque entero de transacciones. Los problemas de Solana son que no es ampliamente abierta, no se conocen al 100% que carteras tienen los mayores fondos como si pasa en otras redes, tuvo problemas de ataques DDos por lo que sufrió un par de apagones. Además esta red tiene un problema de legitimidad debido al escándalo por los problemas con el fundador del exchange descentralizado llamado FTX.

**Cardano** es un BlockChain de doble capa donde la primera se siguen las transacciones monetarias y en la segunda se ejecutan los contactos inteligentes ; aunque fue lanzada en 2017 estos contratos inteligentes no han podido ser ejecutados hasta el verano pasado. El lenguaje de programación que utilizan estos contratos, su principal es [Plutos](https://www.leewayhertz.com/smart-contracts-on-cardano/#What-programming-languages-does-Cardano-use-for-its-smart-contract-development?), basado en una librería de Haskell, el cual se trata de un lenguaje muy robusto creado para la alta seguridad, proporcionar un alto grado de certeza sobre que el código creado sea el correcto. El problema es que se trata de un lenguaje difícil de entender, que a mi parecer se asemeja más al código ensamblador que a C/C++.
