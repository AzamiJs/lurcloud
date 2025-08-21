const { gdrive, dropbox, mediafire, fetchDownloadLinks, getDownloadLink } = require('./lib/downloader')
const { rainbow, blur, invert, blue, greyscale, circle } = require('./lib/maker')

module.exports = {
gdrive, dropbox, mediafire,
fetchDownloadLinks, getDownloadLink,

rainbow, blur, invert, blue,
greyscale, circle
}
