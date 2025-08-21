const fetch = require('node-fetch')
const FormData = require('form-data')
const API_KEY = 'ac838c309fcc94c8be1f8e753804c924'

async function uploadImage(base64Image) {
const form = new FormData()
form.append('image', base64Image)

let res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
method: 'POST',
body: form
})

let json = await res.json()
return json.data.url
}

async function rainbow(image) {
let imageUrl = Buffer.isBuffer(image) ? await uploadImage(image.toString('base64')) : image
return `https://some-random-api.com/canvas/gay?avatar=${encodeURIComponent(imageUrl)}`
}

async function blur(image) {
let imageUrl = Buffer.isBuffer(image) ? await uploadImage(image.toString('base64')) : image
return `https://some-random-api.com/canvas/blur?avatar=${encodeURIComponent(imageUrl)}`
}

async function invert(image) {
let imageUrl = Buffer.isBuffer(image) ? await uploadImage(image.toString('base64')) : image
return `https://some-random-api.com/canvas/invert?avatar=${encodeURIComponent(imageUrl)}`
}

async function blue(image) {
let imageUrl = Buffer.isBuffer(image) ? await uploadImage(image.toString('base64')) : image
return `https://some-random-api.com/canvas/blue?avatar=${encodeURIComponent(imageUrl)}`
}

async function greyscale(image) {
let imageUrl = Buffer.isBuffer(image) ? await uploadImage(image.toString('base64')) : image
return `https://some-random-api.com/canvas/greyscale?avatar=${encodeURIComponent(imageUrl)}`
}

async function circle(image) {
let imageUrl = Buffer.isBuffer(image) ? await uploadImage(image.toString('base64')) : image
return `https://some-random-api.com/canvas/circle?avatar=${encodeURIComponent(imageUrl)}`
}

async function heart(image) {
let imageUrl = Buffer.isBuffer(image) ? await uploadImage(image.toString('base64')) : image
return `https://some-random-api.com/canvas/heart?avatar=${encodeURIComponent(imageUrl)}`
}

module.exports = { rainbow, blur, invert, blue, greyscale, circle, heart }
