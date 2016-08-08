const config = require( './config/app' );
const upgrade = require( 'gerencio-upgrade' );

if ( config.env === 'production' ) {
    require( 'newrelic' );
}

const express = require( 'express' );
const httpProxy = require( 'http-proxy' );
const bodyParser = require( 'body-parser' );

let app = express();


//
// Create a proxy server with custom application logic
//
const proxy = httpProxy.createProxyServer( {} );

// app.use( bodyParser.json( { limit: '50mb' } ) );
// app.use( bodyParser.urlencoded( { extended: false } ) );

app.use( ( req, res ) => {

    // const serviceName = req.body.serviceName;
    // const interval = req.body.interval;
    // const rancherUrl = req.body.rancherUrl;
    // const rancherAccessKey = req.body.rancherAccessKey;
    // const rancherSecretKey = req.body.rancherSecretKey;
    // const rancherStack = req.body.rancherStack;
    // const rancherComposeUrl = req.body.rancherComposeUrl;

    // upgrade( serviceName, interval, rancherUrl, rancherAccessKey, rancherSecretKey, rancherStack, rancherComposeUrl )
    // .then( () => {
    //     res.send( 'ok' );
    // } )
    // .catch( err => {
    //     res.status( 500 ).send( err.message );
    // } );

    console.log( req.originalUrl, req.method );
    proxy.web( req, res, { target: config.targetUrl, toProxy: true } );
    //console.log( res );
} );

// development error handler
// will print full error
if ( config.env === 'development' ) {
    app.use( ( err, req, res, next ) => {
        res.status( err.status || 500 );
        console.log( err );
        res.json(
            {
                err: err.message,
                stack: err.stack
            } );
    } );
}

// production error handler
// only error message leaked to user
app.use( ( err, req, res, next ) => {
    res.status( err.status || 500 );
    console.log( err.stack );
    res.json( {
        err: err.message,
        fields: []
    } );
} );

let pathApp = express();

const path = config.path;
pathApp.use( path, app );

module.exports = pathApp;


