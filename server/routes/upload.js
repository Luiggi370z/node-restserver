const express = require('express')
const fs = require('fs')
const path = require('path')
const fileUpload = require('express-fileupload')

const User = require('../models/user')
const Product = require('../models/product')

const app = express()

app.use(fileUpload())

app.put('/upload/:type/:id', (req, res) => {
	const { type, id } = req.params

	if (!req.files)
		return res.status(400).json({
			error: {
				message: 'No files found'
			}
		})

	const validTypes = ['products', 'users']

	if (!validTypes.includes(type))
		return res.status(400).json({
			ok: false,
			error: {
				message: `Valid types are ${validTypes.join(',')}`,
				type
			}
		})

	let file = req.files.file
	let fileNameParts = file.name.split('.')
	let fileExtension = fileNameParts[fileNameParts.length - 1]

	const validExtensions = ['png', 'jpg', 'gif', 'jpeg']

	if (!validExtensions.includes(fileExtension))
		return res.status(400).json({
			ok: false,
			error: {
				message: `Valid extensions are ${validExtensions.join(',')}`,
				extension: fileExtension
			}
		})

	let newFileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`

	file.mv(`uploads/${type}/${newFileName}`, err => {
		if (err)
			return res.status(500).json({
				ok: false,
				err
			})
		let entity = type === 'products' ? Product : User

		uploadImage(id, res, newFileName, type, entity)
	})
})

const uploadImage = (id, res, fileName, type, entity) => {
	entity.findById(id, (err, item) => {
		if (err) {
			removeFile(fileName, type)

			return res.status(500).json({
				ok: false,
				err
			})
		}

		if (!item) {
			removeFile(fileName, type)

			return res.status(400).json({
				ok: false,
				error: {
					message: 'Item not found'
				}
			})
		}

		removeFile(item.img, type)

		item.img = fileName

		item.save((err, savedItem) => {
			res.json({
				ok: true,
				item: savedItem,
				img: fileName
			})
		})
	})
}

const removeFile = (imgName, type) => {
	let pathImg = path.resolve(__dirname, `../../uploads/${type}/${imgName}`)

	if (fs.existsSync(pathImg)) {
		fs.unlinkSync(pathImg)
	}
}

module.exports = app
