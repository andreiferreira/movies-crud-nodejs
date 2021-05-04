const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = new Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    senha: {type: String, required: true},
    ehAdmin: {type: Number, default: 0, required: true}

})

mongoose.model('User', User);