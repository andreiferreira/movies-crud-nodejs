const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { route } = require('./admin');

router.get('/registro', (req, res) =>{
    res.render('usuarios/registro');
})

router.post('/registro', (req, res) =>{
    const erros = [];

    if(req.body.nome == undefined || req.body.nome.length < 2){
        erros.push({message: "Campo 'nome' deve ser preenchido com no mínimo 3 caracteres!"});
    }
    if(req.body.email == undefined || req.body.email.length <= 2){
        erros.push({message: "Campo 'email' deve ser preenchido com no mínimo 3 caracteres!"});
    }
    if(req.body.senha == undefined || req.body.senha.length <= 3){
        erros.push({message: "Campo 'senha' deve ser preenchido com no mínimo 4 caracteres!"});
    }

    if(req.body.senha != req.body.senha2){
        erros.push({message: 'As senhas não conferem, por favor tente novamente.'});
    }

    if(erros.length > 0) {
        res.render('usuarios/registro', {erros: erros})
    }else{
        User.findOne({email: req.body.email}).lean()
            .then(usuario =>{
                if(usuario){
                    req.flash('success_msg', 'Já existe um usuário com este email.')
                    res.redirect('/usuarios/registro');
                }else{
                    const novoUsuario = new User ({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha
                    })

                    console.log(novoUsuario.senha)
                    console.log(novoUsuario.nome);

                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                            if(erro){
                                req.flash('success_msg', 'Houve um erro durante o salvamento do usuário');
                                console.log(erro)
                                console.log(novoUsuario.senha)
                                res.redirect('/');
                            }else{
                                novoUsuario.senha = hash;
                                novoUsuario.save()
                                    .then(() => {
                                        req.flash('success_msg', 'Usuário salvo com sucesso!');
                                        res.redirect('/');
                                    }).catch(err => {
                                        req.flash('error_msg', 'Houve um erro ao tentar salvar o usuário, por favor tente novamente');
                                        res.redirect('/usuarios/registro');
                                    })
                            }
                        })
                    })
                }
            }).catch(err => {
                req.flash('error_msg', 'Houve um erro interno');
                res.redirect('/');
            })

        }
})

router.get('/login', (req, res) =>{
    res.render('usuarios/login');
})


router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Deslogado com sucesso.')
    res.redirect('/')
})

module.exports = router;

