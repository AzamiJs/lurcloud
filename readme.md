# Lurcloud 🌧️

> Herramienta útil para Node.js

[![npm version](https://img.shields.io/npm/v/lurcloud.svg)](https://www.npmjs.com/package/lurcloud)
[![License](https://img.shields.io/npm/l/lurcloud.svg)](LICENSE)

---

### Características
`Descargas`
- [x] Facebook
- [x] Instagram
- [x] Tiktok
- [x] Google Drive
- [x] DropBox

`Maker`
- [x] Blue
- [x] Blur
- [x] Circle
- [x] Comrade
- [x] Greyscale
- [x] Heart
- [x] Rainbow

> [!NOTE]
> Con el tiempo se agregaran más funciones según las necesidades.

### Instalación

```bash
npm install lurcloud
```

### Ejemplo
`Descargas`
```Javascript
const { gdrive } = require('lurcloud')

const result = gdrive('question')
//Funciona igual con dropbox

console.log(result)
```

```Javascript
const { fetchDownloadLinks, getDownloadLink } = require('lurcloud')

const link = await fetchDownloadLinks('fb.com', 'facebook')
//fb.com debera ser reemplazado por un enlace de algún video de Facebook

const videoUrl = getDownloadLink('facebook', link)
```

`Maker`
```Javascript
const { blue, comrade, rainbow } = require('lurcloud')

const input = '' //Aquí puedes configurar si quieres subir una imagen o un enlace de una imagen

const imageUrl = await blue(input)
//Cambia blue según la configuración que necesites
```

> [!WARNING]
> Este es un módulo experimental, no esta 100% completo y puede tener fallas.

> [!TIP]
> Si encuentras un fallo o quieres agregar una nueva función, puedes hacer un pull request.
