'use strict';

describe('Classificadors E2E Tests:', function () {
  describe('Test Classificadors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/classificadors');
      expect(element.all(by.repeater('classificador in classificadors')).count()).toEqual(0);
    });
  });
});
