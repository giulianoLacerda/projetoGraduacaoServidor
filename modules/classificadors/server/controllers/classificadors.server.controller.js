'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    multer = require('multer'),
    config = require(path.resolve('./config/config')),
    Classificador = mongoose.model('Classificador');
var exec = require('child_process').exec;

/**
 * Create a Classificador
 */
exports.create = function (req, res) {
    // Para upar imagem
    var imageUploadFileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;
    var classificador = new Classificador(req.body);
    classificador.user = req.user;
    var upload = multer({
        dest: './modules/classificadors/client/img/' + classificador.user._id + '/',
        limits: {
            fileSize: 4 * 1024 * 1024
        }
    }).single('newPicture');

    //console.log(req.file);
    if (classificador.user) {
        console.log("User OK!");
        upload(req, res, function (uploadError) {
            if (uploadError) {
                console.log("Error occurred while uploading picture");
                return res.status(400).send({
                    message: 'Error occurred while uploading picture'
                });
            } else {
                var a;
                exec('LD_LIBRARY_PATH=/home/giuliano/caffe/build/lib ./classifica/cnn/classification /home/giuliano/mean/classifica/cnn/deploy.prototxt  /home/giuliano/mean/classifica/cnn/snapshot_iter_7040.caffemodel  /home/giuliano/mean/classifica/cnn/mean.binaryproto  /home/giuliano/mean/classifica/cnn/labels.txt /home/giuliano/mean/modules/classificadors/client/img/' + classificador.user._id + "/" + req.file.filename, function (err, data) {
                    console.log(err);
                    var resultado = JSON.parse(data);
                    console.log(resultado);
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("FIM DA CLASSIFICACAO");
                        var classes = [];
                        //console.log(resultado['1']);
                        classes[0] = "Zero";
                        classes[1] = "Um";
                        classes[2] = "Dois";
                        classes[3] = "Três";
                        classes[4] = "Quatro";
                        classes[5] = "Cinco";
                        classes[6] = "Seis";
                        classes[7] = "Sete";
                        classes[8] = "Oito";
                        classes[9] = "Nove";
                        classificador.classes = classes;
                        var porcentagens = [];
                        porcentagens[0] = resultado['0'];
                        porcentagens[1] = resultado['1'];
                        porcentagens[2] = resultado['2'];
                        porcentagens[3] = resultado['3'];
                        porcentagens[4] = resultado['4'];
                        porcentagens[5] = resultado['5'];
                        porcentagens[6] = resultado['6'];
                        porcentagens[7] = resultado['7'];
                        porcentagens[8] = resultado['8'];
                        porcentagens[9] = resultado['9'];
                        classificador.porcentagens = porcentagens;

//		  classificador.classes[0] = resultado[1];
                        //classificador.resultado = resultado;
                        //for (var key in result) {
                        //    classificador[key] = result[key];
                        //}
                        //console.log(req.file);
                        classificador.image = config.uploads.imageUpload.dest + classificador.user._id + '/' + req.file.filename;
                        classificador.name = req.file.originalname;
                        classificador.size = req.file.size;

                        classificador.save(function (err) {
                            if (err) {
                                console.log(err);
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                res.jsonp(classificador);
                            }
                        });
                    }
                });

                /*var result = JavaClassification.classificationSync('/home/giuliano/Documentos/mean0.4.2/classifica/Beans',
                    '/home/giuliano/Documentos/mean0.4.2/modules/classificadors/client/img/'+classificador.user._id,req.file.filename);*/
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * Show the current Classificador
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var classificador = req.classificador ? req.classificador.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    classificador.isCurrentUserOwner = req.user && classificador.user && classificador.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(classificador);
};

/**
 * Update a Classificador
 */
exports.update = function (req, res) {
    var classificador = req.classificador;

    classificador = _.extend(classificador, req.body);

    classificador.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(classificador);
        }
    });
};

/**
 * Delete an Classificador
 */
exports.delete = function (req, res) {
    var classificador = req.classificador;

    classificador.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(classificador);
        }
    });
};

/**
 * List of Classificadors
 */
exports.list = function (req, res) {
    Classificador.find({user: req.user._id}).sort('-created').populate('user', 'displayName').exec(function (err, classificadors) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(classificadors);
        }
    });
};

/**
 * Classificador middleware
 */
exports.classificadorByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Classificador is invalid'
        });
    }
    Classificador.findById(id).populate('user', 'displayName').exec(function (err, classificador) {
        if (err) {
            return next(err);
        } else if (!classificador) {
            return res.status(404).send({
                message: 'No Classificador with that identifier has been found'
            });
        }
        req.classificador = classificador;
        next();
    });
};
