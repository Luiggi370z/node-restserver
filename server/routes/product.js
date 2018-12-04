const express = require('express')

const { verifyToken } = require('../middlewares/authentication')

let app = express()
let Product = require('../models/product')

app.get('/product/search/:field', verifyToken, (req, res) => {
	let field = req.params.field

	let regex = new RegExp(field, 'i')

	Product.find({ name: regex })
		.populate('user', 'name email')
		.populate('category', 'description')
		.exec((err, products) => {
			handleError(err, res)

			res.json({
				ok: true,
				products
			})
		})
})

app.get('/product', verifyToken, (req, res) => {
	const from = Number(req.query.from) || 0
	const limit = Number(req.query.limit) || 0

	Product.find({ available: true })
		.skip(from)
		.limit(limit)
		.populate('user', 'name email')
		.populate('category', 'description')
		.exec((err, products) => {
			handleError(err, res)

			Product.countDocuments((err, total) => {
				handleError(err, res)

				res.json({
					ok: true,
					total,
					products
				})
			})
		})
})

app.get('/product/:id', (req, res) => {
	const productId = req.params.id

	Product.findById(productId, (err, product) => {
		handleError(err, res)

		if (!product) {
			return res.json({
				ok: false,
				error: {
					message: `Product with id ${productId} not found`
				}
			})
		}

		res.json({
			ok: true,
			product
		})
	})
		.populate('user', 'name email')
		.populate('category', 'description')
})

app.post('/product', verifyToken, (req, res) => {
	const { body } = req

	let newProduct = new Product({
		name: body.name,
		price: body.price,
		description: body.description,
		// available: body.,
		category: body.category,
		user: req.user._id
	})

	newProduct.save((err, savedProduct) => {
		handleError(err, res)

		if (!savedProduct) {
			return res.status(400).json({
				ok: false,
				err
			})
		}

		res.json({
			ok: true,
			product: savedProduct
		})
	})
})

app.put('/product/:id', (req, res) => {
	const { body } = req
	const productId = req.params.id

	Product.findByIdAndUpdate(
		productId,
		body,
		{
			new: true,
			runValidators: true
		},
		(err, updatedProduct) => {
			handleError(err, res)

			res.json({
				ok: true,
				product: updatedProduct
			})
		}
	)
})

app.delete('/product/:id', (req, res) => {
	const productId = req.params.id

	Product.findByIdAndUpdate(
		productId,
		{ available: false },
		{ new: true },
		(err, product) => {
			handleError(err, res)

			if (!product) {
				return res.json({
					ok: false,
					error: {
						message: `Product with id ${productId} not found`
					}
				})
			}

			res.json({
				ok: true,
				product
			})
		}
	)
})

const handleError = (err, res) => {
	if (err) {
		return res.status(500).json({
			ok: false,
			err
		})
	}
}

module.exports = app
