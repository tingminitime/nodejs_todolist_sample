const http = require('http')
const PORT = process.env.PORT || '8080'
const todoRoute = require('./todo')

const server = http.createServer(todoRoute)
server.listen(PORT, console.log(`Server is running on PORT ${PORT} ...`))