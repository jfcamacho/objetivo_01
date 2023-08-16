const Express = require('express')
const JWT = require('jsonwebtoken')
const Config = require('config')
const Bcrypt = require('bcrypt')
const UsuarioModel = require('../models').Usuario
const PersonaModel = require('../models').Persona
const { Op } = require('sequelize')

const Auth = Express.Router()

Auth.post('/', (req, res) => {
    UsuarioModel.findOne({
        include: {model: PersonaModel, attributes: ['nombres', 'apellidos']},
        exclude: ['createdAt', 'updatedAt'],
        where: {[Op.and]: {
            idEstado: 1,
            username: req.body.username
        }}
    })
    .then((result) => {
        if(result){
            let validarPassword = Bcrypt.compareSync(req.body.password, result.password)
            if(validarPassword){
                let user = {Persona: [result.Persona.nombres+' '+result.Persona.apellidos, result.username, result.idPersona] }
                let jwt = JWT.sign(user, Config.get('SEED.PrivateKey'), {expiresIn: Config.get('SEED.ExpiresIn')})
                process.env.token = jwt
                res.status(200).json({'Persona': user, 'Token': jwt})
            }else{
                res.status(200).json('El usuario o la contraseña son incorrectos')
            }
        }else{
            res.status(200).json('El usuario o la contraseña son incorrectos')
        }
    }).catch((err) => {
        res.status(404).json({'Error': err})
    });
})

module.exports = Auth