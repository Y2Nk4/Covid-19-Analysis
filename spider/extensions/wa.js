// eslint-disable-next-line one-var
import stateDailyRecord from "../../server/models/stateDailyRecord";

let request = require('request'),
    cheerio = require('cheerio'),
    moment = require('moment'),
    timezone = require('moment-timezone'),
    fs = require('fs'),
    path = require('path'),
    StateDailyRecordType = require('../../server/datamap/StateDailyRecordType'),
    StateTextToCodeMap = require('../../server/datamap/StateTextToCodeMap')

module.exports = function (config, {stateDailyRecord}, cb) {
    let url = 'https://www.doh.wa.gov/emergencies/coronavirus'
    let STATE_CODE = 'WA'

    /* Make Request */
    request(url, {
        headers: {
            'User-Agent': config['UserAgent']
        }
    }, (err, response, body) => {
        if (err) {
            console.log(err)
        }

        fs.writeFileSync(path.resolve(__dirname, 'ny.html'), body, (err) => {
            console.log(err)
        })

        let $ = cheerio.load(body),
            UpdateAt = null,
            StateDailyRecords = []

        /* Parse Update Time Of CDC Data */
        $('.row p em').each((i, el) => {
            if ($(el).text().indexOf('Last updated') !== -1) {
                UpdateAt = moment.tz($(el).text().replace('Last updated: ', '').replace('at ', ''), 'MMMM DD, YYYY hh:mm a', 'America/Los_Angeles')
                        .tz('America/New_York')
                        .format('YYYY-MM-DD HH:mm:ss')
            }
        })

        /* Parse Summary Information from Washington State Health Department */

        let header = {}
        $('table.table.table-striped').first().find('tbody tr').each((i, el) => {
            if (i === 0) {
                $(el).children().each((thIndex, el) => {
                    if (thIndex > 0) {
                        console.log('th', $(el).text(), StateTextToCodeMap[$(el).text()], StateTextToCodeMap)

                        // 列表头
                        let columnHeader = $(el).text(),
                            formattedText = ((/[()0-9A-Za-z]+/).exec(columnHeader.replace(' ', ''))[0])

                        if (StateDailyRecordType[formattedText]) {
                            header[thIndex] = formattedText
                        }
                    }
                })
                console.log(header)
            } else {
                let rowTitle = $($(el).children()[0]).text()
                console.log(rowTitle)

                $(el).children().each((thIndex, el) => {
                    if (thIndex > 0) {
                        let typeText = header[thIndex],
                            type = StateDailyRecordType[typeText]

                        switch (rowTitle) {
                            case 'Total':
                                StateDailyRecords.push({
                                    type,
                                    title: `${typeText} ${STATE_CODE}`,
                                    value: parseInt($(el).text()),
                                    state_code: STATE_CODE,
                                    official_updated_at: UpdateAt,
                                    is_regional: 0,
                                    'recorded_at': moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                                })

                                break

                            case 'Unassigned':
                                StateDailyRecords.push({
                                    type,
                                    title: `${typeText} ${STATE_CODE}`,
                                    value: parseInt($(el).text()),
                                    state_code: STATE_CODE,
                                    official_updated_at: UpdateAt,
                                    county: 'Unassigned',
                                    is_regional: 1,
                                    'recorded_at': moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                                })
                                break

                            default:
                                StateDailyRecords.push({
                                    type,
                                    title: `${typeText} ${STATE_CODE} ${rowTitle}`,
                                    value: parseInt($(el).text()),
                                    state_code: STATE_CODE,
                                    official_updated_at: UpdateAt,
                                    county: rowTitle,
                                    is_regional: 1,
                                    'recorded_at': moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                                })
                                break
                        }
                    }
                })
            }
        })

        console.log(StateDailyRecords)

        stateDailyRecord.bulkCreate(StateDailyRecords)
            .then((result) => {
            })
            .catch((err) => {
                console.log('add Error', err)
            })
    })
}
