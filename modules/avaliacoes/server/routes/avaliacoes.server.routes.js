'use strict';

/**
 * Module dependencies
 */
var avaliacoesPolicy = require('../policies/avaliacoes.server.policy'),
  avaliacoes = require('../controllers/avaliacoes.server.controller');

module.exports = function(app) {
  // Avaliacoes Routes
  app.route('/api/avaliacoes').all(avaliacoesPolicy.isAllowed)
    .get(avaliacoes.list)
    .post(avaliacoes.create);

  app.route('/api/avaliacoes/:avaliacoeId').all(avaliacoesPolicy.isAllowed)
    .get(avaliacoes.read)
    .put(avaliacoes.update)
    .delete(avaliacoes.delete);

  // Finish by binding the Avaliacoe middleware
  app.param('avaliacoeId', avaliacoes.avaliacoeByID);
};
