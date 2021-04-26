const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');

//body-parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

//public
app.use(express.static(path.join(__dirname, "public")))

//mongoose
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/movies-crud", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log('banco conectado');
})


app.get('/', (req, res) => {
    res.send('oiiaaa');
})

//Routas
app.use('/admin', admin);
 

const PORT = 3334
app.listen(PORT, () => {
    console.log('Servidor rodando');
})



