'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Classificador = mongoose.model('Classificador'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, classificador;

/**
 * Classificador routes tests
 */
describe('Classificador CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Classificador
    user.save(function () {
      classificador = {
        name: 'Classificador name'
      };

      done();
    });
  });

  it('should be able to save a Classificador if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Classificador
        agent.post('/api/classificadors')
          .send(classificador)
          .expect(200)
          .end(function (classificadorSaveErr, classificadorSaveRes) {
            // Handle Classificador save error
            if (classificadorSaveErr) {
              return done(classificadorSaveErr);
            }

            // Get a list of Classificadors
            agent.get('/api/classificadors')
              .end(function (classificadorsGetErr, classificadorsGetRes) {
                // Handle Classificador save error
                if (classificadorsGetErr) {
                  return done(classificadorsGetErr);
                }

                // Get Classificadors list
                var classificadors = classificadorsGetRes.body;

                // Set assertions
                (classificadors[0].user._id).should.equal(userId);
                (classificadors[0].name).should.match('Classificador name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Classificador if not logged in', function (done) {
    agent.post('/api/classificadors')
      .send(classificador)
      .expect(403)
      .end(function (classificadorSaveErr, classificadorSaveRes) {
        // Call the assertion callback
        done(classificadorSaveErr);
      });
  });

  it('should not be able to save an Classificador if no name is provided', function (done) {
    // Invalidate name field
    classificador.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Classificador
        agent.post('/api/classificadors')
          .send(classificador)
          .expect(400)
          .end(function (classificadorSaveErr, classificadorSaveRes) {
            // Set message assertion
            (classificadorSaveRes.body.message).should.match('Please fill Classificador name');

            // Handle Classificador save error
            done(classificadorSaveErr);
          });
      });
  });

  it('should be able to update an Classificador if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Classificador
        agent.post('/api/classificadors')
          .send(classificador)
          .expect(200)
          .end(function (classificadorSaveErr, classificadorSaveRes) {
            // Handle Classificador save error
            if (classificadorSaveErr) {
              return done(classificadorSaveErr);
            }

            // Update Classificador name
            classificador.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Classificador
            agent.put('/api/classificadors/' + classificadorSaveRes.body._id)
              .send(classificador)
              .expect(200)
              .end(function (classificadorUpdateErr, classificadorUpdateRes) {
                // Handle Classificador update error
                if (classificadorUpdateErr) {
                  return done(classificadorUpdateErr);
                }

                // Set assertions
                (classificadorUpdateRes.body._id).should.equal(classificadorSaveRes.body._id);
                (classificadorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Classificadors if not signed in', function (done) {
    // Create new Classificador model instance
    var classificadorObj = new Classificador(classificador);

    // Save the classificador
    classificadorObj.save(function () {
      // Request Classificadors
      request(app).get('/api/classificadors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Classificador if not signed in', function (done) {
    // Create new Classificador model instance
    var classificadorObj = new Classificador(classificador);

    // Save the Classificador
    classificadorObj.save(function () {
      request(app).get('/api/classificadors/' + classificadorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', classificador.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Classificador with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/classificadors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Classificador is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Classificador which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Classificador
    request(app).get('/api/classificadors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Classificador with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Classificador if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Classificador
        agent.post('/api/classificadors')
          .send(classificador)
          .expect(200)
          .end(function (classificadorSaveErr, classificadorSaveRes) {
            // Handle Classificador save error
            if (classificadorSaveErr) {
              return done(classificadorSaveErr);
            }

            // Delete an existing Classificador
            agent.delete('/api/classificadors/' + classificadorSaveRes.body._id)
              .send(classificador)
              .expect(200)
              .end(function (classificadorDeleteErr, classificadorDeleteRes) {
                // Handle classificador error error
                if (classificadorDeleteErr) {
                  return done(classificadorDeleteErr);
                }

                // Set assertions
                (classificadorDeleteRes.body._id).should.equal(classificadorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Classificador if not signed in', function (done) {
    // Set Classificador user
    classificador.user = user;

    // Create new Classificador model instance
    var classificadorObj = new Classificador(classificador);

    // Save the Classificador
    classificadorObj.save(function () {
      // Try deleting Classificador
      request(app).delete('/api/classificadors/' + classificadorObj._id)
        .expect(403)
        .end(function (classificadorDeleteErr, classificadorDeleteRes) {
          // Set message assertion
          (classificadorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Classificador error error
          done(classificadorDeleteErr);
        });

    });
  });

  it('should be able to get a single Classificador that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Classificador
          agent.post('/api/classificadors')
            .send(classificador)
            .expect(200)
            .end(function (classificadorSaveErr, classificadorSaveRes) {
              // Handle Classificador save error
              if (classificadorSaveErr) {
                return done(classificadorSaveErr);
              }

              // Set assertions on new Classificador
              (classificadorSaveRes.body.name).should.equal(classificador.name);
              should.exist(classificadorSaveRes.body.user);
              should.equal(classificadorSaveRes.body.user._id, orphanId);

              // force the Classificador to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Classificador
                    agent.get('/api/classificadors/' + classificadorSaveRes.body._id)
                      .expect(200)
                      .end(function (classificadorInfoErr, classificadorInfoRes) {
                        // Handle Classificador error
                        if (classificadorInfoErr) {
                          return done(classificadorInfoErr);
                        }

                        // Set assertions
                        (classificadorInfoRes.body._id).should.equal(classificadorSaveRes.body._id);
                        (classificadorInfoRes.body.name).should.equal(classificador.name);
                        should.equal(classificadorInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Classificador.remove().exec(done);
    });
  });
});
