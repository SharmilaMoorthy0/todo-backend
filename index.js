const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./Routes/user.routes')
const todoRoutes= require('./Routes/todo.routes')

const PORT = process.env.PORT || 8000

const app = express()

app.use(express.json())

app.use(cors())

app.use('/', userRoutes)
app.use('/',todoRoutes)



const URI = "mongodb+srv://sharmilamoorthy:sharmilamoorthy@cluster0.qqbwzvc.mongodb.net/"
mongoose.connect(URI).then(() => {
    app.listen(PORT, () => {
        console.log(`server is running in ${PORT}`)
        console.log(`mongodb connected`)
    })
}).catch((err) => {
    console.log(err)
})