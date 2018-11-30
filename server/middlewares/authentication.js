const jwt = require('jsonwebtoken')

let verifyToken = (req, res, next) => {
    let token = req.get('Authorization')

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.user = decoded.user

        next()
    })
}

let verifyAdminRole = (req, res, next) => {
    const user = req.user

    if (user.role !== 'ADMIN_ROLE')
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Only admin users can add new users'
            }
        })

    next()
}

module.exports = {
    verifyToken,
    verifyAdminRole
}