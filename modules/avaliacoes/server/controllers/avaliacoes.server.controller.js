'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    config = require(path.resolve('./config/config')),
    Avaliacoe = mongoose.model('Avaliacoe'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');
var exec = require('child_process').exec;

/**
 * Create a Avaliacoe
 */
exports.create = function(req, res) {
    var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
    var avaliacoe = new Avaliacoe(req.body);

    avaliacoe.user = req.user;
    var upload = multer({
        dest: './modules/avaliacoes/client/img/' + avaliacoe.user._id  +  '/',
        limits: {
            filesize: 5*1024*1024
        }

    }).single('newPicture');

    // Filtering to upload only images
    upload.fileFilter = profileUploadFileFilter;

    if (avaliacoe.user) {
        console.log("User OK!");
        upload(req, res, function (uploadError) {
            if (uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading picture'
                });
            } else {
                if(req.file){
                    // Verifica com CNN

                    // Após CNN segmenta e retorna também os dados de severidade

                    exec('python ./segmenta/Segment.py -i ./modules/avaliacoes/client/img/' + avaliacoe.user._id + "/" + req.file.filename  , function (err, data) {
                        //console.log(err);
                        var resultado = data;
                        //console.log(resultado);
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("resultado:"+resultado);
                            req.file = [req.file.filename,parseFloat(resultado).toFixed(2)];
                            res.jsonp(req.file);

                        }
                    });

                } else {
                    avaliacoe.save(function (err) {
                        if (err) {
                            console.log(err);
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            res.jsonp(avaliacoe);
                        }
                    });
                }
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * Show the current Avaliacoe
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var avaliacoe = req.avaliacoe ? req.avaliacoe.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    avaliacoe.isCurrentUserOwner = req.user && avaliacoe.user && avaliacoe.user._id.toString() === req.user._id.toString();

    res.jsonp(avaliacoe);
};

/**
 * Update a Avaliacoe
 */
exports.update = function(req, res) {
    var avaliacoe = req.avaliacoe;

    avaliacoe = _.extend(avaliacoe, req.body);

    if (avaliacoe.user) {
        avaliacoe.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(avaliacoe);
            }
        });

    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }

};

/**
 * Delete an Avaliacoe
 */
exports.delete = function(req, res) {
    var avaliacoe = req.avaliacoe;

    avaliacoe.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(avaliacoe);
        }
    });
};

/**
 * List of Avaliacoes
 */
exports.list = function(req, res) {
    Avaliacoe.find().sort('-created').populate('user', 'displayName').exec(function(err, avaliacoes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(avaliacoes);
        }
    });
};

/**
 * Avaliacoe middleware
 */
exports.avaliacoeByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Avaliacoe is invalid'
        });
    }

    Avaliacoe.findById(id).populate('user', 'displayName').exec(function (err, avaliacoe) {
        if (err) {
            return next(err);
        } else if (!avaliacoe) {
            return res.status(404).send({
                message: 'No Avaliacoe with that identifier has been found'
            });
        }
        req.avaliacoe = avaliacoe;
        next();
    });
};
