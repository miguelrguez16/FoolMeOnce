# Seguridad

<!-- markdownlint-disable MD033 -->
<html><style>*{scroll-behavior:smooth}</style></html>
Para aprender solidity he obtenido un certificado especializado en este tipo de lenguaje y demás tecnologías relacionadas, despliegue, lenguaje básico, compilación, estructuras, ... pero no enseña que problemas existen para este tipo de programación, y por ello, he querido estudiar y entender mediante el libro Mastering Ethereum y muchas búsquedas en internet este ámbito de la Blockchain.
En el libro se dedica un tema entero a hablar de las vulnerabilidades y como utilizar técnicas de prevención, entender estos problemas de seguridad ayuda también a conocer la esencia de como funciona el lenguaje y también a entender Ethereum, como ya mencioné. Es fundamental para desarrollar cualquier proyecto en esta tecnología debido a la implicación de esta tecnología en el ámbito financiero y su característica inmutable.

- [Seguridad](#seguridad)
  - [Intro](#intro)
  - [Buenas prácticas de seguridad](#buenas-prácticas-de-seguridad)
  - [Riesgos de Seguridad y Anti-Patrones de Diseño](#riesgos-de-seguridad-y-anti-patrones-de-diseño)
    - [Reentrada (Reentrancy)](#reentrada-reentrancy)
      - [¿Qué sucede cuando esa dirección es un Smart Contract?](#qué-sucede-cuando-esa-dirección-es-un-smart-contract)
    - [Overflow](#overflow)
    - [Unexpected Ether](#unexpected-ether)
      - [Autodestrucción del contrato](#autodestrucción-del-contrato)
      - [Preenvio de Ether](#preenvio-de-ether)
      - [¿Cómo afecta esto y que tiene que ver con this.balance](#cómo-afecta-esto-y-que-tiene-que-ver-con-thisbalance)
    - [Delegate Call](#delegate-call)
    - [Default visibilities](#default-visibilities)
    - [Entropy Illusion](#entropy-illusion)
    - [External contract referencing](#external-contract-referencing)
    - [short address/Parameter attack](#short-addressparameter-attack)
  - [Unchecked Call Return Value](#unchecked-call-return-value)
  - [race conditions/front running](#race-conditionsfront-running)
    - [Commit Reveal Scheme](#commit-reveal-scheme)
  - [DoS](#dos)
  - [Block Timestamp Manipulation](#block-timestamp-manipulation)
  - [Contructors with Care](#contructors-with-care)
  - [Uninitialized Storage Pointers](#uninitialized-storage-pointers)
  - [Floating point and precision](#floating-point-and-precision)
  - [Tx Origin Authentication](#tx-origin-authentication)
  - [Referencias](#referencias)

## Intro

Al igual que pasa con todo el código creado y dispuesto en la red, es susceptible a ataques, pero en el caso del desarrollo de Smart Contracts, cobra vital importancia, además de las vulnerabilidades corrientes que puede tener cualquier software que admita peticiones vía web, los Smart Contracts son inmutables una vez desplegados y el código queda públicamente expuesto.

## Buenas prácticas de seguridad

En un primer acercamiento al tema, se indica que se debe seguir el enfoque o planteamiento conocido como **Programación Defensiva**. Este enfoque establece varios puntos a seguir:

- Minimalismo / Simplicidad
- Reutilización de Código: Principio DRY
- Calidad del código
- Legibilidad / auditabilidad
- Cobertura de test

Estos cinco puntos son fundamentales, ya que se debe recordar que los contratos inteligentes, al fin y al cabo, están realizando transacciones con criptomonedas / tokens que tienen mucho valor en el mercado.

## Riesgos de Seguridad y Anti-Patrones de Diseño

Solidity es uno de los lenguaje más populares para generar código que tras compilarlo y generando el ByteCode y ABI necesarios se despliegan en la red de Ethereum. Gracias al uso de este lenguaje y a las lecciones que dan ciertas situaciones, los desarrolladores han aprendido las flaquezas de este lenguaje estableciendo buenas prácticas y patrones de diseño a implementar.

### Reentrada (Reentrancy)

El ataque de reentrada sucede debido a una de las instrucciones que posee Solidity y al manejo de la actualización de los datos, en nuevas versiones este tipo de instrucciones ya no se utiliza y en el caso de que el código pueda tener este tipo de ataque o ser susceptible a este el IDE Remix te marca la vulnerabilidad.

En anteriores versiones si se tenia un Smart Contract con una función de retiro de fondos como la siguiente:

```Solidity
function retirarFondos(uint256 _cantidadEnWeiARetirar) public {
        require(balances[msg.sender] >= _weiToWithdraw); // limit the withdrawal
        require(msg.sender.call.value(_cantidadEnWeiARetirar)());
        balances[msg.sender] -= _weiToWithdraw;
    }
```

En la cual no se actualiza el retiro 100% hasta que se complete la siguiente llamada:

```Solidity
msg.sender.call.value(valueToSend)()
```

Explicación: Esta instrucción se divide en partes, con el 'msg.sender' obtenemos la dirección (EOA o de un contrato) la cual llama a la instrucción, por lo tanto, tendremos un
-> address.call.value(valueToSend)()

#### ¿Qué sucede cuando esa dirección es un Smart Contract?

En los Smart Contracts construidos con Solidity existen una función sin nombre (en anteriores versiones así era), llamada fallback, esta función se ejecuta en varios casos:

- una de las funciones del SC no existe
- Ether es enviado y no existe un función para recibir (receive()) o la variable global msg.data no está vacía

En resumen:
Fallback es el último bastión de funciones a la cual se puede llamar en caso de error o envío de Ethers con datos, mientras que receive solo es para recibir Ether y ningún dato más

Si el atacante construye otra contrato que llamada de manera reiterada al contrato con la vulnerabilidad de la siguiente manera:

```Solidity
// EtherStore =  Contrato con reentrancy
// contiene función retirarFondos
// contiene función depositarFondos (envío de ether)
    function attackEtherStore() external payable {
        etherStore.depositarFondos.value(1 ether)();
        etherStore.retirarFondos(1 ether);
    }

    function () payable {
        if (etherStore.balance > 1 ether) {
            etherStore.retirarFondos(1 ether);
      }
  }

```

De esta manera, una vez enviado fondos y retirados, entrará en un bucle continuo hasta que la siguiente función deje de cumplirse:

```Solidity
    if (etherStore.balance > 1 ether) {
         etherStore.withdrawFunds(1 ether);
    }
```

Pasos:

1. Retirar fondos:
   1. La función del contrato atacado se queda esperando por la llamada que envía el Ether "msg.sender.call.value(valueToSend)()"
   2. El contrato de ataque, recibe el Ether en su función fallback, la cual, chequea que al contrato de ataque le quedan más fondos y vuelve a llamar a retirar fondos.
   3. Así hasta que se quede el contrato de ataque sin nada.

Se plantean dos soluciones:

- utilizar una función creada para este tipo y que limita el gas, se trata de la función transfer, este gas resultante no es suficiente para que la dirección de destino llame a otra dirección o contrato que ataque
- el conjunto de instrucciones que cambian el valor de la cantidad, el estado de lo depositado, establecerlo antes de que se produzca la llamada al envío de Ether.

### Overflow

En ethereum los tipos de datos son fijos a un limite, por ejemplo los uint8, donde cogen números sin signo desde el 0 hasta 2^8, es decir, [0,255]. Que pasa si metemos un 256 en este tipo de variable, pues un cero.
La solución llevada acabo, gracias a OpenZeppelin. OpenZeppelin se encarga del desarrollo de librerías de Ethereum seguras y establecer una implementación de los estándares ERC, además implemento una librería denominada SafeMath que se implementa en las nuevas versiones de Solidity.

### Unexpected Ether

Ya mencioné con anterioridad que existían dos funciones **especiales** que permitían recibir ETHER cuando se llamaba al contrato (fallback Y receive), pero en estos casos se suele esperar que dicho Ether llegue al contrato. ¿Qué pasa si se fuerza el envío de Ether a un contrato?. Pero primero como se manda de manera forzosa Ether a un contrato

#### Autodestrucción del contrato

Para prevenir que el Ether de un contrato se pierda y quede sin asignar a una dirección, se plantea el uso de una instrucción: "selfdestruct()" el cual recibe un address a la cual se envía el Ether quiera o no el destinatario. Esta función envía el Ether y luego elimina el código de la Blockchain.

#### Preenvio de Ether

En anteriores entradas menciono que la dirección de los contratos en Ethereum se generan a partir de la dirección del que despliega el contrato, he de añadir que también se utiliza el contador NONCE (seguridad para evitar despliegues o transacciones duplicadas), más en concreto se calcula de la siguiente manera:

```JavasCript
  addressContract = keccack(rlp.encode([address_owner, transaction_NONCE]))
```

#### ¿Cómo afecta esto y que tiene que ver con this.balance

La función this.balance o address(this).balance, haciendo referencia al contrato que lo ejecuta, devuelve la cantidad de Ether que tiene el contrato. Pero debido a que se puede recibir de manera inesperada Ether, esta función "balance" no contabiliza el Ether que sí se recibió de manera esperada y por funciones de tipo payable (identificador para funciones que envían o recibe Ether), sino que acumula el balance de todo.

En que afecta esto, pues muy a resumidas cuentas de manera simple, aquel contrato que maneje funciones, ya sean de pago o no, donde interfiera la cantidad de Ether enviada/recibida, dicho contrato dejaría de funcionar si por mala práctica se utilice la función balance para manejar las transacciones y no una variable externa.

[https://blog.sigmaprime.io/solidity-security.html#ether](https://blog.sigmaprime.io/solidity-security.html#ether)

### Delegate Call

Hay varias maneras de comunicar dos contratos o un contrato y una librería:

- Conocer el ABI, permite tener una referencia del contrato (por su address) y se llama a traves de la creación de una instancia de este
- mediante el opcode CALL
- mediante el opcode DELEGATECALL

Estos tres métodos permiten la comunicación entre contratos, pero con pequeñas diferencias:

- el método call y le método ABI, realizan la misma función, igual que en otros lenguajes de programación

- ¿pero qué pasa con el DELEGATECALL?
  Cuando el emisor, el contratoA, llama a una función de la librería, las variables que se utilizan, serán las del contratoA, esto se debe a que con este método se traspasa el contesto de la ejecución, destacar que no se traspasa el nombre de las variables sino los slots donde se almacenan las variables.

Inciso, en solidity existe un layout o posicionamiento de las variables (estados) cuando se cargan en los contratos, se van rellenando los slots de la memoria uno tras otro, y en el caso de las librerías y los contratos que las llaman es muy importante tenerlo en cuenta.

Por tanto, si se utilizara de manera incorrecta este orden del state, podría dar pie al desde un mal funcionamiento del contrato hasta el robo de ether, como ilustra el libro Mastering Ethereum.

En el libro, muestra un ejemplo (con un contrato, una librería y un contrato atacante), una de las funciones del contrato permite mediante delegatecall llamar a cualquier método de la librería, además no tiene en orden las variables lo que permite modificar la dirección de la librería o incluso obtener el balance del contrato

[Solidity Tutorial Mensajes entre contratos: Call y Delegatecall Ethereum Alberto Lasa Tutoriales y noticias de Crypto](https://www.youtube.com/watch?v=liYI8fYu2xg&t=33s)

### Default visibilities

En el lenguaje solidity tanto las funciones como las variables tiene visibilidades:

- public: cualquier dirección tiene acceso
- private: solo visible desde dentro del smart contract
- internal: como private pero los smart contract que hereden este contrato pueden verlo
- external: solo externamente puede ser llamado

Es importante tener en cuenta este tipo de modificadores de visibilidad, debido a que por defecto, todo lo declarado, el estado o las funciones son visibles. Es muy importante tener en cuenta estos modificadoras ya que siguiendo la referencia de Mastering Ethereum robaron treinta un millones de dólares en Ether.

### Entropy Illusion

En el ámbito de la programación no existe una manera de obtener número aleatorios, obviamente pasa con Ethereum de igual manera. ¿A qué viene esto de la entropía? en ethereum en anteriores años se utilizaban los datos de bloques futuros, es decir, no generados aún, para tener una fuente aleatoria, esta fuente daría por ejemplo el numero de un boleto ganador. Pero que pasa, que los valores generados en los bloques, no son aleatorios, son todo lo contrario, los datos vienen de las transferencias realizadas, por tanto un minero podría jugar con el valor.

Por tanto, la manera aconsejable de conseguir un número seudoaleatorio es mediante una llamada externa, se pueden utilizar los denominados oráculos. Los oráculos son puentes entre internet y la blockchain que proveen de servicios a los Smart Contract.

### External contract referencing

Una manera de referenciar contratos desde otro contrato, es utilizar su dirección y se puede referenciar a el segundo contrato mediante ello. Esto ya se vio en el apartado respectivo a la vulnerabilidad de [reentrada](#reentrada-reentrancy).

El problema reside en el momento en que no es accesible las direcciones de los contratos o librerías la cual utiliza. Esto se puede ver de la siguiente manera:

```Solidity
# Fichero Contrato

contract PruebaCalculadora {
  Calculadora calculadora; // instance

  function PruebaCalculadora(Calculadora _calculadora){
    calculadora = _calculadora;
  }

  // cde
  ...
}

contract Calculadora {

  // operations
  function add(uint256 _x, uint256 _y) public returns(uint256){
    returns _x + _y;
  }
}
```

Hay varias cosas a tener en cuenta:

1. Se utiliza una librería
2. La dirección de dicha librería no es visible, debido a que se trata de una instancia
3. Hay una función que permite modificar la dirección de la librería

Si un tercer contrato da su confianza para utilizar el contrato PruebaCalculadora, podría estar cometiendo un error. El owner o propietario del contrato, podría cambiar la dirección del contrato e introducir una dirección con implemente código malicioso.

Un ejemplo ilustrado en [reddit](https://www.reddit.com/r/ethdev/comments/7x5rwr/tricked_by_a_honeypot_contract_or_beaten_by/) cuenta como este usuario, intentó con un ataque de reentrada donde solo tenia que pagar un ether para realizar su ataque, todo iba bien hasta que al realizar su ataque se dio cuenta que no funcionaba y acababa de perder ether, no sé sabe bien que código se introdujo aunque se puede encontrar una posible explicación de lo sucedido [aquí](https://www.reddit.com/r/ethdev/comments/7xu4vr/comment/dubakau/).

### short address/Parameter attack

En el momento en que se dispone de una aplicación descentralizada o dApp, la validación de direcciones para consulta de datos o, más importante aún, la transferencia de tokens, es de debido cumplimiento validar los datos de entrada, previamente a la comunicación hacia la Blockchain. Los datos en conjunto, nombre de la función y parametros de entrada, son codificados siguiendo la estructura del ABI que en ciertos casos de que faltan datos la EVM puede rellenar con ceros, el caso que se documenta en el libro es bastante sencillo, utilizando ERC20 (se ilustrará más adelante), su método transfer contiene los parámetros address y un entero, la dirección son 20 bytes (40 números en hexadecimal) y el número representado en enteros sin signo indica la cantidad de tokens de tipo ERC20 a transferir. El problema viene cuando un usuario indica una dirección acortada y la EVM rellena por el final, se modificaría peligrosamente el número de tokens a transferir, de querer mandar 100 a mandar tal y como se muestra en el ejemplo 25 600.

## Unchecked Call Return Value

Existen diferentes funciones de envío de Ether desde los contratos, estas son:

- send
- trasnfer
- CALL

Estos dos métodos y el conocido opcode CALL, hacen lo mismo con ligeras diferencias. Los métodos transfer y send limitan el gas para la transacción a 2300 y devuelven un error o un booleano, respectivamente. En cuanto a CALL, se puede limitar el gas pero se debe especificar, si no se pone es posible que el código sea susceptible a la vulnerabilidad de la reentrada, también devuelve un booleano. Importante: el error de transfer revierte el estado, lo que asegura el estado de la transacción y asegura el envío de ether

Comprobar lo que devuelve cada uno de los métodos es importante, sobre todo en el envío de ether que tiene implicaciones monetarias, tanto para el caso de una devolución de ether (contrato a usuario), como para evitar dejar una vulnerabilidad en el contrato.

En los casos de que se tengan funciones de tipo withdrawal (de retiro de ether), se recomienda utilizar el patrón propuesto en la documentación oficial de solidity.

## race conditions/front running

Como ya se conoce las transacciones antes de ser validadas por un nodo, son guardas en un pool de estas, este pool es público y los mineros suelen escoger aquellas que mayor precio de gas están dispuestos a pagar (mayor beneficio para ellos). En el caso de que exista un contrato de premio, por aquel que adivine la palabra codificada se lleve el premio, podría darse el caso que un atacante atento al pool de transacciones averiguase la transacción ganadora antes de la validación e inicie una transacción con un precio de gas más alto, llevándose la recompensa.

Como se puede evitar, hay varias maneras. Limitar el gas de la operación o utilizando un método denominado commit-reveal.

### Commit Reveal Scheme

Este mecanismo criptográfico permite mediante el uso de hash, verificar que un usario se ha comprometido con un valor elegido. Tiene esencialmente dos partes:

- Fase 1 [the commit phase]: La persona que se compromete, elige un valor, lo hashea y lo publica
- Fase 2 [the reveal phase]: Se revela el valor y mediante el hash un receptor valida lo publicado

```Sequence
PersonaA->Contrato: hash(valor + EOA)
PersonaA-->Contrato: revela valor
Contrato-->PersonaA: Verifica valor de PersonaA
Contrato->>PersonaA: aprobado
```

De esta manera, aplicando esto al ejemplo de Blockchain, un usuario primero emitiría el valor (pasado por la función de hash) y esperaría a que la transacción finalizase y el bloque sea generado, para a continuación revelar el valor verdadero.

Otra manera, sería que un conjunto de usuarios publicasen su commit, pasado un rato, el contrato indicaría que ya tiene suficientes valores recogidos permitiendo la segunda fase.

## DoS

Hay múltiples maneras de dejar un contrato inoperativo, recordar que la ejecución tiene un limite (gasLimit), por ello, uno de los ejemplos de dejar inoperativo un contrato que probablemente contenga ether, es iterar sobre arrays donde su longitud dependa de las interacciones de usuarios, este tipo de arrays podrían crecer en tamaño logrando bloquear operaciones de tipo withdrawal, que se quieran realizar de manera múltiple.

Otro ejemplo de problema, viene dado en el caso de que el owner de un contrato tenga ciertos privilegios, un ejemplo, sería el caso de que este solo pueda dar la orden para incurrir en cierta acción importante, ya sea repartir Ether, delegar,... ¿que pasaría si dicho propietario del contrato dejase de estar operativo? Se quedarían sin realizar la acción.

Hay varias soluciones, desde que sea el propio usuario (utilizando el patron de withdrawal evitando la reentrada), para el primer caso.
Par el segundo caso se puede utilizar varios owner de un contrato permitiendo cualquier acción a cada uno de ellos, o sino se puede utilizar lo siguiente:

```Solidity
require(msg.sender == owner || now > unlockTime)
```

Nota: la función require una estructura de condición que bloquea el flujo de ejecución si no se cumple los parámetros de entrada.

De esta manera si no es el owner, cualquiera puede lanzar la función y si ya ha pasado el tiempo marcado en unlockTime se puede ejecutar la acción.

## Block Timestamp Manipulation

Existen más variables que las mencionadas anteriormente, se mencionaron:

- msg.sender, indica la dirección de quien llama al contrato
- msg.value indica la cantidad de weis emitidos en la llamada (o transacción)

Pero existen muchas más del tipo msg (message) y no solo de ese tipo sino de consulta de los datos del bloque, es decir, podemos acceder a las propiedades de los bloques generados, tenemos las siguientes variables:

- blockhash(uint blockNumber): hash del bloque pasado por parámetro.
- block.basefee: tarifa base del bloque actual.
- block.chainid: identificador de la cadena actual.
- block.coinbase: dirección del minero del bloque actual.
- block.difficulty: dificultad del bloque actual.
- block.gaslimi): límite de gas del bloque actual
- block.number: número actual del bloque.
- block.timestamp: marca de tiempo del bloque actual en segundos (unix epoch)

En la documentación actual de [solidity](https://docs.soliditylang.org/en/v0.8.18/units-and-global-variables.html#Block%20and%20Transaction%20Properties) ya se nos menciona en una Nota:

> "Do not rely on **block.timestamp** or **blockhash** as a source of randomness, unless you know what you are doing."

El problema es que sí se han utilizado como fuente de números aleatorios, como control de tiempo para denegar el acceso a ciertas funciones de retiro (withdrawal) o para el cambio de estado en función del tiempo, pero este block.timestamp puede ser modificado, aunque en pequeña medida. Aún a pesar de esta pequeña influencia, ha sido causa de vulnerabilidades aprovechadas por usuarios que son mineros.

El ejemplo que se menciona en el libro, fue de un contrato donde el último usuario en llegar en cierto rango de tiempo era el que recibía un premio, el problema fue que se utilizaba dicho timestamp.

Para poder utililar los tiempos se recomienda utilizar la generación de bloques, conociendo la media en la que se generan dichos bloques se puede estimar el tiempo que queremos tener de margen para ejecutar un cambio de estado, al fin y al cabo, el numero de bloque es autogenerado y no depende de los mineros.

## Contructors with Care

Al igual que pasa en otros lenguajes, existen constructores que permiten instanciar las clases, en solidity pasa igual, pero con un apunte importante, es en este donde se definen los parámetros como el owner el totalSuplay del ERC20, ... Pero el problema a mencionar viene en versiones anteriores.

Previamente, en la versiones anteriores a 0.4.22. los constructores, se declaraban de como en Java, una función publica con el nombre de la clase, a partir de esta version se incluyo la palabra clave _constructor_ que soluciona el "problema" de mantener el mimo nombre de la función constructora como la del nombre del contrato.

## Uninitialized Storage Pointers

En antiguas versiones de solidity la falta de inicialización de estructuras y siguiendo la estructura en la que se almacenan los datos, se podría alterar variables ya inicializadas que corresponden con anteriores valores, en el ejemplo del libro:

```Solidity
pragma solidity ^0.4.0;

contract NameRegistrar {

    bool public unlocked = false;  // registrar locked, no name updates

    struct NameRecord { // map hashes to addresses
        bytes32 name;
        address mappedAddress;
    }

    // records who registered names
    mapping(address => NameRecord) private registeredNameRecord;
    // resolves hashes to addresses
    mapping(bytes32 => address) private resolve;

    function register(bytes32 _name, address _mappedAddress) public {
        // set up the new NameRecord
        NameRecord newRecord; // NameRecord storage newRecord
        newRecord.name = _name;
        newRecord.mappedAddress = _mappedAddress;

        resolve[_name] = _mappedAddress;
        registeredNameRecord[msg.sender] = newRecord;
    }
}
```

Lo que ocurre es debido a la asignación en memoria. Las variables se cargan en un orden atendiendo a lo que ocupan y si se necesita reservar espacio o no. De acuerdo a lo que nos muestra este contrato hay las siguientes variables inicializadas y con reserva de memoria:

1. unlocked
2. registerNameRecord
3. resolve
4. ...

Por tanto, si ejecutamos la función 'register', con cualquier dato válido puede funcionar, pero al igual que ocurre en C/C++ no se está inicializando correctamente el espacio de memoria necesario para el estado: NameRecord newRecord, el cual, se guarda por defecto en storage, si en vez de de declarar esta variable dentro de la función, se declara fuera funcionaría de la manera correcta sin la posibilidad de dejar una vulnerabilidad abiertas, como pasaría si se introduce en \_name -> 0x0000000000000000000000000000000000000000000000000000000000000001 y una dirección como= 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

En el lenguaje solidity, NameRecord newRecord, o lo que es lo mismo, NameRecord storage newRecord, funciona con una vulnerabilidad, debido a que se necesita que la dirección donde se almacena el struct require que se derive de como se organizan los propios structs e iniciar el struct de manera correcta.

## Floating point and precision

En solidity, existen tipos de variables como los booleanos, enteros (con y sin signo), direcciones, strings y algunas estructuras de datos más complejas como los ENUM, los arrays o los mapping, pero no existen los double, big decimal o float como existen en Java o en otros lenguajes de programación, por tanto, es importante tenerlo en cuenta, ya que con cualquier calculo de un ratio o del resultado del calculo de una tasa, sobre todo cuando se manejan tokens o criptomonedas.

## Tx Origin Authentication

Además de msg.sender, existe una variable global parecida a esta, tx.origin, la diferencia recae en que tx.origin es siempre la dirección EOA de un usuario. En resumen, msg.sender, puede ser un intermediario ya sea un EOA directo o un contrato el cual tiene de inicio un EOA, mientras que en tx.origin es siempre un EOA.

La vulnerabilidad recae en que si se utiliza el siguiente código en una función para comprobar el owner, como la siguiente :

```Solidity
require(tx.origin == owner , "Solo el owner")
```

Un atacante, podría engañar al verdadero owner del contrato a atacar, para que llame a una dirección que es la de un contrato de ataque. Esta llamada del owner a un contrato iniciaría una transacción donde ya se consigue el tx.origin==owner teniendo acceso.

## Referencias

- [Capitulo 9 Seguridad en SmartContract - Mastering Ethereum](https://github.com/ethereumbook/ethereumbook/blob/develop/09smart-contracts-security.asciidoc)
- [consensys smart contract best practices](https://consensys.github.io/smart-contract-best-practices/)
- [Reentrancy - Consensys](https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/)
- [Programación Defensiva - Wikipedia](https://es.wikipedia.org/wiki/Programaci%C3%B3n_defensiva)
- [Docs Solidity - re-entrancy Security](https://docs.soliditylang.org/en/v0.8.17/security-considerations.html?highlight=msg.sender.call#re-entrancy)
- [PowerPoint CNI Seguridad VUlnerabilidades Smart Contracts](https://www.ccn-cert.cni.es/pdf/documentos-publicos/xii-jornadas-stic-ccn-cert/3422-m22-02-smart-contracts-ethereum/file.html)
- [Blog referencia power point](https://blog.sigmaprime.io/solidity-security.html#re-vuln)
- [commit schema wikipedia](https://en.wikipedia.org/wiki/Commitment_scheme)
- [commit-reveal 1 Exploring Commit-Reveal Schemes on Ethereum](https://medium.com/swlh/exploring-commit-reveal-schemes-on-ethereum-c4ff5a777db8)
- [commit-reveal 2 commitment schemes](https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract)
- [consensys smart contract best practices](https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/public-data/)
- [EVM memory layout](https://docs.alchemy.com/lang-es/docs/smart-contract-storage-layout)
- [Inicializar structs a punteros de storage](https://ethereum.stackexchange.com/questions/4467/initialising-structs-to-storage-variables)
