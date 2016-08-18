module.exports = {
    env: process.env.NODE_ENV || '',
    port: process.env.PORT || '4242',
    path: process.env.REQUEST_PATH || '/cloud',
    targetUrl: process.env.TARGET_URL || 'http://cloud.datacenter.es.gov.br.local/v1'
};
