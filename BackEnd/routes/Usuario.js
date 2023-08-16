const Express = require('express')
const { Op } = require('sequelize')
 
const UsuarioModel = require('../models').Usuario
const EstadoModel = require('../models').Estado
const Usuario = Express.Router()

Usuario.get('/', (req, res) => {
    UsuarioModel.findAll({
        include: {model: EstadoModel, attributes: ['descripcion']},
        attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
    })
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(404).json({'Error': err})
    });
})

Usuario.post('/', (req, res) => {
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

Usuario.put('/:idUsuario', (req, res) => {
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

Usuario.delete('/:idUsuario', (req, res) => {
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




module.exports = Usuario