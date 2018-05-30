'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Classificador Schema
 */
var ClassificadorSchema;
ClassificadorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Classificador name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  image: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default:''
  },
  dia: [],
  severidade:[]
});

mongoose.model('Classificador', ClassificadorSchema);
