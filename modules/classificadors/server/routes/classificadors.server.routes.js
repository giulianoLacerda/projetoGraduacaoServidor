'use strict';

/**
 * Module dependencies
 */
var classificadorsPolicy = require('../policies/classificadors.server.policy'),
  classificadors = require('../controllers/classificadors.server.controller');

module.exports = function(app) {

  // Classificadors Routes
  app.route('/api/classificadors').get(classificadors.list);
  app.route('/api/classificadors').post(classificadors.create);

  app.route('/api/classificadors/:classificadorId').get(classificadors.read);
  app.route('/api/classificadors/:classificadorId').put(classificadors.update);
  app.route('/api/classificadors/:classificadorId').delete(classificadors.delete);

  // Finish by binding the Classificador middleware
  app.param('classificadorId', classificadors.classificadorByID);
};
