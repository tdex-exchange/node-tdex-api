'use strict'
const crypto = require('crypto');
const https = require('https');

class Configs {
    constructor() {
        this.host = 'tl.tdex.com'
        this.port = 443
        this.path = '/openapi/v1'
        this.method = 'POST'
        this.headers = {
            'Content-Type': 'application/json',
        }
    }
}

Configs.prototype.request = function(options, data, path) {
    return new Promise((resolve, reject) => {
        let output = '',
            req;
        options.path = `${this.path}${path}`;
        req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                output += chunk;
            });
            res.on('end', function() {
                resolve(JSON.parse(output))
            });
        });
        req.write(data);
        req.end();
        req.on('error', function(e) {
            throw new Error(`http连接报错: ${e}`)
        });
    })
}

Configs.prototype.verification = function(data, path) {
    let expires = parseInt(new Date().getTime() / 1000);
    let input = data
    let curPath = path
    let sign = this.hmac_sign(curPath, expires, input, this.apiSecret);
    this.headers['api-signature'] = sign;
    this.headers['api-expires'] = expires;
}

Configs.prototype.hmac_sign = function(path, expires, data, apiSecret) {
    var hmac = crypto.createHmac('sha256', apiSecret);
    hmac.update(path + expires);
    if(data) hmac.update(data);
    return hmac.digest().toString('hex');
}

module.exports = new Configs()
