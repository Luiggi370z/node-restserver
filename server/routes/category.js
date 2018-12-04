const express = require('express')
const {
    verifyToken,
    verifyAdminRole
} = require('../middlewares/authentication')
const Category = require('../models/category')

let app = express()

app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            handleError(err, res)

            res.json({
                ok: true,
                categories
            })
        })
})

app.get('/category/:id', verifyToken, (req, res) => {
    const categoryId = req.params.id

    Category.findById(categoryId, (err, category) => {
        handleError(err, res)

        if (!category) {
            return res.json({
                ok: false,
                err: {
                    message: `Category with id ${categoryId} was not found.`
                }
            })
        }

        res.json({
            ok: true,
            category
        })
    })
})

app.post('/category', verifyToken, (req, res) => {
    let {
        body
    } = req

    let category = new Category({
        description: body.description,
        user: req.user._id
    })

    category.save((err, newCategory) => {
        handleError(err, res)

        if (!newCategory) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: newCategory
        })
    })
})

app.put('/category/:id', verifyToken, (req, res) => {
    const categoryId = req.params.id

    Category.findByIdAndUpdate(
        categoryId, {
            description: req.body.description
        }, {
            new: true,
            runValidators: true
        },
        (err, updatedCategory) => {
            handleError(err, res)

            res.json({
                ok: true,
                category: updatedCategory
            })
        })
})

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    const categoryId = req.params.id

    Category.findByIdAndRemove(categoryId, (err, removedCategory) => {
        handleError(err, res)

        if (!removedCategory) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `Category with id ${categoryId} was not found.`
                }
            })
        }

        res.json({
            ok: true,
            category: removedCategory
        })
    })
})

function handleError(err, res) {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
}

module.exports = app