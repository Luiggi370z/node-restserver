const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    OAuth2Client
} = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload()

    console.log('payload', payload)

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    const {
        idtoken
    } = req.body

    const googleUser = await verify(idtoken)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })
    console.log('google user', googleUser)

    User.findOne({
        email: googleUser.email
    }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (user) {
            if (!user.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'User must use the normal authentication.'
                    }
                })
            } else {
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
            }
        } else {
            let newUser = new User()

            newUser.name = googleUser.name
            newUser.email = googleUser.email
            newUser.img = googleUser.img
            newUser.google = googleUser.google
            newUser.password = ':)'

            newUser.save((err, savedUser) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                const token = jwt.sign({
                    user: savedUser
                }, process.env.TOKEN_SEED, {
                    expiresIn: process.env.TOKEN_EXPIRATION_TIME
                })

                res.json({
                    ok: true,
                    user: savedUser,
                    token
                })
            })
        }
    })
})

module.exports = app