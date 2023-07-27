# Lenguajes de programación para Smart Contracts Solidity-Vyper
<!-- markdownlint-disable MD033 -->
<html><style>*{scroll-behavior:smooth}</style></html>

## Contenido

- [Lenguajes de programación para Smart Contracts Solidity-Vyper](#lenguajes-de-programación-para-smart-contracts-solidity-vyper)
  - [Contenido](#contenido)
  - [Introducción](#introducción)
  - [Entonces cual elegir](#entonces-cual-elegir)
  - [Fuentes](#fuentes)

## Introducción

Existen varios lenguajes de programación que permiten la creación de Smart Contracts, los lenguajes más populares son Solidity y Vyper, aunque para programadores con más experiencia puede también utilizarse Yul.
En base a la experiencia y al objetivo que desea conseguir con dicho programa.

Hablemos de Solidity y de Vyper:

![ Solidity  - v0.8.18](https://img.shields.io/static/v1?label=Solidity&message=v0.8.18&color=5208F0&logo=solidity)

Este lenguaje de programación con influencia de C++, Python y JavaScript, lenguaje tipado, avanza en mejoras a gran velocidad (en el momento de empezar a investigar y aprender, la última versión lanzada era la 0.8.13. a principios de noviembre haya ahora está por la 0.8.17, en el momento de escribir este texto) suelen sacar una cada mes. Este lenguaje se acerca bastante a lo aprendido en la carrera, ya que permite la herencia, el uso de bibliotecas externas, uso tipos creados por el usuario (que son más complejos). Además, posee una gran biblioteca de documentación para la creación de Smart Contracts, con ejemplos, recursos para principiantes, también muy importante posee un IDE a la medida creado en especial para este lenguaje, se llama Remix IDE.

En antiguas versiones, Solidity tenia problemas de seguridad debido al _OverFlow_ de las variables, el cual no estaba controlado, pero en la última versión menor, la 0.8.0, viene con una biblioteca de código llamada SafeMath que protege los contratos de este Overflow.

Gracias a la gran popularidad de este lenguaje se conocen sus flaquezas permitiendo al programador auditar este contratos de manera segura.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13
contract HelloWorld {

    string greeting;

    constructor() {
        greeting = "Hello, World.";
    }

    function sayHi() public pure {
         return greeting;
    }
}
```

![ Vyper- v0.3.7](https://img.shields.io/static/v1?label=Vyper&message=v0.3.7&color=5208F0&logo=vyper)

Vyper se trata de un lenguaje Pythonic, con un fuerte tipado, que contiene menos características que Solidity. Por ejemplo, no permite la herencia, ni los modificadores de funciones, debido a que su objetivo es la creación de contratos seguros y fáciles de auditar.

```vyper
greeting: public(bytes[32])

@public
def __init__(): # constructor
    self.greeting = "Hello, World."

@public
@constant
def printGreeting() -> bytes[32]:
    return self.greeting

```

En una prueba que podemos repetir de [youtube](https://www.youtube.com/watch?v=sbc74oU94FM) se comparan el coste en gas (hablaremos del gas más adelante) de un mismo contrato escrito en diferentes lenguajes. El gas en términos cortos, es una medida de coste. El video analiza Solidity Vyper y Yul, la diferencia entre los dos primeros para la optimización de gas, principalmente, viene en el despliegue, más en concreto, en el uso de la memoria. Solidity cuando se hace el despliegue del contrato crea un puntero de memoria libre para almacenar cualquier cosa que el usuario/contrato necesite, esto no pasa en Vyper debido a que no utiliza memoria dinámica, esto tiene sus pros en optimización pero un contra para los programadores cuando no saben cuantos datos van a guardar por ejemplo en el caso de una colección de NFTs. (Se hablará del Gas más adelante)

## Entonces cual elegir

Vyper tiene un lenguaje amigable, su objetivo es la seguridad y tiene un óptimo consumo de gas. Pero la comunidad que hay detrás de Solidity es enorme comparada con Vyper, todo lo achacable de falta de seguridad lo mejora [OpenZepellin](https://www.openzeppelin.com/) como estándar de seguridad para las aplicaciones de la BlockChain. Vyper no posee un IDE especializado como es RemiX IDE (aunque se puede escribir código y compilarlo en este). Vyper al no permitir la herencia, elimina el uso de estándares compartidos en Ethereum como son el ERC20 o el propio de los NFTs. Por ello y como estudio de TFG me centraré en el desarrollo principal en este lenguaje, no quiere decir que todo código sea en Solidity puede que algunos de los Smart Contracts independientes, como estudiaré en un futuro el uso de Proxies para desplegar nuevas versiones, hago uso de Vyper.

## Fuentes

- [Página de Ethereum](https://ethereum.org/es/developers/docs/smart-contracts/languages/)
- [bit3me academy](https://academy.bit2me.com/top-5-de-lenguajes-de-programacion-de-smart-contracts/)
- [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook)
- [Vyper vs Solidity](https://iglu.net/vyper-vs-solidity/)
- [Documentación Solidity](https://docs.soliditylang.org/en/latest/)
- [Documentación Vyper](https://vyper.readthedocs.io/en/latest/)
- [Video diferencia coste gas lenguajes](https://www.youtube.com/watch?v=sbc74oU94FM)
