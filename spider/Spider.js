// eslint-disable-next-line no-unused-vars
/*import * as Gateways from './extensions/'*/

import cdc from './extensions/cdc.js'
import a

class Spider {
    constructor (SpiderConfig) {
        this.gateway = [
            cdc
        ]

        this._SpiderConfig = SpiderConfig || {
            'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
        }
    }

    requestGateways (Gateway) {
        async
    }
}

export default Spider

import './Storage.js'
