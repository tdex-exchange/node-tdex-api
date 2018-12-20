'use strict'

const https = require('https');
const configs = require('./config')
const WebSocket = require('ws');

function requestApi(input, path, cb, type) {
    if(type === 'set') configs.method = 'PUT'
    configs.verification(input, path);
    let opstions = JSON.parse(JSON.stringify(configs))
    configs.request(opstions, input, path).then(res => {
        if(type === 'set') configs.method = 'POST'
        cb && typeof cb === 'function' && cb(res)
    })
}

class Tdex {
    constructor(options) {
        let {
            apiKey,
            apiSecret
        } = options;
        configs.apiKey = apiKey;
        configs.apiSecret = apiSecret;
        configs.headers['api-key'] = apiKey;
    }
    //用户详细信息
    userInfos(cb) {
        let input = JSON.stringify({})
        let path = '/user/info'
        requestApi(input, path, cb)
        return this
    }
    //所有余额
    walletBalances(cb) {
        let input = JSON.stringify({})
        let path = '/wallet/balances'
        requestApi(input, path, cb)
        return this
    }
    //单个余额
    walletBalance(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/wallet/balance'
        requestApi(input, path, cb)
        return this
    }
    //提现
    walletWithDraw(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/wallet/withdraw'
        requestApi(input, path, cb)
        return this
    }
    //开仓
    futuresOpen(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/open'
        requestApi(input, path, cb)
        return this
    }
    //批量平仓
    futuresClose(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/close'
        requestApi(input, path, cb)
        return this
    }
    //全部平仓
    futuresCloseAll(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/closeAll'
        requestApi(input, path, cb)
        return this
    }
    //设置止损
    futuresSetSl(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/setsl'
        requestApi(input, path, cb)
        return this
    }
    //设置止盈
    futuresSetTp(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/settp'
        requestApi(input, path, cb)
        return this
    }
    //合仓
    futuresMerge(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/merge'
        requestApi(input, path, cb)
        return this
    }
    //分仓
    futuresSplit(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/split'
        requestApi(input, path, cb)
        return this
    }
    //修改
    setup(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/setup'
        requestApi(input, path, cb)
        return this
    }

    //获取用户选项、设置用户选项
    futuresScheme(data = {}, type = "get", cb) {
        let input = JSON.stringify(data)
        let path = '/futures/scheme'
        requestApi(input, path, cb, type)
        return this
    }
    //获取订单
    futuresGetOrders(cb) {
        let input = JSON.stringify({})
        let path = '/futures/orders'
        requestApi(input, path, cb)
        return this
    }
    //获取持仓
    futuresGetPosition(cb) {
        let input = JSON.stringify({})
        let path = '/futures/position'
        requestApi(input, path, cb)
        return this
    }
    //获取历史
    futuresGetHistory(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/history'
        requestApi(input, path, cb)
        return this
    }
    //获取合约信息
    futuresGetContract(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/contract'
        requestApi(input, path, cb)
        return this
    }
    //现货买入
    spotBuy(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/spot/buy'
        requestApi(input, path, cb)
        return this
    }
    //现货卖出
    spotSell(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/spot/sell'
        requestApi(input, path, cb)
        return this
    }
    //现货订单历史
    spotGetHistory(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/spot/history'
        requestApi(input, path, cb)
        return this
    }
    //买卖统计
    spotStat(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/spot/stat'
        requestApi(input, path, cb)
        return this
    }
    //资金划转
    walletSwitch(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/wallet/switch'
        requestApi(input, path, cb)
        return this
    }
    //获取Token
    getToken(cb) {
        let input = JSON.stringify({})
        let path = '/user/token'
        requestApi(input, path, cb)
        return this
    }
    //获取最新深度
    depthBook(data = {}, cb) {
        let input = JSON.stringify(data)
        let path = '/futures/orderBook'
        requestApi(input, path, cb)
        return this
    }
}

//websocket
class Ws {
    constructor(options) {
        let {
            apiKey,
            apiSecret
        } = options;
        configs.apiKey = apiKey;
        configs.apiSecret = apiSecret;
        configs.headers['api-key'] = apiKey;
    }
    connect(...args) {
        let that = this;
        this.ws = new WebSocket('wss://www.tdex.com/realtime', {
            origin: 'https://www.tdex.com'
        });
        this.ws.on('open', this.openWs.bind(this, ...args));
        typeof this.onMessage === 'function' && this.ws.on('message', this.onMessage.bind(this));
        typeof this.onClose === 'function' && this.ws.on('close', this.onClose.bind(this));
    }
    openWs(...args) {
        console.log('open')
        if(!args || args.length === 0) return;
        args.forEach((item) => {
            console.log(item)
            switch(item.type) {
                case 'depth':
                    {
                        let mes_dep = {
                            "id": "1524707635007",
                            "sub": "BTCUSD_DEPTH_DATA",
                        }
                        console.log(mes_dep)
                        this.ws.send(JSON.stringify(mes_dep))
                        break;
                    }
                case 'market':
                    {
                        let mes_market = {
                            "id": "1524724272995",
                            "sub": "BTCUSD_MARKET_TICKER"
                        }
                        this.ws.send(JSON.stringify(mes_market))
                        break;
                    }
                case 'userInfo':
                    {
                        let path = '/user/token'
                        requestApi('{}', path, function(res) {
                        		console.log(res)
                            let mes_user = {
                                "uid": item.uid,
                                "time": res.data.time,
                                "token": res.data.token,
                                "id": "1524707635023",
                                "sub": "ACCOUNT_INFO_UPDATE",
                                "ssid": configs.apiKey,
                            }
                            console.log(mes_user)
                            this.ws.send(JSON.stringify(mes_user))
                        }.bind(this))
                        break;
                    }
                default:
                    console.log('参数类型有误')
                    break;
            }
        })
    }
}

//module.exports = Tdex

exports.tdex = Tdex
exports.ws = Ws
