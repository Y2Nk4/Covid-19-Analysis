let Spider = require('../Spider'),
    request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path')

Spider.prototype.gateway_cdc = function () {
    let url = 'https://www.cdc.gov/coronavirus/2019-ncov/cases-in-us.html'
    /* Make Request */
    request(url, {
        headers: {
            'User-Agent': this._SpiderConfig['UserAgent']
        }
    }, (err, response, body) => {
        console.log(err, body)

        fs.writeFileSync(path.resolve(__dirname, 'cdc.html'), body, (err) => {
            console.log(err)
        })

        let $ = cheerio.load(body)

        $('.2019coronavirus-summary .card-body ul li').each((index, element) => {
            console.log(index, $(element).text())
        })
    })
}
