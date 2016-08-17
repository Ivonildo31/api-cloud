module.exports = {
    appName: process.env.NEWRELIC_APPNAME || 'Api Cloud',
    key: process.env.NEWRELIC_KEY,
    level: process.env.NEWRELIC_LEVEL || 'info'
};
