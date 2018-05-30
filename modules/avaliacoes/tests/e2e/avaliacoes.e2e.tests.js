'use strict';

describe('Avaliacoes E2E Tests:', function () {
  describe('Test Avaliacoes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/avaliacoes');
      expect(element.all(by.repeater('avaliacoe in avaliacoes')).count()).toEqual(0);
    });
  });
});
