# Plan de Pruebas
<!-- markdownlint-disable MD033 -->
<html><style>*{scroll-behavior:smooth}</style></html>

- [Plan de Pruebas](#plan-de-pruebas)
  - [Introducción](#introducción)
  - [Especificación de la aplicación](#especificación-de-la-aplicación)
  - [Análisis](#análisis)
    - [Diseño Plano](#diseño-plano)
      - [Clases de equivalencia para las entradas](#clases-de-equivalencia-para-las-entradas)
      - [Clases de equivalencia para las salidas](#clases-de-equivalencia-para-las-salidas)
    - [Análisis de Valores Límite](#análisis-de-valores-límite)
    - [Validación de Datos](#validación-de-datos)
    - [Técnica Basada en caminos](#técnica-basada-en-caminos)
      - [Caminos Simples](#caminos-simples)
      - [Pares de caminos](#pares-de-caminos)
  - [Técnica Combinatoria](#técnica-combinatoria)
  - [Base de datos](#base-de-datos)
  - [Casos de Pruebas](#casos-de-pruebas)
  - [Reporte de Fallos](#reporte-de-fallos)
  - [Resumen](#resumen)
  - [Referencias](#referencias)

## Introducción

Este informe tiene como objetivo plantear las situaciones de pruebas para el Smart Contract "Electoral Manager": creación y verificación de promesas electorales, derivando de dichas situaciones, sus respectivos casos de prueba.

Los casos de prueba serán creados a través de las diferentes técnicas conocidas (valores límite, diagramas de estados, …), también se destacarán en otro apartado los fallos de prueba encontrados durante el proceso y, por último, un resumen.

El contrato a probar, tiene como función principal la creación de las promesas electorales y, por consiguiente, la verificación de estas.

## Especificación de la aplicación

Esta aplicación se divide en tres partes:

1. Registro de usuarios, cada usuario que desee crear una promesa deberá registrar su nombre y partido político, de esta manera con cada creación de promesa su nombre y partido aparecerán asociados a la promesa.
2. Creación de promesas, una vez registrado el usuario podrá crear cualquier promesa electoral, se necesitará la URI con los datos de la promesa, si es obligatorio y quien es la persona que registra dicha promesa. (quien registra la promesa se obtiene de la transacción)
3. Aprobar una promesa, esta acción debido a que se produce con una llamada desde una DAO, debe ser publica y se puede aprobar cualquier promesa que exista dentro del periodo de gobierno, el actual son cuatro años.

## Análisis

### Diseño Plano

Situaciones o requisitos de pruebas para probar el contrato dividido en categorías

#### Clases de equivalencia para las entradas

1. **Usuarios**
   1. (1.1) Dirección Usuario.
   2. (1.2) Nombre Completo.
   3. (1.3) Nombre Partido Politico.
   4. (1.4) Es un Partido Politico (booleano).

2. **Promesa**
   1. (2.1) URI.
   2. (2.2) Obligatoriedad.
   3. (2.3) Dirección Usuario.

3. **Verificación Promesa**
   1. (3.1) identificador Promesa.

<!--! TODO PREGUNTAR 4. **Parametros Contrato**
   1. (4.1) Nombre del contrato
   2. (4.2) Símbolo del contrato
   3. (4.3) URI base del contrato -->

#### Clases de equivalencia para las salidas

4. **Nuevo usuario**
   1. (4.1) identificador > 1
   2. (4.2) identificador <= 0 (C.E.Inválida)

5. **Nuevo Promesa**
   1. (5.1) identificador > 0
   2. (5.2) identificador < 0 (C.E.Inválida)

6. **Fecha Verificación Promesa**
   1. (6.1) Se establece la fecha actual
   2. (6.1) No se establece la fecha (No se ha aprobado)
   3. (6.1) Otro (C.E.Inválida)

### Análisis de Valores Límite

7. **Fecha Creación Promesa para la aprobación**
   1. (7.1) fecha de aprobación posterior a la fecha de creación y antes del límite.
   2. (7.2) fecha de aprobación posterior a la fecha límite de los cuatro años (C.E.Invalida)
   3. (7.3) fecha de aprobación anterior a la fecha de creación (C.E.Invalida) [f.aprobación < f.creación]

**Problema**:
El problema que surge con el anterior valor limite, en concreto con el punto 7.2, se debe a que las fechas las maneja el propio contrato, no tiene sentido aprobar algo no creado, se podría dar el caso de que la transacción de creación de una promesa fuese posterior a la aprobación debido a como el minero lleva su generación del bloque, pero en dicho caso la transacción de aprobación revertería con un error de tipo:

`$> "Error: electoral promise do not exists"`

   <div>
      <img src="/Recursos%20Globales/Valor%20l%C3%ADmite.png" width="500px">
   </div>

### Validación de Datos

8. Aprobar una promesa
   1. (8.1) Id Existe
   2. (8.2) Id No existe (C.E.Invalida)

<!--! TODO

 9. Datos base contrato: Nombre del ERC721 modificado
   1.  (9.1) Existen el conjunto base de datos
   2.   -->

### Técnica Basada en caminos

Se aplica esta técnica debido a la transición de estados existente en el proceso de creación de la promesa, es decir, existe una transición dentro de la aplicación desde el registro de usuario hasta el estado de **aprobada**, esta prueba es importante debido a como está desarrollado el software.
Debido a que para crear las promesas el usuario debe estar registrado y que para aprobar una promesa se debe dar el suceso de crearla.

We presenta el siguiente diagrama:

![asd](/Recursos%20Globales/flujobasicodrawio.svg)

Donde:
| Camino | Proceso               |
| ------ | --------------------- |
| 1      | Registro de usuario A |
| 2      | Creación de promesa i |
| 3      | Aprobar de promesa i  |

El problema del diagrama anterior reside en que se realiza una prueba caja negra y no se tiene tampoco en cuenta los sucesos dentro de las transiciones. Por ello se presenta el siguiente diagrama, de mayor complejidad:

![dab](/Recursos%20Globales/flujodrawio.svg)

O de manera separada, se podría modular el prototipo creado de la siguiente manera:
![wecb](/Recursos%20Globales/FlujoSeparadodrawio.png)

Estableciendo los caminos oportunos:

![er](/Recursos%20Globales/FlujoCaminosSeparados.drawio.svg)

Donde:
| Camino | Proceso                                          |
| ------ | ------------------------------------------------ |
| 1      | Registro de usuario A                            |
| 2      | Creación de promesa i                            |
| 3      | Aprobar de promesa i                             |
| 4      | Crear de nuevo un usuario con la misma dirección |
| 5      | Aprobar una promesa previamente aprobada         |

#### Caminos Simples

| Caminos (Situaciones de Prueba) | Caso de prueba |
| ------------------------------- | -------------- |
| 1                               | 1-2-3          |
| 2                               | 1-4     (C.I)  |
| 3                               | 1-2-3-5 (C.I)  |
| 4                               |                |
| 5                               |                |

#### Pares de caminos

| Pares de Caminos | Caso de prueba | Tipo     | ID  |
| ---------------- | -------------- | -------- | --- |
| 1-2              | 1-2-3          | Válido   | PC1 |
| 2-3              | 1-4-2          | Inválido | PC2 |
| 4-2              | 1-2-3-5        | Inválido | PC3 |
| 3-5              |                |          |     |

## Técnica Combinatoria

En este software no existe que ciertos parámetros determinen distintos comportamientos en el programa, salvo que haya un error.

<!-- ¿Existe un conjunto de entrada que combinadas de x manera produzcan diferentes comportamientos en la aplicación? -->

## Base de datos

A continuación se presentan el conjunto de datos que se manejaran:

| id  | Parámetro                       | Valor                     |
| --- | ------------------------------- | ------------------------- |
| D1  | Dirección 1                     | addr1[^1]                     |
| D2  | Dirección2                      | addr2  [^2]                   |
| D3  | secondsLegislature              | 126144000                 |
| D4  | nombre completo                 | Juan Alberto Rodriguez    |
| D5  | nombre partido politico         | Partido Por La BlockChain |
| D6  | Se trata de un partido politico | true                      |
| D7  | promesaObligatoria              | true                      |
| D8  | promesaNoObligatoria            | false                     |
| D9  | URI                             | URI                       |
| D10 | Dirección del deployer / owner | deployer                  |

## Casos de Pruebas

| CP  | OBJETIVO                                                      | SITUACIONES DE PRUEBA | DATOS          | SALIDA ESPERADA                               | SALIDA OBTENIDA                               |
| --- | ------------------------------------------------------------- | --------------------- | -------------- | --------------------------------------------- | --------------------------------------------- |
| 1   | Crear un nuevo usuario, nueva promesa del usuario y aprobarla | PC1, 7.1, 8.1         | D1,D4,D5,D6,D9 | Nuevo usuario, promesa creada y aprobada      | Nuevo usuario, promesa creada y aprobada      |
| 2   | Crear un nuevo usuario y Reintento de crearlo                 | PC2                   | D1,D4,D5,D6,D9 | Usuario 1 creado y Fallo Ya existe            | Usuario 1 creado y Fallo Ya existe            |
| 3   | Reintento de aprobar una promesa                              | PC3                   | D1,D4,D5,D6,D9 | No se puede aprobar una promesa ya aprobada   | Promesa aprobada                              |
| 4   | Aprobar una promesa fuera del limite                          | 7.2                   | D1,D4,D5,D6,D9 | NO se puede aprobar una promesa, el tiempo ha pasado   |           NO se puede aprobar una promesa, el tiempo ha pasado                                     |
| 5   | Aprobar una promesa con fecha anterior a su creación          | 7.3                   | D1,D4,D5,D6,D9 |                                               |                                               |
| 6   | Aprobar una promesa que no exista                             | 8,2                   | D1,D4,D5,D6,D9 | No se puede aprobar una promesa que no existe | No se puede aprobar una promesa que no existe |

## Reporte de Fallos

1. En el intento de aprobar una promesa ya aprobada el programa machaca el valor de fecha de aprobación.

## Resumen

## Referencias

- [Chai Documentacion](https://www.chaijs.com/api/bdd/)

[^1]: El valor addr1 es obtenido de la red blockchain
[^2]: El valor addr2 es obtenido de la red blockchain
