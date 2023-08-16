const Express = require('express')

//Definición de las ruas
const RouteEstado = require('./Estado')
const RoutePersona = require('./Persona')
const RouteUsuario = require('./Usuario')

const Routes = Express()

Routes.use('/estado', RouteEstado)
Routes.use('/persona', RoutePersona)
Routes.use('/usuario', RouteUsuario)

module.exports = Routes