const Express = require('express')

const EstadoRouter = require('./routes/Estado')

const App = Express()
const Port = process.env.Port || 3000

App.use(Express.json())
App.use(Express.urlencoded({extended: true}))

App.use('/Estado', EstadoRouter)

App.get('/', (req, res) => {
    res.status(200).json('Servidor iniciado de forma correcta')
})

App.listen(Port ,() => {
    console.log(`Servicio iniciado en el puerto ${Port}`);
})