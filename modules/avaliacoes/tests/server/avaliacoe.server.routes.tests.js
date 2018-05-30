'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Avaliacoe = mongoose.model('Avaliacoe'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  avaliacoe;

/**
 * Avaliacoe routes tests
 */
describe('Avaliacoe CRUD tests', function () {

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

    // Save a user to the test db and create new Avaliacoe
    user.save(function () {
      avaliacoe = {
        name: 'Avaliacoe name'
      };

      done();
    });
  });

  it('should be able to save a Avaliacoe if logged in', function (done) {
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

        // Save a new Avaliacoe
        agent.post('/api/avaliacoes')
          .send(avaliacoe)
          .expect(200)
          .end(function (avaliacoeSaveErr, avaliacoeSaveRes) {
            // Handle Avaliacoe save error
            if (avaliacoeSaveErr) {
              return done(avaliacoeSaveErr);
            }

            // Get a list of Avaliacoes
            agent.get('/api/avaliacoes')
              .end(function (avaliacoesGetErr, avaliacoesGetRes) {
                // Handle Avaliacoes save error
                if (avaliacoesGetErr) {
                  return done(avaliacoesGetErr);
                }

                // Get Avaliacoes list
                var avaliacoes = avaliacoesGetRes.body;

                // Set assertions
                (avaliacoes[0].user._id).should.equal(userId);
                (avaliacoes[0].name).should.match('Avaliacoe name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Avaliacoe if not logged in', function (done) {
    agent.post('/api/avaliacoes')
      .send(avaliacoe)
      .expect(403)
      .end(function (avaliacoeSaveErr, avaliacoeSaveRes) {
        // Call the assertion callback
        done(avaliacoeSaveErr);
      });
  });

  it('should not be able to save an Avaliacoe if no name is provided', function (done) {
    // Invalidate name field
    avaliacoe.name = '';

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

        // Save a new Avaliacoe
        agent.post('/api/avaliacoes')
          .send(avaliacoe)
          .expect(400)
          .end(function (avaliacoeSaveErr, avaliacoeSaveRes) {
            // Set message assertion
            (avaliacoeSaveRes.body.message).should.match('Please fill Avaliacoe name');

            // Handle Avaliacoe save error
            done(avaliacoeSaveErr);
          });
      });
  });

  it('should be able to update an Avaliacoe if signed in', function (done) {
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

        // Save a new Avaliacoe
        agent.post('/api/avaliacoes')
          .send(avaliacoe)
          .expect(200)
          .end(function (avaliacoeSaveErr, avaliacoeSaveRes) {
            // Handle Avaliacoe save error
            if (avaliacoeSaveErr) {
              return done(avaliacoeSaveErr);
            }

            // Update Avaliacoe name
            avaliacoe.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Avaliacoe
            agent.put('/api/avaliacoes/' + avaliacoeSaveRes.body._id)
              .send(avaliacoe)
              .expect(200)
              .end(function (avaliacoeUpdateErr, avaliacoeUpdateRes) {
                // Handle Avaliacoe update error
                if (avaliacoeUpdateErr) {
                  return done(avaliacoeUpdateErr);
                }

                // Set assertions
                (avaliacoeUpdateRes.body._id).should.equal(avaliacoeSaveRes.body._id);
                (avaliacoeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Avaliacoes if not signed in', function (done) {
    // Create new Avaliacoe model instance
    var avaliacoeObj = new Avaliacoe(avaliacoe);

    // Save the avaliacoe
    avaliacoeObj.save(function () {
      // Request Avaliacoes
      request(app).get('/api/avaliacoes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Avaliacoe if not signed in', function (done) {
    // Create new Avaliacoe model instance
    var avaliacoeObj = new Avaliacoe(avaliacoe);

    // Save the Avaliacoe
    avaliacoeObj.save(function () {
      request(app).get('/api/avaliacoes/' + avaliacoeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', avaliacoe.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Avaliacoe with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/avaliacoes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Avaliacoe is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Avaliacoe which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Avaliacoe
    request(app).get('/api/avaliacoes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Avaliacoe with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Avaliacoe if signed in', function (done) {
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

        // Save a new Avaliacoe
        agent.post('/api/avaliacoes')
          .send(avaliacoe)
          .expect(200)
          .end(function (avaliacoeSaveErr, avaliacoeSaveRes) {
            // Handle Avaliacoe save error
            if (avaliacoeSaveErr) {
              return done(avaliacoeSaveErr);
            }

            // Delete an existing Avaliacoe
            agent.delete('/api/avaliacoes/' + avaliacoeSaveRes.body._id)
              .send(avaliacoe)
              .expect(200)
              .end(function (avaliacoeDeleteErr, avaliacoeDeleteRes) {
                // Handle avaliacoe error error
                if (avaliacoeDeleteErr) {
                  return done(avaliacoeDeleteErr);
                }

                // Set assertions
                (avaliacoeDeleteRes.body._id).should.equal(avaliacoeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Avaliacoe if not signed in', function (done) {
    // Set Avaliacoe user
    avaliacoe.user = user;

    // Create new Avaliacoe model instance
    var avaliacoeObj = new Avaliacoe(avaliacoe);

    // Save the Avaliacoe
    avaliacoeObj.save(function () {
      // Try deleting Avaliacoe
      request(app).delete('/api/avaliacoes/' + avaliacoeObj._id)
        .expect(403)
        .end(function (avaliacoeDeleteErr, avaliacoeDeleteRes) {
          // Set message assertion
          (avaliacoeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Avaliacoe error error
          done(avaliacoeDeleteErr);
        });

    });
  });

  it('should be able to get a single Avaliacoe that has an orphaned user reference', function (done) {
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

          // Save a new Avaliacoe
          agent.post('/api/avaliacoes')
            .send(avaliacoe)
            .expect(200)
            .end(function (avaliacoeSaveErr, avaliacoeSaveRes) {
              // Handle Avaliacoe save error
              if (avaliacoeSaveErr) {
                return done(avaliacoeSaveErr);
              }

              // Set assertions on new Avaliacoe
              (avaliacoeSaveRes.body.name).should.equal(avaliacoe.name);
              should.exist(avaliacoeSaveRes.body.user);
              should.equal(avaliacoeSaveRes.body.user._id, orphanId);

              // force the Avaliacoe to have an orphaned user reference
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

                    // Get the Avaliacoe
                    agent.get('/api/avaliacoes/' + avaliacoeSaveRes.body._id)
                      .expect(200)
                      .end(function (avaliacoeInfoErr, avaliacoeInfoRes) {
                        // Handle Avaliacoe error
                        if (avaliacoeInfoErr) {
                          return done(avaliacoeInfoErr);
                        }

                        // Set assertions
                        (avaliacoeInfoRes.body._id).should.equal(avaliacoeSaveRes.body._id);
                        (avaliacoeInfoRes.body.name).should.equal(avaliacoe.name);
                        should.equal(avaliacoeInfoRes.body.user, undefined);

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
      Avaliacoe.remove().exec(done);
    });
  });
});
