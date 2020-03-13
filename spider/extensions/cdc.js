// eslint-disable-next-line one-var
let request = require('request'),
    cheerio = require('cheerio'),
    moment = require('moment'),
    timezone = require('moment-timezone'),
    fs = require('fs'),
    path = require('path'),
    NationalDailyRecordType = require('../../server/datamap/NationalDailyRecordType')

module.exports = function (config, {nationalDailyRecord}, cb) {
    let url = 'https://www.cdc.gov/coronavirus/2019-ncov/cases-in-us.html'
    /* Make Request */
    request(url, {
        headers: {
            'User-Agent': config['UserAgent']
        }
    }, (err, response, body) => {
        if (err) {
            console.log(err)
        }

        fs.writeFileSync(path.resolve(__dirname, 'cdc.html'), body, (err) => {
            console.log(err)
        })

        let $ = cheerio.load(body),
            CDCUpdateAt,
            NationalDailyRecords = []

        /* Parse Update Time Of CDC Data */
        $('.syndicate .text-red').each((i, el) => {
            if ($(el).text().indexOf('Updated') !== -1) {
                CDCUpdateAt = moment($(el).text().replace('Updated ', ''), 'MMMM DD, YYYY')
                    .format('YYYY-MM-DD HH:mm:ss')
            }
        })

        /* Parse Summary Information from CDC */
        /* COVID-19: U.S. at a Glance */
        $('.2019coronavirus-summary .card-body ul li').each((index, element) => {
            console.log(index, $(element).text())
            let context = $(element).text()

            try {
                if (context) {
                    context = context.split(': ')

                    NationalDailyRecords.push({
                        'type': NationalDailyRecordType[context[0]],
                        'title': context[0],
                        'value': parseInt(context[1]),
                        'official_updated_at': CDCUpdateAt,
                        'recorded_at': moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                    })
                }
            } catch (e) {
                console.log(e)
            }
        })

        /* Cases in the United States Reported to CDC */
        $('.2019coronavirus table tr').each((i, el) => {
            let title = $(el).find('td').first().text(),
                value = $($(el).find('td')[1]).text()

            console.log(title, NationalDailyRecordType[title])

            if (NationalDailyRecordType[title] && title !== 'Total cases') {
                NationalDailyRecords.push({
                    'type': NationalDailyRecordType[title],
                    'title': title,
                    'value': parseInt(value),
                    'official_updated_at': CDCUpdateAt,
                    'recorded_at': moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                })
            }
        })

        /* COVID-19: Cases among Persons Repatriated to the United States */
        $('.2019coronavirus-dp table tr').each((i, el) => {
            $(el).find('td a').remove()
            let title = $(el).find('td').first().text(),
                value = $($(el).find('td')[1]).text()

            if (title && NationalDailyRecordType[title] && title !== 'Total cases') {
                NationalDailyRecords.push({
                    'type': NationalDailyRecordType[title],
                    'title': `Travel-related ${title}`,
                    'value': parseInt(value),
                    'official_updated_at': CDCUpdateAt,
                    'recorded_at': moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                })
            }
        })

        console.log(NationalDailyRecords)

        nationalDailyRecord.bulkCreate(NationalDailyRecords)
            .then((result) => {
                /*console.log('add result', result)*/

                /*nationalDailyRecord.findAll({
                    type: 1
                }).then((result) => {
                    console.log('find', result)
                })*/
                return cb()
            })
            .catch((err) => {
                console.log('add Error', err)
                return cb()
            })
    })
}
