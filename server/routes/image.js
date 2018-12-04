const express = require('express')
const fs = require('fs')
const path = require('path')
const { verifyTokenImg } = require('../middlewares/authentication')

const app = express()

app.get('/image/:type/:img', verifyTokenImg, (req, res) => {
	const { type, img } = req.params

	let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`)

	if (fs.existsSync(pathImage)) {
		res.sendFile(pathImage)
	} else {
		let noImgPath = path.resolve(__dirname, '../assets/no-image.jpg')
		res.sendFile(noImgPath)
	}
})

module.exports = app
