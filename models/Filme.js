const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Filme = new Schema({
    titulo: {type: String, required: true},
    diretor: {type: String, required: true},
    genero: {type: Schema.Types.ObjectId, ref: "Genero", required: true},
    lancamento: {type: Number, required: true},
    sinopse: {type: String, required: true},
    slug: {type: String, required: true},
    data: {type: Date, default: Date.now(), required: true}

})

mongoose.model('Filme', Filme);