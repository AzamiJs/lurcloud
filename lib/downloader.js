const fetch = require('node-fetch')
const axios = require('axios')
const cheerio = require('cheerio')
const { lookup } = require('mime-types')


function formatSize(bytes) {
if (!bytes) return 'unknown'
const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
const i = Math.floor(Math.log(bytes) / Math.log(1024))
return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}


async function gdrive(url) {
if (!(url && url.match(/drive\.google/i))) throw new Error('Invalid URL')
const id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))?.[1]
if (!id) throw new Error('ID Not Found')

const res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
method: 'post',
headers: {
'accept-encoding': 'gzip, deflate, br',
'content-length': 0,
'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
'origin': 'https://drive.google.com',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
'x-drive-first-party': 'DriveWebUi',
'x-json-requested': 'true'
}
})

const text = await res.text()

const { fileName, sizeBytes, downloadUrl } = JSON.parse(text.slice(4))
if (!downloadUrl) throw new Error('Link Download Limit!')

const data = await fetch(downloadUrl)
if (data.status !== 200) throw new Error(data.statusText)

return {
downloadUrl,
fileName,
fileSize: formatSize(sizeBytes),
mimetype: data.headers.get('content-type')
}
}


async function dropbox(url) {
if (!url || !url.match(/dropbox\.com/i)) throw new Error('URL inválida de Dropbox')

const directLink = url.replace('dl=0', 'dl=1')

let res = await fetch(directLink, { method: 'HEAD' })
if (!res.ok) throw new Error('No se pudo acceder al archivo')

let fileName = res.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] || 'archivo_desconocido'
let fileSize = res.headers.get('content-length')

if (!fileSize) {
const rangeRes = await fetch(directLink, { method: 'GET', headers: { Range: 'bytes=0-0' } })
fileSize = rangeRes.headers.get('content-range')?.split('/')[1] || null
}

return {
downloadUrl: directLink,
fileName,
fileSize: formatSize(fileSize ? parseInt(fileSize) : null),
mimetype: res.headers.get('content-type') || 'application/octet-stream'
}
}


async function mediafire(url) {
try {
if (!url.includes('mediafire.com')) throw new Error('URL de MediaFire inválida')

let res, $, link

try {
res = await axios.get(url, {
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}
})
$ = cheerio.load(res.data)

const downloadButton = $('#downloadButton')
link = downloadButton.attr('href')

if (!link || link.includes('javascript:void(0)')) {
link = downloadButton.attr('data-href') || downloadButton.attr('data-url') || downloadButton.attr('data-link')

const scrambledUrl = downloadButton.attr('data-scrambled-url')
if (scrambledUrl) {
try { link = atob(scrambledUrl) } catch {}
}

if (!link || link.includes('javascript:void(0)')) {
const htmlContent = res.data
const linkMatch = htmlContent.match(/href="(https:\/\/download\d+\.mediafire\.com[^"]+)"/)
if (linkMatch) link = linkMatch[1]
else {
const altMatch = htmlContent.match(/"(https:\/\/[^"]*mediafire[^"]*\.(zip|rar|pdf|jpg|jpeg|png|gif|mp4|mp3|exe|apk|txt)[^"]*)"/i)
if (altMatch) link = altMatch[1]
}
}
}
} catch (directError) {
const translateUrl = `https://www-mediafire-com.translate.goog/${url.replace('https://www.mediafire.com/', '')}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`
res = await axios.get(translateUrl, {
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}
})
$ = cheerio.load(res.data)

const downloadButton = $('#downloadButton')
link = downloadButton.attr('href')
if (!link || link.includes('javascript:void(0)')) {
const scrambledUrl = downloadButton.attr('data-scrambled-url')
if (scrambledUrl) {
try { link = atob(scrambledUrl) } catch {}
}
}
}

if (!link || link.includes('javascript:void(0)')) throw new Error('No se encontró un enlace válido')

const name = $('body > main > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').attr('title')?.replace(/\s+/g, '')?.replace(/\n/g, '') || $('.dl-btn-label').attr('title') || $('.filename').text().trim() || 'archivo_descargado'

const date = $('body > main > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text().trim() || $('.details li:nth-child(2) span').text().trim() || 'Fecha no disponible'

const size = $('#downloadButton').text().replace('Download', '').replace(/[()]/g, '').replace(/\n/g, '').replace(/\s+/g, ' ').trim() || $('.details li:first-child span').text().trim() || 'Tamaño no disponible'

const ext = name.split('.').pop()?.toLowerCase()
const mime = lookup(ext) || 'application/octet-stream'

return { name, size, date, mime, link }
} catch (e) {
throw new Error(`Error al procesar MediaFire: ${e.message}`)
}
}


async function fetchDownloadLinks(text, platform, m) {
const { SITE_URL, form } = createApiRequest(text, platform)

const res = await axios.post(`${SITE_URL}api`, form.toString(), {
headers: {
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'Origin': SITE_URL,
'Referer': SITE_URL,
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
'X-Requested-With': 'XMLHttpRequest'
}
})

const html = res?.data?.html

if (!html || res?.data?.status !== 'success') {
console.log('Error al obtener datos del servidor')
return null
}

const $ = cheerio.load(html)
const links = []

$('a.btn[href^="http"]').each((_, el) => {
const link = $(el).attr('href')
if (link && !links.includes(link)) {
links.push(link)
}
})

return links
}

function createApiRequest(text, platform) {
const SITE_URL = 'https://instatiktok.com/'
const form = new URLSearchParams()
form.append('url', text)
form.append('platform', platform)
form.append('siteurl', SITE_URL)
return { SITE_URL, form }
}

function getDownloadLink(platform, links) {
if (platform === 'instagram') {
return links
} else if (platform === 'tiktok') {
return links.find(link => /hdplay/.test(link)) || links[0]
} else if (platform === 'facebook') {
return links.at(-1)
}
return null
}


module.exports = { gdrive, dropbox, mediafire, fetchDownloadLinks, getDownloadLink }
