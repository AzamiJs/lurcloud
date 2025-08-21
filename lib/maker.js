const fetch = require('node-fetch')

async function gay(message) {
let imageBuffer

if (message.image) {
imageBuffer = await message.download()
} else if (message.url) {
const res = await fetch(message.url)
imageBuffer = await res.buffer()
} else {
throw new Error('No se proporcionó ninguna imagen')
}

const base64 = imageBuffer.toString('base64')

const res = await fetch('https://some-random-api.com/canvas/gay', {
method: 'POST',
body: JSON.stringify({ avatar: `data:image/png;base64,${base64}` }),
headers: { 'Content-Type': 'application/json' }
})

if (!res.ok) throw new Error('Error al procesar la imagen')

const data = await res.json()
if (!data?.url) throw new Error('No se recibió la URL de la imagen')

return data.url
}

module.exports = { gay }
