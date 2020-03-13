import nationalDailyRecord from '../server/models/nationalDailyRecord.js'
import stateDailyRecord from '../server/models/stateDailyRecord.js'

// eslint-disable-next-line one-var
let path = require('path'),
    async = require('async')

class Spider {
    constructor (SpiderConfig) {
        this.gateway = require('require-all')({
            dirname: path.resolve(__dirname, './extensions'),
            filter: /(.*)\.js$/
        })

        this._StorageModules = {
            nationalDailyRecord,
            stateDailyRecord
        }

        this._SpiderConfig = SpiderConfig || {
            'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
        }
    }

    requestGateways () {
        console.log(this.gateway)
        async.mapSeries(Object.keys(this.gateway), (gatewayName, cb) => {
            console.log(`Collecting Data from Gateway [${gatewayName}]`)
            this.gateway[gatewayName](this._SpiderConfig, this._StorageModules, cb)
        }, (err, result) => {
            console.log(err, result)
        })
    }
}

export default Spider
