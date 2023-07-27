# Introducción
<!-- markdownlint-disable MD033 -->
<html><style>*{scroll-behavior:smooth}</style></html>
En esta historia de usuario hablaré de las características de Ethereum, que partes lo hacen diferente pero entrando un poco más en detalle, hablaré de los Bloques, el Gas, el state, Criptografía, EVM, transacciones y cuentas en Ethereum.

## Tabla de Contenidos

- [Introducción](#introducción)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Bloques](#bloques)
    - [Bloque Génesis](#bloque-génesis)
    - [Transacciones en el bloque](#transacciones-en-el-bloque)
    - [Metadatos del bloque](#metadatos-del-bloque)
  - [Ethereum Virtual Machine](#ethereum-virtual-machine)
    - [Arquitectura de la EVM](#arquitectura-de-la-evm)
    - [Compilación de Smart Contracts](#compilación-de-smart-contracts)
      - [ABI y BYTECODE](#abi-y-bytecode)
  - [State](#state)
    - [¿Qué guarda cada árbol?](#qué-guarda-cada-árbol)
      - [Árbol de estado global](#árbol-de-estado-global)
      - [Árbol de almacenamiento de cuentas](#árbol-de-almacenamiento-de-cuentas)
      - [Árbol de transacciones](#árbol-de-transacciones)
        - [Transacciones](#transacciones)
      - [Árbol de recibos de las transacciones](#árbol-de-recibos-de-las-transacciones)
      - [Resumen gráfico de los árboles](#resumen-gráfico-de-los-árboles)
  - [Árbol de Merkle](#árbol-de-merkle)
    - [Merkle Patricia Trie (Árbol Merkle Patricia)](#merkle-patricia-trie-árbol-merkle-patricia)
      - [Radix tree](#radix-tree)
  - [Gas](#gas)
    - [Cómo consigo Gas](#cómo-consigo-gas)
    - [El gas en las transaciones](#el-gas-en-las-transaciones)
    - [Precio del Gas](#precio-del-gas)
  - [Criptografía, generación de cuentas y wallets](#criptografía-generación-de-cuentas-y-wallets)
    - [Nonce](#nonce)
      - [Gas en las transacciones](#gas-en-las-transacciones)
    - [Funciones Hash](#funciones-hash)
  - [Referencias](#referencias)

## Bloques

Los Bloques (blocks) son lo que conforma la cadena de Ethereum, son la esencia de la red Blockchain. Cada bloque almacena las transacciones de la red, ciertos datos importantes como el gas, un identificador único y el hash del anterior bloque. El conjunto de datos que almacena el bloque y la unión entre ellos hasta el bloque génesis o bloque cero permite la integridad y la trazabilidad de la BlockChain.

### Bloque Génesis

El bloque génesis de Ethereum ya minado en [2015](https://etherscan.io/block/0), define el comienzo de este protocolo y de la criptomoneda que la regula.

### Transacciones en el bloque

Las transacciones son grabadas en los bloques, por cada conjunto de transacciones se graba en un bloque.

Minar un bloque consta de rellenarlo de transacciones válidas y agregarlas a la red.

### Metadatos del bloque

Además de los datos ya mencionados como el identificador, las transacciones cada bloque contiene los siguientes datos:

- **timestamp**: hora en la que se minó el bloque.
- **blockNumber**: la longitud de la cadena de bloques en bloques.
- **baseFeePerGas**: la comisión mínima por gas necesaria para que una transacción se incluya en el bloque.
- **difficulty**: el esfuerzo empleado para minar el bloque.
- **totaldifficulty**: esfuerzo acumulado con el resto de bloques
- **mixHash**: un identificador único del bloque.
- **parentHash**: el único identificador del bloque anterior (esta es la manera en la que los bloques son enlazan en una cadena).
- **transactions**: las transacciones incluidas en el bloque.
- **stateRoot**: el estado entero del sistema; los saldos de las cuentas, el almacenamiento de contratos, el código de contratos y los nonces de las cuentas.
- **nonce**: un hash que, cuando se combina con mixHash, comprueba que el bloque ha pasado por una prueba de trabajo.

Como Ethereum ha pasado de un algoritmo de consenso de prueba de trabajo (PoW) a uno de prueba de participación (PoS) para la validación de los bloques, los metadatos correspondientes a la prueba de trabajo, es decir, mixHash y nonce ya no son necesarios y por ellos si chequeamos en etherscan (plataforma gratuita que permite visualizar datos de bloques, direcciones, ... sobre Ethereum) uno de los últimos bloques generados a fecha 03/02/2023 el número de boque [16548688](https://etherscan.io/block/16548688) veremos que estos dos valores son cero. Además también el valor asociado a la dificultad, que es una medida para PoW que trata de contabilizar de manera estadística el número de hashes necesarios para minar un bloque. Desde el cambio de consenso la dificultad está en uno.

## Ethereum Virtual Machine

Cada operación que genera un cambio sobre la red de Ethereum o simplemente es una consulta, es ejecutado sobre la máquina virtual de Ethereum o la EVM, una máquina casi Touring Completa.

¿Por qué casi completa?
Debido al Gas, este término se explica más adelante, pero un resumen, gracias al gas que actua como limite de ejecución convierte la máquina en _quasi_ completa

La EVM se asemeja bastante a la conocida JVM (Java Virtual Machine), en cuanto a comportamiento, ya que abstrae la ejecución independientemente del hardware y software sobre el que corre. Su ejecución es singlethread (monohilo) y procesa las transacciones una a una. Las transacciones son la causa de un cambio de estado, que en primera instancia no son más que instrucciones, que como indico más adelante van firmadas, permitiendo la identificación de la cuenta.

### Arquitectura de la EVM

La máquina virtual tiene una arquitectura de máquina de pila (stack machine), que funciona con tamaños de palabras de 256 bits -> 2^8 -> este tamaño está optimizado para las operaciones de hash y la generación de claves privadas mediante el algoritmo de curva elíptica y está formado por tres componentes:

- Una ROM de código (inmutable): aquí se cargará el Bytecode de los contratos inteligentes.
- Una memoria volátil (RAM): inicializada a cero
- Una memoria de almacenamiento permanente donde almacenará el estado de ethereum, tambien se inicializa a cero.
- También hay una serie de variables globales y datos que están disponibles durante la ejecución como son msg.value y msg.sender

![arquitectura EVM](https://raw.githubusercontent.com/ethereumbook/ethereumbook/develop/images/evm-architecture.png)

### Compilación de Smart Contracts

Antes de continuar, con la EVM, se debe mencionar que es exactamente lo que ejecuta la máquina virtual y también de donde viene.
Lo que la máquina entiende es una representación de bajo nivel (ensamblador) de los contratos, denominado Ethereum Bytecode pero al igual que pasa en otros lenguajes de programación como son Java, C/C++, los Smart Contracts, escritos ya sea en Solidity o Vyper, se deben compilar en un lenguaje que entienda la máquina, es decir, traducirlos a bajo nivel (el bytecode). Si trabajamos con Solidity podemos optener un ejemplo mediante **solc**, el compilador, que se instala en linux con los siguientes comandos:

```bash
  sudo add-apt-repository ppa:ethereum/ethereum
  sudo apt-get update
  sudo apt-get install solc

# Versión del compilador:
  miguel@ANDUIN:~/solidity_compiler_pruebas$ solc --version
  solc, the solidity compiler commandline interface
  Version: 0.8.18+commit.87f61d96.Linux.g++
```

Tendremos el siguiente código de ejemplo, escrito en la última versión, el fichero se denomina Prueba.sol

```Solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18; // version del contrato

contract Prueba { // nombre del contrato

  uint256 valor; // estado del contrato
                 // en este caso una variable entera sin signo

  // funcion publica que modifica el estado
  function guardarSaludo(uint256 _nuevoValor) public {
          valor = _nuevoValor;
  }
}
```

Para compilar el Smart Contract en el lenguaje que entiende la máquina, podemos hacer un paso intermedio y ver las intrucciones a más bajo nivel, que en inglés se denominan **opcodes**, podemos utilzar el siguiente comando del compilador:

```bash
solc --opcodes prueba.sol
```

Esta instruccion nos muestra por salida estándar las instrucciones que ejecutará la EVM con dicho contrato, por lo tanto podemos hacer lo siguiente:

```bash
solc --opcodes prueba.sol > opcodesPruebaSol.txt
```

Podremos visualizarlo:

```bash
miguel@ANDUIN:~/solidity_compiler_pruebas$ cat opcodesPruebaSol.txt

======= prueba.sol:Prueba =======
Opcodes:
PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0xE3 DUP1 PUSH2 0x1F PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH1 0xF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH1 0x28 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x41396CE6 EQ PUSH1 0x2D JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x43 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH1 0x3F SWAP2 SWAP1 PUSH1 0x85 JUMP JUMPDEST PUSH1 0x45 JUMP JUMPDEST STOP JUMPDEST DUP1 PUSH1 0x0 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x65 DUP2 PUSH1 0x54 JUMP JUMPDEST DUP2 EQ PUSH1 0x6F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH1 0x7F DUP2 PUSH1 0x5E JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH1 0x98 JUMPI PUSH1 0x97 PUSH1 0x4F JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH1 0xA4 DUP5 DUP3 DUP6 ADD PUSH1 0x72 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 0xB3 SSTORE 0xCC PUSH14 0x8D500E80DD34EE0262C03DBD8294 0x27 JUMPI 0xC6 LT BALANCE 0xA9 PUSH30 0x25274E9AD3338464736F6C63430008120033000000000000000000000000
```

Como vemos hay operaciones de pila: PUSH1, POP, pero también tenemos operaciones aritmeticas como ADD y muchas más.
Aunque este conjunto de opcodes no es lo que entienda la EVM, es lo más cercano que pueda entender el ser humano ya que lo que se acaba desplegando en la red de Ethereum es el denominado **BYTECODE** y también mencionaremos el ABI de un contrato.

#### ABI y BYTECODE

El bytecode a partir de los OPcode es sencillo, solo necesitamos el parametro _--bin_ y lo tendremos:

```Shell
miguel@ANDUIN:~/solidity_compiler_pruebas$ solc --bin prueba.sol

======= prueba.sol:Prueba =======
Binary:
608060405234801561001057600080fd5b5060e38061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806341396ce614602d575b600080fd5b60436004803603810190603f91906085565b6045565b005b8060008190555050565b600080fd5b6000819050919050565b6065816054565b8114606f57600080fd5b50565b600081359050607f81605e565b92915050565b6000602082840312156098576097604f565b5b600060a4848285016072565b9150509291505056fea2646970667358221220b355cc6d8d500e80dd34ee0262c03dbd82942757c61031a97d25274e9ad3338464736f6c63430008120033
```

Como podemos ver nos muestra en hexadecimal el código de nuestro Smart Contract Prueba.sol

El ABI o Application Binary Interface, se genera también con la compilación y el despligue del Smart Contrat, se expone en un archivo json los diferentes funciones que dispone el contrato, cada uno con sus parámetros, valores de retorno, ... se puede ver mediante la ejecución de la siguiente instrucción en la shell:

```bash
miguel@ANDUIN:~/solidity_compiler_pruebas$ solc --abi prueba.sol

======= prueba.sol:Prueba =======
Contract JSON ABI
[{"inputs":[{"internalType":"uint256","name":"_nuevoValor","type":"uint256"}],"name":"guardarSaludo","outputs":[],"stateMutability":"nonpayable","type":"function"}]
```

Este fichero es importante obtenerlo ya que se utilziará mediante las librerias web3.js o ethers.js para comunicar la interfaz web de las aplicaciones con el Smart Contract.

## State

El [state](https://medium.com/@eiki1212/ethereum-state-trie-architecture-explained-a30237009d4e) en la red de Ethereum, o estado, hace referencia al conjunto de todos los datos de la red, como se indica anteriormente en el apartado de los bloques, existe un valor denominado stateRoot. Este estado (state) guarda desde los saldos hasta el código de los contratos. El protocolo Ethereum es una gran máquina de estados, donde se guarda la transición entre los valores originales, cuentas y nuevas transacciones. Todo ello se lleva a cabo con la EVM (Ethereum Virtual Machine) el cual maneja un árbol de estados.

El árbol de estados está compuesto de cuatro partes:

- Árbol de estado global
- Árbol de transacciones
- Árbol de recibos de las transacciones
- Y un árbol de almacenamiento de las cuenta de Ethereum.

Cada uno de los árboles, está construido mediante una estructura de datos denominada: "Árbol de Merkle Patricia" y solo el nodo raíz es guardado en bloque (ahorrando almacenamiento).

![estados](https://i.stack.imgur.com/afWDt.jpg) From [Lee StakExchange](https://ethereum.stackexchange.com/questions/268/ethereum-block-architecture)

### ¿Qué guarda cada árbol?

#### Árbol de estado global

Se trata de um mapa de direcciones de Ethereun a cuentas de la misma, es decir, almacena estas direcciones (160 bits), que se actualiza con cada transaccion generada, la raiz de este árbol el stateRoot, es uno de los datos que se guardan en el bloque.

![Arbol de estado global](https://www.lucassaldanha.com/content/images/2018/12/Ethereum-diagrams.png)

#### Árbol de almacenamiento de cuentas

Esta ED almacena los datos de las cuentas con los siguientes datos:

- Balance de Ethers de la cuenta (valor en Weis)
- Nonce
  - Si es una [EOA](#criptografía-generación-de-cuentas-y-wallets) con el numero de transacciones realizadas
  - Si no es [EOA](#criptografía-generación-de-cuentas-y-wallets), se trata de una cuenta de contrato, por tanto, contabiliza el número de contratos creados.
- Si se trata de una cuenta para contratos:
  - Almacenamiento de la cuenta, almacenamiento permanente para los Smart Contract.
  - Almacenamiento para el código de la cuenta relacionada

[Pagina 303 - ethereum state](https://github.com/ethereumbook/ethereumbook)

#### Árbol de transacciones

Este árbol graba las transacciones de la red. Al igual que que pasaba con los otros árboles solo el nodo raiz es almacenado en el bloque generado.

##### Transacciones

Todo en la red de Ethereum, desde el traspaso de Ethers hasta la llamada a una función de un Smart Contract, comienza con una transacción, es lo único que hace que puede lanzar un cambio de estado en la máquina virtual de Ethereum (EVM).
Una transacción se compone de:

- Nonce: un número de secuencia generado por la cuenta que lo emite (una EOA), así se previene que la transacción no es duplicada.
- Precio gas (en wei): el precio en gas que el emisor está dispuesto a pagar
- Destinatario. (direccion de Ethereum)
- Valor: cantidad de Ether para la transacción.
- Datos: conjunto de datos de la transacción, de longitud variable
- v,r,s: son las tres variables que componen la firma digital generada por el ECDSA (Algoritmo de firma digital de curva elíptica) correspondiente a la dirección de origen (la EOA)

#### Árbol de recibos de las transacciones

Las transacciones cuando finalizan exitosamente producen un "recibo". Este recibo incluye los siguientes datos:

- El hash de la transacción
- identificador del neuvo bloque
- la cantidad de gas
- las direcciones involucradas

#### Resumen gráfico de los árboles

![arboles](https://www.lucassaldanha.com/content/images/2018/12/summary-final.png)

## Árbol de Merkle

Continuamente estamos hablando del árbol de merkle o del arbol de Merkle Patricia, el cual es una derivación del primero.
El árbol de Merkle: se trata de una método por el que generar un resumen único común a un conjunto de valores de entrada, aprovechandose de la grandes oportunidades que nos brindan las funciones resumen o [hash](#funciones-hash)
![arbolMerkle](https://upload.wikimedia.org/wikipedia/commons/9/95/Hash_Tree.svg)

### Merkle Patricia Trie (Árbol Merkle Patricia)

Con el fin de optimizar la búsqueda de elementos y mejorar el rendimiento en cuanto a almacenamiento se refiere, en Ethereum se utiliza un Merkle Patricia Trie, el cual, parte de un Radix tree.

#### Radix tree

Se trata de una estructura de datos, muy parecida a un árbol, pero donde su espacio es optimizado, cada nodo que solo contenga un hijo se fusiona con el padre.

En este caso, las claves de cada nodo son direcciones de Ethereum (en hexadecimal), cada nodo es una matriz de 16 elemento en hexadecimal, los nodos que nos son hoja es un hash calculado de sus nodos hijo.

Que pasa con este tipo de árboles que para una direccion con 160 bits el árbol crece demasiado en espacio de almacenamiento.
Para reducirlo de Radix Tree, se implementa la variabte Merkle Patricia Tree, donde los nodos se dividen en tres tipos:

- nodo de extensión: comprime los nodos utilizando prefijos comunes.
- nodo hoja: comprime los nodos utilizando prefijos únicos
- nodo rama: ídem a los nodos en el Radix Tree.

## Gas

Cuando hablamos de Ethereum y la ejecución de Smart Contracts, se menciona un término importante: el **GAS**. Este término llega en consecuencia de ofrecer un lenguaje Touring Completo, con bucles; lo que presenta un inconveniente:
**los bucle infinitos no controlados** o también llamado: "the halting problem" ( el problema de la parada).

Bloquear un nodo de la red que intenta validar las transacciones del propio contrato que corre, hace que se bloquee la red, recordemos que utilizando Proof of Stake, solo tenemos un nodo validador, y bloqueando un nodo es en definitiva un ataque DoS [Página 315:]. Para frenar que un contrato se quede bloqueado en un nodo, Ethereum implementa una métrica con la que mide cada instrucción de un contrato, de esta manera, cada instrucción tiene una medida numérica de coste, podemos analizar el siguiente ejemplo de una función escrita en Solidity:

![gas](/uploads/2ba3bb69234118b9ee07cfab1c3867fc/gas.png)

También podemos verlo en el compilador de solidity para el contrato de prueba y el parametro _--gas_:

```bash
miguel@ANDUIN:~/solidity_compiler_pruebas$ solc --gas prueba.sol

======= prueba.sol:Prueba =======
Gas estimation:
construction:
   99 + 45400 = 45499
external:
   guardarSaludo(uint256):      22498
```

Como podemos ver en la anterior fotografía sacada del IDE Remix, nos muestra el coste estimado de la función, este gas limita el tiempo de ejecución del nodo, asegurando que no quede trabado. Esto nos indica que para realizar cada transacción debemos pagar un coste en gas. No todas las operaciones tienen un coste, pero muchas sí. ¿Pero cómo se limita el gas? Fácil, se limita a un número estimado declarado previamente a la ejecución de la transacción (llamada al método), si se acaba se para la ejecución (Out of Gas o OOG) y se retorna al estado previo.

### Cómo consigo Gas

El gas no se puede comprar como tal, sino que se estima en **Wei** una subdivisión de la criptomoneda Ether, para entenderlo mejor, se muestra a continuación las subdivisiones de la criptomoneda:

| Value (in wei)                    | Exponent | Common name | SI name               |
| --------------------------------- | -------- | ----------- | --------------------- |
| 1                                 | 1        | wei         | Wei                   |
| 1,000                             | 10^3     | Babbage     | Kilowei or femtoether |
| 1,000,000                         | 10^6     | Lovelace    | Megawei or picoether  |
| 1,000,000,000                     | 10^9     | Shannon     | Gigawei or nanoether  |
| 1,000,000,000,000                 | 10^12    | Szabo       | Microether or micro   |
| 1,000,000,000,000,000             | 10^15    | Finney      | Milliether or milli   |
| **1,000,000,000,000,000,000**     | 10^18    | **Ether**   | **Ether**             |
| 1,000,000,000,000,000,000,000     | 10^21    | Grand       | Kiloether             |
| 1,000,000,000,000,000,000,000,000 | 10^24    |             | Megaether             |

Es importante conocer, que el coste de gas no está correlacionado con el valor volátil del Ethereum.

### El gas en las transaciones

Los costes en las trasacciones dependen de que se ejecute, por ejemplo: sumar dos números en la EVM cuesta tres unidades de gas mientras que aplicar un hash, cuesta de base treinta de gas, más seis por cada dato de 256 bits que se resume.

Por todo ello, antes de cada transacción, se define un parámetro, el limite de gas (gas limit), es común ver que cada transacción tiene un limite de gas de treinta mil unidades, pero se puede variar, el emisor de la transacción es el puede variar dicho parámetro.

Con el arranque de una transaccion, al minero se le da el suplemento entero de gas establecido en el gasLimit, con cada opcode (instrucción) ejecutada se comprueba si se puede continuar con la ejecución. Cuando se completa la transaccion sin acabar con el gas, el sobrante es devuelto al emisor, el gas "gastado" es la propina del minero, este gas se pasa a Ether:

> propinaMinero = coste Gas x precio gas

En el caso de que el gas, se acabe (run out of gas OOG), se revierte el estado de la ejecución previo a la ejecución de la transacción.

### Precio del Gas

Como ya mencione cada operacion que conlleva un cambio de estado en la EVM, implica la ejecución de los opcodes que tienen un COSTE en gas, pero ... y el precio del gas.
El precio del gas, como mencioné está puesto en [ether](https://etherscan.io/gastracker#gassender), en el momento de escribir esto el valor ronda los 27 gwei, unos 0,91 € al cambio.

En resumen, el gas es Ether. el coste de gas, es un numero que indica el coste de una operación. El precio del gas es la cantidad de Ether que estás dispuesto a pagar para asegurar tu transacción.

Con ello se controla la ejecución de todo en su red, desde transacciones de criptomonedas hasta llamadas a funciones, es una capa de seguridad de la red.

## Criptografía, generación de cuentas y wallets

En Ethereum existen dos tipos de cuenta:

- Externally Owners Account (EOAs), la de las personas.
- Contratos (Smart Contracts)

Se deben diferenciar debido a que las cuentas de los contratos desplegados dependen de la cuenta de la persona que los despliega.

Las cuentas EOA son almacenadas en las conocidas "wallet" (como Metamask) almacenan direcciones de cuenta generadas mediante la criptografía de clave pública o criptografía asimétrica. Esta clave privada se genera mediante el método de Criptografía de curva elíptica. No me voy a adentrar en este ámbito de la criptografía ya que se desviaría del alcance que a priori le estoy dando a este proyecto. Solo decir que el tipo de carteras deterministas, esta clave privada se vincula mediante un conjunto de doce palabras denominada _mnemonic_, que son más sencillas de conocer para un humano que un conjunto de números.
Metamask es uno de las múltiples aplicaciones que permiten manejar un conjunto de cuentas, esta aplicación existe como una extensión de navegador permitiendo generar una contraseña definida por el usuario que desbloquee esta cartera vinculada a las doce palabras.
**IMPORTANTE**: Una cuenta no es una cartera. Una cuenta consiste en un par de claves para una cuenta de Ethereum que pertenece a un usuario. Una cartera como Metamask es la que permite al usuario visualizar y tratar con su cuenta de Ethereum. No almacenan Ether ni cualquier otro token ERC-20, sino que se consulta al Smart Contract correspondiente (en el caso de los ERC) o la BlockChain

### Nonce

El nonce es un valor escalar que se autoincrementa con cada transacción enviada o en el caso de una cuenta con código asociado identifica el número de contratos desplegados por esta cuenta.
[the-transaction-nonce](https://github.com/ethereumbook/ethereumbook/blob/develop/06transactions.asciidoc#the-transaction-nonce)

#### Gas en las transacciones

El parámetro "Precio gas" (gasPrice) se establece por la wallet, aunque también es configurable por el usuario, este parámetro se puede aumentar desde el mínimo, el cual es cero hasta el número que quiera, entre que más alto sea este valor mayorprobabilidad de que la transacción se ejecute más rápido.
En cuanto al gasLimit se basa en lo que ya mencioné, en la cantidad que está uno dispuesto a pagar

### Funciones Hash

Una función hash o función resumen, es un procedimiento matemático que genera un resumen 'h' de tamaño fijo a apart de un mensaje 'M' de tamaño variable.

Toda función hash tiene y debe cumplir las siguientes características:

- Bajo Coste Computacional
- Determinismo
- Uniformidad
- Unidireccional
- Difusión
- Resistencia débil y fuerte a colisiones

En Ethereum, se utiliza el algoritmo **keccak-256**, este algoritmo fue la candidata a la competición de 2007 del Instuto Nacional de Ciencia y Técnología para tener el nuevo SHA-3. keccak fue el ganador de la competición y elegido como la función hash estandarizada por la Federal Information Processing Standard en 2015.

Los usos de las funciones hash son:

- Huella digital para los datos
- Integridad de los mensajes
- Proof of Work
- Auntenticación (hash de la contraseña y estiramiento de clave)
- Generador de números pseudoaleatorio
- Message commitment( Commit-reveal mechanism), se trata de un mecanismo que utiliza funciones hash para que se verifique lo que una persona promete que publicó ya con anterioridad
- Identificadores únicos

## Referencias

- Apuntes Seguridad Daniel F. Garcia - Funciones hash o resumen
- [ethereum.org/docs/gas/](https://ethereum.org/es/developers/docs/gas/)
- [Criptografía de curva elíptica](https://es.wikipedia.org/wiki/Criptograf%C3%ADa_de_curva_el%C3%ADptica)
- [Ethereum book - Capitulo 2 al 4](https://github.com/ethereumbook/ethereumbook)
- [exploring commit reveal schemes on ethereum](https://medium.com/swlh/exploring-commit-reveal-schemes-on-ethereum-c4ff5a777db8)
- [Commit-Reveal Voting](https://karl.tech/learning-solidity-part-2-voting/)
- [Video Explicativo: ¿Por qué se pueden utilizar las curvas elípticas para cifrar](https://www.youtube.com/watch?v=vi2wvAQsy-A)
- [Ethereum State Trie Architecture Explained](https://medium.com/@eiki1212/ethereum-state-trie-architecture-explained-a30237009d4e)
- [Ethereum Block Architecture](https://ethereum.stackexchange.com/questions/268/ethereum-block-architecture)
- [ethereum yellow paper walkthrough 2](https://www.lucassaldanha.com/ethereum-yellow-paper-walkthrough-2/)
- [merkle trie - nebulas wiki](https://wiki.nebulas.io/es/es/go-nebulas/design-overview/merkle_trie.html)
- [Compiling smart contracts](https://www.sitepoint.com/compiling-smart-contracts-abi/)
