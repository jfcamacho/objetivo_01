const Express = require('express')
const { Op } = require('sequelize')
const Bcrypt = require('bcrypt')
const autenticar = require('../middlewares/Autenticar')
 
const UsuarioModel = require('../models').Usuario
const PersonaModel = require('../models').Persona
const EstadoModel = require('../models').Estado
const Usuario = Express.Router()

Usuario.get('/', autenticar, (req, res) => {
    UsuarioModel.findAll({
        offset: req.body.page*10,
        limit: 10,
        include: {
            model: EstadoModel, attributes: ['descripcion'],
            model: PersonaModel, attributes: ['nombres', 'apellidos']
        },
        attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
    })
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(404).json({'Error': err})
    });
})

Usuario.post('/', autenticar, (req, res) => {
    encriptarPassword(req)
    .then((result) => {
        req.body.password = result
        UsuarioModel.findOrCreate({
            where: {[Op.or]: [
                {username: req.body.username},
                {idPersona: req.body.idPersona}
            ]},
            defaults: req.body
        })
        .then(([result, created]) => {
            if(created && result){
                res.status(200).json({'Estado': 'Creado', 'Msj': `El usuario ${req.body.username} ha sido correctamente creado`})
            }else{
                res.status(200).json({'Estado': 'Error', 'Msj': `El usuario ${req.body.username} ha sido creado anteriormente o la persona ya cuenta con un usuario`})
            }
        }).catch((err) => {
            res.status(404).json({'Estado': 'Error', 'Error': err})
        });
    })
})

Usuario.put('/:idUsuario', autenticar, (req, res) => {

    encriptarPassword(req).then(result => {
        req.body.password = result
        UsuarioModel.update( req.body, {
            where: {'id': req.params.idUsuario}
        })
        .then((result) => {
            if(result){
                res.status(200).json({'Estado': 'Correcto', 'Msj': `El usuario ${req.params.idUsuario} ha sido correctamente actualizado`})
            }
        }).catch((err) => {
            res.status(404).json({'Estado': 'Error', 'Error': err})
        });
    })

})

Usuario.delete('/:idUsuario', autenticar, (req, res) => {
    UsuarioModel.destroy({
        where: {'id': req.params.idUsuario}
    })
    .then((result) => {
        if(result){
            res.status(200).json({'Estado': 'Correcto', 'Msj': `El usuario ${req.body.username} ha sido eliminado`})
        }
    }).catch((err) => {
        res.status(404).json({'Estado': 'Error', 'Error': err})
    });
})

Usuario.get('/buscar', autenticar, (req, res) => {
    buscarUsuario(req)
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(404).json({'Error': err})
    });
})

//Funciones

async function buscarUsuario(req){
    let Usuario = await  UsuarioModel.findAll({
        offset: req.body.page*10,
        limit: 10,
        where: {[Op.or]:{
            username: {[Op.like]: `%${req.body.username}%`},
            idEstado: {[Op.like]: `%${req.body.idEstado}%`}
        }}
    })
    return Usuario
}

async function encriptarPassword(req){
    let salt =  Bcrypt.genSaltSync(10)
    return await Bcrypt.hashSync(req.body.password, salt)
}



module.exports = Usuario