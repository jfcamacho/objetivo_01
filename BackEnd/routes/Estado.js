const Express = require('express')
const Estado = Express.Router()
const EstadoModel = require('../models').Estado
const autenticar = require('../middlewares/Autenticar')

Estado.get('/', autenticar, (req, res) => {
    EstadoModel.findAll()
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(404).json({'Error': err})
    });
})

Estado.post('/', autenticar, (req, res) => {
    EstadoModel.create(req.body)
    .then((result) => {
        if(result){
            res.status(200).json({'Estado': req.body.abreviatura, 'Msj': 'Ha sido correctamente creado'})
        }
    }).catch((err) => {
        res.status(404).json({'Error': err})
    });
})

Estado.put('/:idEstado', autenticar, (req, res) => {
    EstadoModel.update( req.body, {
        where: {id: req.params.idEstado}
    })
    .then((result) => {
        if(result){
            res.status(200).json({'Estado': req.params.idEstado, 'Msj': 'El estado ha sido correctamente actualizado'})
        }
    }).catch((err) => {
        res.status(404).json({'Eror': err})
    });
})

Estado.delete('/:idEstado', autenticar, (req, res) => {
    EstadoModel.destroy({
        where: {'id': req.params.idEstado}
    })
    .then((result) => {
        if(result){
            res.status(200).json({'Estado': req.params.idEstado, 'Msj': 'El estado ha sido correctamente eliminado'})
        }
    }).catch((err) => {
        res.status(404).json({'Eror': err})
    });
})

module.exports = Estado
