const Express = require('express')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const PersonaModel = require('../models').Persona
const EstadoModel = require('../models').Estado
const Persona = Express.Router()

Persona.get('/paginar/:page', (req, res) => {
    PersonaModel.findAll({
        offset: Number(req.params.page)*10,
        limit: 10,
        include: {model: EstadoModel, attributes: ['descripcion']},
        attributes: {exclude: ['createdAt', 'updatedAt']}
    })
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(404).json({'Error': err})
    });
})

Persona.post('/', (req, res) => {
    PersonaModel.findOrCreate( {
        where: {'identificacion': req.body.identificacion},
        defaults: req.body
    })
    .then(([result, created]) => {
        if(created && result){
            res.status(200).json({'Estado': 'Creado', 'Msj': `La persona ${result.nombres} ha sido correctamente creada`})
        }else{
            res.status(200).json({'Estado': 'Error', 'Msj': `La persona ${result.nombres} ha sido creada anteriormente`})
        }
    }).catch((err) => {
        res.status(404).json({'Estado': 'Error', 'Error': err})
    });
})

Persona.put('/:idPersona', (req, res) => {
    PersonaModel.update( req.body, {
        where: {'id': req.params.idPersona}
    })
    .then((result) => {
        if(result){
            res.status(200).json({'Estado': 'Correcto', 'Msj': `La persona ${req.params.idPersona} ha sido correctamente actualizada`})
        }
    }).catch((err) => {
        res.status(404).json({'Estado': 'Error', 'Error': err})
    });

})

Persona.delete('/:idPersona', (req, res) => {
    PersonaModel.destroy({
        where: {'id': req.params.idPersona}
    })
    .then((result) => {
        if(result){
            res.status(200).json({'Estado': 'Correcto', 'Msj': `La persona ${req.body.nombres} ha sido eliminada`})
        }
    }).catch((err) => {
        res.status(404).json({'Estado': 'Error', 'Error': err})
    });
})

Persona.get('/buscar', (req, res) => {
    existePersona(req)
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(404).json(err)
    });
})

async function existePersona(req) {
    let Persona = await PersonaModel.findAll({
        where: {[Op.or]: {
            nombres: {[Op.like]: `%${req.body.valor}%`},
            identificacion: {[Op.like]: `%${req.body.valor}%`},
            apellidos: {[Op.like]: `%${req.body.valor}%`}
        }}
    })
    return Persona
}


module.exports = Persona