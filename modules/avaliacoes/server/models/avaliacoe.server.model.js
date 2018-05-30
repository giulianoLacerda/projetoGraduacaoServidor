'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Avaliacoe Schema
 */
var AvaliacoeSchema = new Schema({
    name: {
        type: String,
        default: '',
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    bairro: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        default: ''
    },
    fazenda: {
        type: String,
        default: ''
    },
    lavoura: {
        type: String,
        default: ''
    },
    aacpd: {
        type: Number,
        default: 0
    },
    size: {
        type: String,
        default:''
    },
    dia: [Number],
    severidade: [Number],
    imagem: [String]
});

mongoose.model('Avaliacoe', AvaliacoeSchema);
