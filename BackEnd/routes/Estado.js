const Express = require('express')
const Estado = Express.Router()
const EstadoModel = require('../models').Estado

Estado.get('/', (req, res) => {
    EstadoModel.findAll()
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(404).json({'Error': err})
    });
})

module.exports = Estado
