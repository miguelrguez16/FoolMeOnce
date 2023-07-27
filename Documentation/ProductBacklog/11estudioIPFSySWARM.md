# Introducción

<!-- markdownlint-disable MD033 -->
<html><style>*{scroll-behavior:smooth}</style></html>
Los NFTs son parecidos a los cromos donde hay una imagen y un texto, pero en el caso de guardar datos en la blockchain, una imagen y/o una descripción completa, en nuestro caso, una promesa electoral, puede llevar a incrementar el coste de creación de una promesa electoral hasta un punto de que deje de ser atractivo.
Por ello se utiliza servicios como IPFS o Swarm. Estos servicios brindan un almacenamiento descentralizado, mediante una red P2P, el cual permite almacenar cualquier tipo de archivo desde html hasta videos, la combinación de este tipo de servicio con los Smart Contract da lugar a las conocidas como dApps o Aplicaciones Descentralizadas.

Otra opción sería almacenarlo de manera centralizada, esto implica una mayor complejidad debido a que se estaría manejando:

- Uno o más Smart Contract: conexión con la BlockChain.
- Front para visualización de los datos con el usuario.
- Backend con conexión a una base de datos, el front y el Smart Contract.

Por ello, este auge de las aplicaciones que hacen uso de los contratos inteligentes utilizan también el almacenamiento descentralizado, con estas acciones surgieron las dApps.

## Contenido

- [Introducción](#introducción)
  - [Contenido](#contenido)
  - [IPFS](#ipfs)
    - [¿Cómo Funciona?](#cómo-funciona)
  - [SWARM](#swarm)
  - [Conclusiones](#conclusiones)
  - [Referencias](#referencias)

## IPFS

IPFS son las siglas para Inter-Planetary File System,es un servicio descentralizado donde cada contenido tiene asociado una dirección única. Esta dirección, llamada CID, se compone mediante el hash de los archivos almacenados en la red p2p. A su vez, el propio servicio se encarga de dividir cada archivo en pequeñas partes y distribuirlo de manera segura por la red de pares.

Una vez almacenados los archivos son inmutables, debido a ser una red p2p donde no se conoce quien está detrás de cada ordenador, son verificables si cambiara su contenido, su CID (su identificador) cambiaría gracias al uso de la criptografía de hash.

### ¿Cómo Funciona?

Disponiendo de un cliente de IPFS en Windows, Mac o Linux se permite subir archivos, una vez subido dicho archivo se conocerá su CID, y solo con ese CID se podrá obtener el archivo

Yo he guardado el logo de FoolMeOnce en ipfs y se permite acceder a él mediante el propio navegador Brave que viene con el protocolo incluido:

`$ ipfs://bafybeiep3zlbianicek6vva3uadsfouibpozpkinakyrzovd5n5rscpdyy/`

O la propia Wikipedia

`$ ipfs://bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze/wiki/`

En IPFS los nodos son los encargados de publicar el contenido a su tabla distribuida DHT, cuando se quiere recuperar los datos, se debe encontrar la lista de pares en el DHT por la clave, el CID, para luego traducir esa petición al protocolo ip y a continuación descargar el contenido.

## SWARM

Se trata de un servicio muy parecido a IPFS, pero ha sido creado por Ethereum Foundation. Al igual que IPFS, permite almacenar archivos direccionables mediante su identificador, es más nuevo que IPFS, es más eficiente y es compatible con Ethereum. Otra diferencia respecto a IPFS reside en que no es el usuario quien brinda la información, sino que el usuario se conecta a un nodo y es este quien

## Conclusiones

Ambos servicios son buenos para el almacenamiento de archivos, e incluso valen para el despliegue de dApps. Pero ante la popularidad de IPFS, su documentación, no está ligado solo a ethereum los requerimientos de este proyecto se elige IPFS, que gracias

## Referencias

- [Capitulo 12: Mastering Ethereum - Descentralice Application](https://github.com/ethereumbook/ethereumbook/blob/develop/12dapps.asciidoc)
- [IPFS official](http://ipds.io)
- [bit2academy - que es ipfs](https://academy.bit2me.com/que-es-ipfs/)
- [Swarn](https://www.ethswarm.org/)
- [Paper Ipfs - Swarm](https://www.technoarete.org/common_abstract/pdf/IJERCSE/v4/i11/Ext_89203.pdf)
- [FileCoin - IPFS](https://docs.filecoin.io/developers/introduction/filecoin-and-ipfs/)
