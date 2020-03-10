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
    let url = 'https://www.health.ny.gov/diseases/communicable/coronavirus/'
    let STATE_CODE = 'NY'

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
            UpdateAt,
            StateDailyRecords = []

        /* Parse Update Time Of CDC Data */
        if ($('#case_count_table caption').text().indexOf('Data last updated') !== -1) {
            UpdateAt = moment.parseZone($('#case_count_table caption').text().replace('Data last updated ', ''), 'hha MMMM DD, YYYY')
                .format('YYYY-MM-DD HH:mm:ss')
        }

        /* Parse Summary Information from NYS Health Department */
        /* COVID-19: U.S. at a Glance */

        let header = {}
        $('#case_count_table tbody tr').each((i, el) => {
            if (i === 0) {
                $(el).find('th').each((thIndex, el) => {
                    if(thIndex > 0){
                        console.log('th', $(el).text(), StateTextToCodeMap[$(el).text()], StateTextToCodeMap)

                        // 列表头
                        let rowHeader = $(el).text()

                        if (StateDailyRecordType[rowHeader]) {
                            header[thIndex] = $(el).text()
                        }

                        /*if (StateTextToCodeMap[row_header]) {
                            header[thIndex] = $(el).text()
                        } else if ($(el).text().indexOf('Total Positive Cases') !== -1) {
                            header[thIndex] = 'New York'
                        } else if (){

                        }*/
                    }
                })
                console.log(header)
            } else {
                if (!$(el).hasClass('total_row')) {
                    /* Regional Data */
                    let county = $($(el).find('td')[0]).text()

                    $(el).find('td').each((tdIndex, el) => {
                        if (tdIndex > 0) {
                            let typeText = header[tdIndex],
                                type = StateDailyRecordType[typeText]

                            StateDailyRecords.push({
                                type,
                                title: `${typeText} ${county}`,
                                value: $(el).text(),
                                state_code: STATE_CODE,
                                county,
                                official_updated_at: UpdateAt,
                                is_regional: 1,
                                'recorded_at': moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                            })
                        }
                    })
                } else if ($($(el).find('td')[0]).text().indexOf('Statewide') !== -1) {
                    $(el).find('td').each((tdIndex, el) => {
                        if (tdIndex > 0) {
                            let typeText = header[tdIndex],
                                type = StateDailyRecordType[typeText]

                            StateDailyRecords.push({
                                type,
                                title: `${typeText} ${STATE_CODE}`,
                                value: $(el).text(),
                                state_code: STATE_CODE,
                                official_updated_at: UpdateAt,
                                is_regional: 0,
                                'recorded_at': moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                            })
                        }
                    })
                }
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
