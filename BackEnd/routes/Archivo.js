const Express = require('express')
const ArchivoModel = require('../models').Archivo
const Archivo = Express.Router()
const Multer = require('multer')
const {Op} = require('sequelize')
const fs = require('fs').promises

const upload = Multer({
    storage: Multer.diskStorage({
        destination: 'uploads/',
        filename: function(req, file, cb) {
            cb("", Date.now()+"-"+file.originalname)
        }
    })
})

Archivo.put('/:idArchivo', upload.single('archivo'), (req, res) => {
    ArchivoModel.findOne({
        where: {id: req.params.idArchivo}
    })
    .then((result) => {
        if(result){
            fs.unlink(result.path)
            .then(() => {
                    ArchivoModel.update({
                        nombre:  req.file.originalname,
                        path:  req.file.path,
                        idEstado: req.body.idEstado
                    }, {
                        where: {id: req.params.idArchivo}
                    })
                    .then((result) => {
                        console.log('archivo actualizado');
                        if(result){
                            res.status(200).json({'Estado':'Corrrecto','Msj': `El archivo ${req.file.originalname} ha sido correctamente actualizado`})
                        }
                    }).catch((err) => {
                        res.status(200).json({'Estado': 'Error 3', 'Error': err})
                    });
                }
            ).catch((err) => {
                res.status(200).json({'Estado': 'Error 1', 'Error': err})
            });
        }
    }).catch((err) => {
        res.status(200).json({'Estado': 'Error 0', 'Error': err})
    });
})

Archivo.get('/', (req, res) => {
    buscarArchivos(req)
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(200).json({'Estado': 'Error', 'Error': err})
    });
})

Archivo.post('/', upload.single('archivo'), (req, res) => {
    ArchivoModel.create({
        idUsuario:  req.body.idUsuario,
        nombre:  req.file.originalname,
        path:  req.file.path,
        idEstado: req.body.idEstado
    })
    .then((result) => {
        if(result){
            res.status(200).json({'Estado':'Corrrecto','Msj': `El archivo ${req.file.originalname} ha sido correctamente cargado`})
        }
    }).catch((err) => {
        res.status(200).json({'Estado': 'Error', 'Error': err})
    });
    
})

Archivo.delete('/:idArchivo', (req, res) => {
    ArchivoModel.findOne({
        where: {id: req.params.idArchivo}
    })
    .then((result) => {
        if(result){
            let nombreArchivo = result.nombre
            fs.unlink(result.path)
            .then(() => {
                    ArchivoModel.destroy({
                        where: {id: req.params.idArchivo}
                    })
                    .then((result) => {
                        if(result){
                            res.status(200).json({'Estado':'Corrrecto','Msj': `El archivo ${nombreArchivo} ha sido correctamente eliminado`})
                        }
                    }).catch((err) => {
                        res.status(200).json({'Estado': 'Error 3', 'Error': err})
                    });
                }
            ).catch((err) => {
                res.status(200).json({'Estado': 'Error 1', 'Error': err})
            });
        }
    }).catch((err) => {
        res.status(200).json({'Estado': 'Error 0', 'Error': err})
    });
})

async function buscarArchivos(req){
    return await ArchivoModel.findAll({
        attributes: {exclude:['createdAt', 'updatedAt']},
        offset: Number(req.body.page)*10,
        limit: 10,
        where: {[Op.and]: {
            idUsuario: {[Op.like]: `%${req.body.idUsuario}`},
            idEstado: {[Op.like]: `%${req.body.idEstado}`}
        }}
    })
}

module.exports = Archivo