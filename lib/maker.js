const fetch = require('node-fetch')
const FormData = require('form-data')

const API_KEY = 'ac838c309fcc94c8be1f8e753804c924'

async function gay(buffer) {
if (!buffer) throw new Error('No se proporcionó ninguna imagen')

const base64Image = buffer.toString('base64')

const form = new FormData()
form.append('image', base64Image)

const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
method: 'POST',
body: form
})

const json = await res.json()
if (!json.success || !json.data?.url) throw new Error('Error al subir la imagen')

// obtenemos la URL subida
const imageUrl = json.data.url

// generamos la URL de la API gay
return `https://some-random-api.com/canvas/gay?avatar=${encodeURIComponent(imageUrl)}`
}

module.exports = { gay }
