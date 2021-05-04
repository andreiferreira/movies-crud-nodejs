const { Router } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Genero");
require('../models/Filme');
const Genero = mongoose.model('Genero');
const Filme = mongoose.model('Filme');
const {ehAdmin} = require('../helpers/ehAdmin');

router.get('/',  ehAdmin, (req, res) => {
    res.render('admin/index');
})

router.get('/generos', ehAdmin, (req, res) => {
    Genero.find().sort({nome: 'asc'}).lean()
        .then((generos) => {
            res.render('admin/generos', {genero: generos});
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias, tente novamente');
            res.redirect('/admin')
        })
})

router.get('/generos/add', ehAdmin, (req, res) => {
    res.render('admin/addGenero')
})

router.post('/generos/add', ehAdmin, (req, res) => {
            
        const errors = [];

        if(req.body.nome == undefined || req.body.nome.length <= 3){
            errors.push({message: "Campo 'nome' deve ser preenchido com no mínimo 3 caracteres!"});
        }

        if(req.body.descricao == undefined || req.body.descricao.length <= 9){
            errors.push({message: "Campo 'descricao' deve ser preenchido com no mínimo 10 caracteres!"});
        }

        if(req.body.slug == undefined || req.body.slug.length <= 3){
            errors.push({message: "Campo 'slug' deve ser preenchido com no mínimo 3 caracteres!"});
        }

        if(errors.length > 0){
            res.render('admin/addGenero', {errors: errors})
        }else{
            const novoGenero = {
                nome: req.body.nome,
                descricao: req.body.descricao,
                slug: req.body.slug
            }
        
            new Genero(novoGenero).save()
                .then(() => {
                    req.flash('success_msg', 'Genero criado com sucesso.')
                    res.redirect("/admin/generos")
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possivel cadastrar um novo gênero, por favor tente novamente.')
                })
        }

    })

router.get('/generos/edicao/:id', ehAdmin, (req, res) => {
    Genero.findOne({_id : req.params.id}).lean()
        .then((genero => {
            res.render('admin/editGenero', {genero: genero})
        }))
})

router.post('/generos/edicao', ehAdmin, (req, res) => {
    Genero.findOne({_id: req.body.id})
        .then(genero => {

            if(req.body.nome === ""){
                genero.nome = genero.nome;
            }else{
                genero.nome = req.body.nome
            }
            if(req.body.descricao === ""){
                genero.descricao = genero.descricao;
            }else{
                genero.descricao = req.body.descricao
            }
            if(req.body.slug === ""){
                genero.slug = genero.slug
            }else[
                genero.slug = req.body.slug
            ]

            genero.save()
                .then(() => {
                    req.flash('success_msg', 'Gênero de filme atualizado com sucesso!');
                    res.redirect('/admin/generos');
                }).catch((err) => {
                    req.flash('error_msg', 'Gênero de filme não pode ser atualizado, tente novamente');
                    res.redirect('/admin/generos');
                })
        })
})



// -----------------------------------------ROTAS PARA FILMES----------------------------------------------

router.get('/filmes', ehAdmin, (req, res) => {
    Filme.find().populate('genero').sort({data: 'desc'}).lean()
        .then(filmes => {
            res.render('admin/filmes', {filmes: filmes});
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao lista os filmes');
            res.redirect('/admin');
        })
    
})

router.get('/filmes/add', ehAdmin, (req, res) => {
    Genero.find().sort({nome: 'asc'}).lean()
        .then(generos => {
            res.render('admin/addFilme', {generos: generos})
        }).catch(error => {
            req.flash('error_msg', 'Houve um erro ao carregar os gêneros de filmes');
            res.redirect()
        })
    
})

router.post('/filmes/add', ehAdmin, (req, res) => {

    const errors = [];

    if(req.body.titulo == undefined || req.body.titulo.length <= 1){
        errors.push({message: "Campo 'título' deve ser preenchido com no mínimo 2 caracteres!"});
    }

    if(req.body.diretor == undefined || req.body.diretor.length <= 1){
        errors.push({message: "Campo 'diretor' deve ser preenchido com no mínimo 2 caracteres!"});
    }

    if(req.body.genero == undefined){
        errors.push({message: "Campo 'diretor' deve ser preenchido!"});
    }

    if(req.body.lancamento == ""){
        errors.push({message: "Campo 'lançamento' deve ser preenchido!"});
    }

    if(req.body.sinopse == undefined || req.body.sinopse <= 11){
        errors.push({message: "Campo 'sinopse' deve ser preenchido com no mínimo 10 caracteres!"});
    }

    if(req.body.slug == undefined || req.body.slug.length <= 1){
        errors.push({message: "Campo 'slug' deve ser preenchido com no mínimo 3 caracteres!"});
    }

    if(errors.length > 0) {
        res.render('admin/addFilme', {errors: errors})
    }else{
        const novoFilme = {
            titulo: req.body.titulo,
            diretor: req.body.diretor,
            genero: req.body.genero,
            lancamento: req.body.lancamento,
            sinopse: req.body.sinopse,
            slug: req.body.slug
        }
    
        new Filme(novoFilme).save()
            .then(() => {
                req.flash('success_msg', 'Filme cadastrado com sucesso!');
                res.redirect('/admin/filmes');
            }).catch(error => {
                req.flash('error_msg', 'Houve um problema ao cadastrar o filme, por favor tente novamente');
                res.redirect('/admin/filmes');
            })
    }
})

router.get('/filmes/edicao/:id', ehAdmin, (req, res) => {
    Filme.findOne({_id: req.params.id}).lean()
        .then(filme => {
            Genero.find().lean()
                .then(generos =>{
                    res.render('admin/editFilme', {filme: filme, generos: generos})
                })
        })
})

router.post('/filmes/edicao', ehAdmin, (req, res) => {
    Filme.findOne({_id: req.body.id})
        .then(filme => {

                filme.titulo = req.body.titulo,
                filme.diretor = req.body.diretor,
                filme.genero = req.body.genero,
                filme.lancamento =req.body.lancamento,
                filme.sinopse = req.body.sinopse,
                filme.slug = req.body.slug

                console.log(filme);

            new Filme(filme).save()
                .then(() => {
                    req.flash('success_msg', 'Filme editado com sucesso!');
                    res.redirect('/admin/filmes');
                }).catch(err => {
                    req.flash('error_msg', 'Nao foi possivel editar o filme desejado, por favor tente novamente');
                    res.redirect('/admin/filmes');
                })
        }).catch(err => {
            console.log('Deu um erro ai '  + err)
        })
})

router.post('/filmes/exclusao/:id', ehAdmin, (req, res) => {
    Filme.deleteOne({_id : req.params.id}).lean()
                .then(() => {
                    req.flash('success_msg', 'Filme excluido com sucesso!');
                    res.redirect('/admin/filmes');
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possivel excluir o gênero de filme desejado.');
                    console.log(err)
                    res.redirect('/admin/filmes');
                }) 
})
module.exports = router;