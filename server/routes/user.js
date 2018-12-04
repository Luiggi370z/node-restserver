const express = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')

const app = express()
const {
    verifyToken,
    verifyAdminRole
} = require('../middlewares/authentication')

app.get('/user', verifyToken, (req, res) => {

    const from = Number(req.query.from) || 0
    const limit = Number(req.query.limit) || 0

    User.find({
            state: true
        }, 'name email role state google')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.countDocuments({
                state: true
            }, (err, total) => {
                res.json({
                    ok: true,
                    total,
                    users
                })
            })
        })
})

app.post('/user', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body


    let user = new User({
        name: body.name,
        email: body.email,
        password: bcryptjs.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
})

app.put('/user/:id', verifyToken, (req, res) => {
    let id = req.params.id

    const validFields = ['name', 'email', 'img', 'role', 'state']
    const changes = {}

    Object.keys(req.body)
        .filter(key => validFields.includes(key))
        .forEach(key => changes[key] = req.body[key])

    User.findByIdAndUpdate(id, changes, {
        new: true,
        runValidators: true
    }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user
        })
    })
})
app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id

    // User.findByIdAndRemove(id, (err, user) => {
    User.findByIdAndUpdate(id, {
        state: false
    }, {
        new: true
    }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            })
        }

        res.json({
            ok: true,
            user
        })
    })
})

module.exports = app