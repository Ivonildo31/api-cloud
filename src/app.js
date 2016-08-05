const config = require( './config/app' );

if ( config.env === 'production' ) {
    require( 'newrelic' );
}

const express = require( 'express' );
const httpProxy = require( 'http-proxy' );

let app = express();

//
// Create a proxy server with custom application logic
//
const proxy = httpProxy.createProxyServer( {} );

app.use( ( req, res ) => {
    console.log( req );
    proxy.web( req, res, { target: config.targetUrl } );
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
