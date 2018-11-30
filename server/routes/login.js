const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const app = express()

app.post('/login', (req, res) => {
    const {
        body
    } = req

    User.findOne({
        email: body.email
    }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not valid'
                }
            })
        }

        if (!bcryptjs.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Password not valid'
                }
            })
        }

        const token = jwt.sign({
            user
        }, process.env.TOKEN_SEED, {
            expiresIn: process.env.TOKEN_EXPIRATION_TIME
        })

        res.json({
            ok: true,
            user,
            token
        })
    })
})

module.exports = app