# DAO_On_Chain

- [DAO\_On\_Chain](#dao_on_chain)
  - [Procedimientos](#procedimientos)
  - [Instalación](#instalación)
  - [Compilación](#compilación)
  - [Test](#test)
  - [Cobertura](#cobertura)
    - [Cobertura 08/04/2023](#cobertura-08042023)
  - [Deploy DAO](#deploy-dao)
    - [Resumen despliegue](#resumen-despliegue)
  - [Proceso Votación](#proceso-votación)
    - [Preparación](#preparación)
    - [Propuestas](#propuestas)
    - [Votación](#votación)
    - [Cola y Ejecución](#cola-y-ejecución)

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

### Resumen despliegue

Se desarrollan varios scripts con el fin de realizar un despliegue y configuración determinados para cada contrato.

- Primero: se despliega el contrato que funciona como voto, es decir, nuestro **ElectoralToken** que extiende de ERC20.
- Segundo: se lanzará el contrato encargado de manejar las funciones que se ejecutaran mediante la DAO, también se encargará de manejar el conjunto de direcciones que tienen permitido proponer y votar en la DAO -> **TimeLock**
- Tercero: Contrato de gobernanza (**GovernorContract**) este realizará el proceso de:

    ```mermaid
    graph LR
    Propuesta --> Votación
    Votación --> Rechazada
    Votación --> Cola-Ejecución
    ```

- Cuarto (Configuración): En este apartado se establecerán que dirección tendrá permisos de ejecución, propuesta y administración sobre el contrato TimeLock.
  - En cuanto a permisos de ejecución de una propuesta, ya votada y aprobada, permitiremos que cualquier dirección se le permita mandar la transacción que ejecute la propuesta.
  - Se da acceso al contrato de gobierno para la acción de propuesta
  - Y por último se revoca el permiso de administrador de la cuenta de despliegue.
    - Si se mantiene este permiso se tendrían una dirección central y ya no se podría afirmar que se trata de una Organización Autónoma **Descentralizada**
- Quinto: despliegue de electorManager y trasferencia del administrador a TimeLock, de esta manera la DAO gobernara sobre las funciones que tengan el modificador OnlyOwner.

Un miembro de la comunidad DAO realizará la operación de propuesta, voto y propuesta mediante el contrato de gobierno -> GovernorContract

## Proceso Votación

Una vez finalizado el despliegue se crearán un conjunto de scripts que permitirán ver el proceso con lo que cualquiera podría realizar.

### Preparación

Primero se deberá generar cuentas de usuario en el contrato de electoralManager y una o más promesas electorales que den juego a generar propuestas.

Se necesitará para esta parte la dirección del contrato de ElectoralManager. De esta manera se podrá hacer uso mediante la librería ethers de realizar llamadas. Este proceso será el mismo que en el apartado web.

A continuación haciendo uso del contrato de gobernanza se realizarán las llamadas de propuesta, votación, poner en cola de ejecución y ejecución.

### Propuestas

Para esta parte se utilizará el contrato de gobernanza,  este contrato hará como puente entre el usuario y el contrato electoralManager. Un primer usuario realizará una llamada de propuesta, más en detalle, le indicará al contrato de gobernanza lo siguiente:

- Función que quiere ejecutar, es decir, sobre qué función se generará la propuesta
- Datos necesarios para la ejecución si se aprobara en un futuro la promesa

El usuario deberá conocer que función y que datos proponer, para este caso se querrá llamar a la función --> approvePromise y se le pasará el identificador numérico de la promesa.

### Votación

Para realizar la votación se necesitará conocer el identificador de la propuesta y hacer la llamada al igual que pasaba en la propuesta pero en este caso para votar.

Para indicar el tipo de votación: a favor , en contra o abstención se utilizan valores del cero al dos respectivamente.

En conjunto al final se realizará una llamada a la función de votación con dos argumentos:

- identificador de la propuesta
- tipo de voto

Opcionalmente, existen otro tipo de llamadas que permiten votar donde se puede incluir la razón de voto y/o la firma del votante.

Una vez finalizada la votación y pasado el tiempo de este, se puede preguntar en que estado se encuentra la propuesta:

´´´TypeScript
 const stateProposal = await governorContract.state(proposalId);
  console.log(`STATE proposal ${proposalId} is ${stateProposal}`);

// LO QUE DEVUELVE
STATE proposal 81599910900495007656454957995179928549475228392468876642720126284774266985485 is 4

```


Ese cuatro indica indica el estado de succeded, yendo al código del contrato de gobierno, a su interfaz [IGobernor.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.2/contracts/governance/IGovernor.sol) se encuentra una estructura ENUM denominada ProposalState, el número cuatro corresponde al quinto valor de ese enum.

### Cola y Ejecución
