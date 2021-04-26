const { Router } = require('express');
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Genero");
const Genero = mongoose.model('Genero');

router.get('/', (req, res) => {
    res.render('admin/index');
})

router.get('/generos', (req, res) => {
    res.render('admin/generos');
})

router.get('/generos/add', (req, res) => {
    res.render('admin/addGenero')
})

router.post('/generos/add', (req, res) => {
    const novoGenero = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        slug: req.body.slug
    }

    new Genero(novoGenero).save()
        .then(() => {
            console.log('Categoria salvo com sucesso');
            res.redirect('/admin/generos')
        }).catch((err) => {
            console.log('Erro ao salvar categoria', err);
        })
    
})

module.exports = router;