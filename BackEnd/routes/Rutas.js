const Express = require('express')

//Definición de las ruas
const RouteEstado = require('./Estado')
const RoutePersona = require('./Persona')
const RouteUsuario = require('./Usuario')
const RouteAuth = require('./Auth')
const RouteArchivo = require('./Archivo')
const RouteReporte = require('./Reporte')

const Routes = Express()

Routes.use('/estado', RouteEstado)
Routes.use('/persona', RoutePersona)
Routes.use('/usuario', RouteUsuario)
Routes.use('/auth', RouteAuth)
Routes.use('/archivo', RouteArchivo)
Routes.use('/reporte', RouteReporte)

module.exports = Routes