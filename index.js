var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
Authentication = require('./models/authentication.js');
//cors XML k error ko resolve krne k liye lgya h and main purpose of cors to connect frontend to backend
var cors = require('cors')
cors({ credentials: true, origin: true })
app.use(cors())
// Parsers for POST data
app.use(bodyParser.json(), function (err, req, res, next) {
    if (err) {
        return res.status(500).json({ error: err });
    }
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
// connect database to mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://jiyakhan:jumbo1234@ds259325.mlab.com:59325/javeriamuneeba', {
    useMongoClient: true
    /* other options */
});
//Login post request to mlab from server
app.post('/authentication/login', function (request, response) {
        Authentication.findOne({ email: request.body.email }, function (err, email) {
            if (err) {
                console.log("email err", err)
                return response.status(500).send(err)
                // return err
            }
            if (!email) {
                console.log("email 404 err")
                return response.status(404).send()
            }
            Authentication.findOne({ password: request.body.password }, function (err, get) {
                if (err) {
                    console.log("get", err)
                    return response.status(500).send(err)
                }
                if (!get) {
                    return response.status(404).send()
                }
                console.log("Login Succcessfully!!! Welcome ", get.name)
                return response.status(200).send(get)
            })
        });
});
//Registration post request to mlab from server
app.post('/authentication/registration', function (request, response) {
    response.header('Access-Control-Allow-Origin', "*");
    var data = {
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
    };
    var authenticationData = new Authentication(data);
    authenticationData.save(function (err, getData) {
        if (!err) {
            console.log("data", getData)
            return response.status(200).send(getData);
        } else {
            console.log("Err", err)
            return response.status(500).send(err);
        }
    })
})
// When successfully connected
mongoose.connection.on('connected to mongodb', function () {
    console.log('Mongoose default connection open to ');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
var port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log("Server run on port " + port)
});