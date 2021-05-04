const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const usuarios = require('./routes/usuario');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Filme');
require('./models/Genero');
const Filme = mongoose.model('Filme');
const Genero = mongoose.model('Genero');
const passport = require('passport');
require('./config/auth')(passport);
const db = require('./config/db');


app.use(session({
    secret: 'andrei',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");    
    res.locals.error = req.flash("error");   
    res.locals.user = req.user || null;
    next();
})

//body-parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main', runtimeOptions:{
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,

}}))
app.set('view engine', 'handlebars');

//public
app.use(express.static(path.join(__dirname, "public")))

//mongoose
mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log('banco conectado');
})

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/filmes', (req, res) => {
    Filme.find().populate('genero').sort({data: 'desc'}).lean()
        .then(filmes => {
            res.render('filmes/listaFilmes', {filmes: filmes})
        }).catch(err => {
            req.flash('error_msg', 'Não foi possivel listar os filmes.');
            res.redirect('/404');
        })
})

app.get('/filme/:slug', (req, res) => {
    Filme.findOne({slug: req.params.slug}).populate('genero').sort({data: 'desc'}).lean()
        .then(filme => {
            if(filme){
                res.render('filmes/index', {filme: filme})
            }else{
                req.flash('error_msg', 'Não foi possivel exibir o filme desejado, por favor tente novamente');
                res.redirect('/');
            }
        })
})

app.get('/404', (req, res) => {
    res.send('ERROR 404!');
})

app.get('/generos', (req, res) => {
    Genero.find().lean()
        .then(generos =>{
            res.render('generos/index', {generos: generos})
        }).catch(err => {
            req.flash('error_msg', 'Não foi possivel listar os gêneros')
            res.redirect('/');
        })
})

app.get('/generos/:slug', (req, res) => {
    Genero.findOne({slug: req.params.slug}).lean()
        .then(genero => {
            if(genero){
                Filme.find({genero: genero._id})
                    .then(filmes => {
                        res.render('generos/filmes', {filmes: filmes, genero: genero})
                    }).catch(err =>{
                        req.flash('error_msg', 'Houve um erro ao listar os filme do gênero escolhido');
                        res.redirect('/');
                    })
            }else{
                req.flash('error_msg', 'Este gênero não existe');
                res.redirect('/');
            }
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao tentar carregar o gênero');
            res.redirect('/');
        })
})

//Routas
app.use('/admin', admin);
app.use('/usuarios', usuarios)
 

const PORT = process.env.PORT || 3334
app.listen(PORT, () => {
    console.log('Servidor rodando');
})



