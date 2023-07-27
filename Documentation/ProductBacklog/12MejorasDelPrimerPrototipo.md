# Introducción

<!-- markdownlint-disable MD033 -->
<html><style>*{scroll-behavior:smooth}</style></html>
En esta historia se reunirá el estudio de las mejoras y su correspondiente análisis.

## Contenido

- [Introducción](#introducción)
  - [Contenido](#contenido)
  - [Propuesta Mejoras](#propuesta-mejoras)
    - [Backend](#backend)
    - [Web](#web)
  - [Comienzo Mejoras](#comienzo-mejoras)
    - [Librerías Solidity](#librerías-solidity)
      - [Características de las librerías](#características-de-las-librerías)
    - [Caso de uso para ElectoralManager](#caso-de-uso-para-electoralmanager)
      - [Problema](#problema)
  - [Auditar](#auditar)
    - [Block.timestamp](#blocktimestamp)
    - [Punteros de almacenamiento no inicializados](#punteros-de-almacenamiento-no-inicializados)
    - [Visibilidades de las funciones y estructuras](#visibilidades-de-las-funciones-y-estructuras)
    - [Test y Cobertura de Test](#test-y-cobertura-de-test)
      - [TestElectoralManager](#testelectoralmanager)
      - [Cobertura](#cobertura)
    - [Mejoras Web](#mejoras-web)
  - [Referencias](#referencias)

## Propuesta Mejoras

### Backend

- [x] Explicar qué es una librería en Solidity
- [x] Optimizar el uso de archivos de Solidity y/o mejorar su comprensión mediante el uso de Librerías.
- [x] Auditar el conjunto de contratos, realizando comprobaciones de seguridad gracias a lo aprendido sobre la seguridad y los posibles ataques sobre Smart Contracts
- [x] Investigar la posibilidad de crear llamadas sencillas desde ElectoralManager que permita conocer el conjunto de promesas electorales de una persona
- [x] Con la creación de usuarios registrar también el partido político
- [ ] ¿Se debería permitir cambiar de partido politico?, permitiendo conocer la trazabilidad o recorrido del politico por parte del ciudadano. (Podría ser un map (address, map (id , "Nombre Partido"))

### Web

- [x] Promesas Electorales pueden tener un Tema.
- [x] Promesas Electorales se establece relación con otras promesas
- [x] Añadir una vista donde pasado un id, permita obtener el 100% del conjunto de datos de la promesa electoral.
- [x] Crear la posibilidad de crear un QR para referenciar la promesa electoral.
- [x] Evitar que se añada un nombre vacío, ejemplo, solo un espacio en el espacio de registro.
- [x] Lenguajes Markdown sencillo para grabar las promesas
- [x] Mejora de estilos

## Comienzo Mejoras

### Librerías Solidity

Las librerías en Solidity no dejan de ser código encapsulado que permite una reutilización, una vez desplegado se podría reutilizar muchas veces, un ejemplo es la librería de Strings utilizada en el código de ElectoralPromise.sol:

```Solidity
import "@openzeppelin/contracts/utils/Strings.sol";
```

Esta librería se encarga de ofrecer métodos básicos sobre el tipo de dato String, como son el toString(), que imprime la cadena de caracteres, un método equals, y algunos más.

#### Características de las librerías

- Podemos reutilizar código, una vez desplegado permite ser reutilizado, simil al patrón Singleton
- Es económico, ya que solo se necesita un despliegue.
- Permite sobrescribir tipos, ya que de esta manera permite incrementar la funcionalidad básica que existe sobre los datos. Por ejemplo, se podría utilizar una librería que ayudase a introducir valores en un array, es decir, añadir la funcionalidad de añadir elementos al array con comprobaciones.
- Las librerías no pueden ser destruidas como pasa con los contratos.
- Una librería no puede tener variables de estado
- No se puede heredar ni el inverso
- No almacenan ether

### Caso de uso para ElectoralManager

En esta plataforma se han creado un par de estructuras para almacenar los datos importantes en la red blockchain, por ejemplo, para las promesas tenemos el siguiente Struct:

```Solidity
///@dev Basic info of a electoral promise
    struct DataPromise {
        uint256 id; // id
        uint256 created; // timestamp
        uint256 idAuthor;
        bool isObligatory;
        bool isApproved;
        string tokenUri;
        string nameAuthor;
    }
```

Y otro para los Usuarios que registran las promesas, los llamados "Promisers":

```Solidity
struct Promiser {
        uint256 idAuthor;
        bool isPoliticalParty;
        string completeName;
        string namePoliticalParty;
    }

```

Y si este conjunto de datos los abstraemos del código principal (ElectoralManager) teniendo unicamente las funciones que operan sobre ellos y obteniendo un código más limpio, de esta manera podremos tener una estructura de código parecido al Modelo Vista Controlador. No es una mejora con gran impacto pero ayuda al programador a conocer que está haciendo el programa, el know-how.

#### Problema

La única parte que se podría extraer para utilizarlo en librerías serían las estructuras, el resto del código debería seguir estando en el contrato principal. Esto se debe a que las funciones principales de crear promesas y registrar usuarios manejan estructuras modificables añadiendo datos, si estas operaciones se abstraen a una librería, se deberían pasar como parámetro para que la librería lo añadiera dejando en el contrato ELectoralManager solamente las llamadas a las funciones correspondientes, dejando toda la parte funcional en la librería no siendo ese el objetivo de la librería.

Por tanto, con el fin de facilitar el desarrollo y mantenimiento, y separar los nuevos tipos de datos se opta por definir un nuevo contrato denominado DataInfo.sol del subtipo librería que permita ser una representación del conjunto de datos, logrando separar la creación de los tipos básicos de la funcionalidad.

## Auditar

En cualquier programa o servicio es importante la seguridad, por ello se realizan pruebas sobre el código y sobre todo se realiza hincapié en las vulnerabilidades conocidas. En el mundo de la Web3, el robo de tokens tiene una relevancia económica muy importante, existiendo vulnerabilidades como el ya mencionado Reentrancy. Debido a la naturaleza de nuestro proyecto, hay ciertas peculiaridades que se deben tener en cuenta:

- Precaución con el uso de block.timestamp,
- Punteros de almacenamiento no inicializados.
- Visibilidades de las funciones y estructuras.

Gracias a que esta plataforma debe ser 100% transparente tanto con el político como con el ciudadano y no se requieren pagos con criptomonedas o tokens ERC-20, es una gran ventaja para auditar este conjunto de contratos. También cabe destacar que gracias a utilizar parte de un estándar ya programado y verificado por la comunidad sienta una base segura sobre la que avanzar.

Una vez finalizada las mejoras que incuben a la parte de los Smart Contract, conviene adentrarse en los puntos anteriormente mencionados:

### Block.timestamp

En la plataforma, las promesas electorales son creadas y registradas con multiples datos, uno de ellos es la marca de tiempo. Esta marca será utilizada para establecer el margen de tiempo que ha transcurrida desde que se crea la promesa hasta que se ha verificado.

En Solidity al igual que en otro tipo de lenguajes existe una instrucción que permite conocer el timestamp (unix), el problema reside en que este valor puede fluctuar. ¿Por qué puede fluctúa? Porque no estamos un servicio centralizado donde con una llamada al sistema se conoce el timestamp exacto, sino que en una arquitectura descentralizada como es el caso, la transacción no se completa de manera verificable hasta el momento en que la transacción creada por el usuario es validada por un nodo y por consiguiente se genera el bloque. En solidity se utiliza el block.timestamp, el cual es un atributo de los bloques generados, para conocer en que momento del tiempo fue creado.

El uso de este timestamp obtenido de la generación del bloque tiene una vulnerabilidad, ya que si dependemos de este para comprobar que usuario hizo algo antes, un minero podría colar una transacción que aunque fuese posterior podría ser minada antes de que llegue la que es la verdaderamente correcta.

La parte buena es que en esta plataforma esta marca de tiempo servirá para la verificación de las promesas, es decir, su margen de tiempo donde operará este valor será de cuatro años (lo que dura una candidatura), un valor muy grande, comparándolo con lo que se tarda en generar el bloque que es donde se encuentra el problema, como dicho intervalo es muy inferior al tiempo de generación de bloques, casi despreciable, no podría afectar al futuro de una implementación de una DAO para la verificación o de la propia creación de promesas.

### Punteros de almacenamiento no inicializados

Esta vulnerabilidad se debe al uso incorrecto de los Structs en su declaración para su uso ya que por defecto se utiliza almacenamiento de tipo storage el almacenándolo en la blockchain, esto permitiría que un usuario malintencionado pudiera machacar otros estados declarados previamente e incluso cambiar el estado.
En la plataforma se utilizan dos structs pero en el momento de crearlos se crean utilizando memory, esta práctica consiste en crear un objeto temporal para luego añadirlo a un array donde si que se ha reservado correctamente la memoria para ello.

```Solidity
        /// Creamos una nueva promesa, temporal
        DataPromise memory tmpPromise = DataPromise(
            counterElectoralPromises,
            // datos de la promesa
            ...
        );

        /// save into the list
        listElectoralPromises.push(tmpPromise);
```

Esto mismo pasa con la creación de usuarios y el uso correcto de los punteros a memoria.

### Visibilidades de las funciones y estructuras

Una sencilla manera de poder ver esta parte es utilizando Remix, ya que permite una visualización de los métodos accesibles y su coste:

- los verdes son los de visualización
- los naranjas son los que cuestan gas
- los rojos son los que requieren un pago en ethers.

![Screenshot_2023-03-14_191537](/uploads/9e430a891eb2a78e5b38091a68488c5c/Screenshot_2023-03-14_191537.png)

Como se puede apreciar todas las funciones o tipos de datos son públicos o externos sin coste, las únicas funciones con coste y que también son publicas son las de creación de promesas y el registro de los usuarios. Es buena práctica comprobar esta parte debido a que se podrían dejar funcionalidades abiertas que son importantes para el correcto funcionamiento del contrato.

### Test y Cobertura de Test

Se han realizado test y la cobertura ha ido mejorando, gracias a hardhat se obtiene un 90% de cobertura con los test.

#### TestElectoralManager

Deployment

- ✔ should track name, symbol and baseUri of the ElectoralManager, and other state (72ms)

Register and test promiser

- ✔ should track the register of a person (94ms)

Register a new Electoral Promise

- ✔ should track the register of a new electoral promise without a login
- ✔ should track a correct register of a promise with a correct login (121ms)

#### Cobertura

| File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
| --------------------- | ------- | -------- | ------- | ------- | --------------- |
| contracts\            | 96.97   | 61.11    | 100     | 97.73   |                 |
| DataInfo.sol          | 100     | 100      | 100     | 100     |                 |
| ElectoralManager.sol  | 100     | 100      | 100     | 100     |                 |
| ElectoralPromise.sol  | 94.44   | 50       | 100     | 95.83   | 142             |
| IElectoralPromise.sol | 100     | 100      | 100     | 100     |                 |
| All files             | 96.97   | 61.11    | 100     | 97.73   |                 |

### Mejoras Web

Las mejoras incluidos son las mencionadas con anterioridad pero añadiendo una parte importante, las vista diseñada para dispositivos móviles, de esta manera se cumple con uno de los criterios de aceptación de este proyecto. Es importante que se permita esta vista debido a la importancia del día a día y la sencillez que añade el uso de un QR para mostrar una información importante.

## Referencias

- [Librerías Documentación Oficial Solidity v0.8.17](https://docs.soliditylang.org/en/v0.8.17/contracts.html?highlight=Libraries#libraries)
- [What is timestamp dependence vulnerability](https://www.getsecureworld.com/blog/what-is-timestamp-dependence-vulnerability/)
- [ethereumbook-smart-contracts-security](https://github.com/ethereumbook/ethereumbook/blob/develop/09smart-contracts-security.asciidoc)
