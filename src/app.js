const config = require( './config/app' );
if ( config.env === 'production' ) {
    require( 'newrelic' );
}

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const upgrade = require( 'gerencio-upgrade' );
const uuid = require( 'uuid' );

let app = express();

app.use( bodyParser.json( { limit: '5mb' } ) );
app.use( bodyParser.urlencoded( { extended: false } ) );

const status = {};

function clearOldStatus() {
    for ( let key in status ) {
        const time = status[ key ].start.setHours( status[ key ].start.getHours() + 1 );

        if ( time < new Date() ) {
            delete status[ key ];
        }
    }
}

app.post( '/upgrade', ( req, res, next ) => {

    clearOldStatus();

    const serviceName = req.body.serviceName;
    const interval = req.body.interval;
    const rancherUrl = req.body.rancherUrl;
    const rancherAccessKey = req.body.rancherAccessKey;
    const rancherSecretKey = req.body.rancherSecretKey;
    const rancherStack = req.body.rancherStack;
    const rancherComposeUrl = req.body.rancherComposeUrl;

    const id = uuid.v4();

    status[ id ] = {
        finished: false,
        success: null,
        result: null,
        start: new Date()
    };

    try {
        upgrade( serviceName, interval, rancherUrl, rancherAccessKey, rancherSecretKey, rancherStack, rancherComposeUrl )
        .then( ( result ) => {
            status[ id ].finished = true;
            status[ id ].success = true;
            status[ id ].result = result;
        } )
        .catch( err => {
            console.error( err );

            status[ id ].finished = true;
            status[ id ].success = false;
            if ( err.message ) {
                status[ id ].result = err.message;
            } else {
                status[ id ].result = err;
            }
        } );

        res.send( id );
    } catch ( err ) {
        next( err );
    }
} );

app.get( '/status/:id', ( req, res, next ) => {
    try {
        const id = req.params.id;
        const idStatus = status[ id ];

        if ( idStatus.finished ) {
            delete status[ id ];
        }

        res.json( idStatus );
    } catch ( err ) {
        next( err );
    }
} );

// error handlers

// // catch 404 and forward to error handler
app.use( ( req, res, next ) => {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
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
