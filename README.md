# Markdown Links

El objetivo de esta librería es que permite verificar los links de un archivo Markdown, mostrar el estado y estadisticas de los links.
También se hace uso de la librería `markdown-parser`, para poder obtener los links del archivo Markdown y luego obtener los estados.

## Instalación

Para agregar el módulo a su proyecto, ejecute:

`npm install DianaApz/lim20181-Track-FE-markdown-list`


## Uso CLI (Línea de comando)


`md-links <path-to-file> [options]`

<path-file-or-dir> ruta de un archivo o de un directorio.

Por ejemplo:

```sh
$ md-links read.md
read.md http://community.laboratoria.la/t/modulos75  Módulos, librerías y frameworks
read.md https://nodejs.org/docs/latest-v0.10.x/api/modules.html  Módulos(CommonJS)
```

#### Options

##### `--validate`

Si pasamos la opción `--validate` muestra link, mensaje de estado y estado del link. 

Por ejemplo:

```sh
$ md-links read.md --validate
http://community.laboratoria.la/t/modulos75  FAIL  400   Módulos, librerías y frameworks
https://nodejs.org/docs/latest-v0.10.x/api/modules.html  OK  200  Módulos(CommonJS)

```

##### `--stats`

Si pasamos la opción `--stats` el output (salida) será un texto con estadísticas
básicas sobre los links como el total y los links únicos.

```sh
$ md-links read.md --stats
Total: 2
Unique: 2
```

También podemos combinar `--stats` y `--validate` para obtener estadísticas que
necesiten de los resultados de la validación como total, únicos y links rotos.

```sh
$ md-links read.md --stats --validate
Total: 2
Unique: 2
Broken: 1
```


