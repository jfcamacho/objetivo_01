const jwt = require('jsonwebtoken')
const config = require('config')

let autenticar = (req, res, next) => {
    let token = process.env.token
    jwt.verify(token, config.get("SEED.PrivateKey"), (err, decoded) => {
        if(err){
            res.status(200).json('Usuario no autenticado')
        }else{
            let JWT = jwt.sign({Persona: decoded.Persona}, config.get('SEED.PrivateKey'), {expiresIn: config.get('SEED.ExpiresIn')})
            process.env.token = JWT
            next()
        }
    })
}

module.exports = autenticar