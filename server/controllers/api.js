import nationalDailyRecord from '../models/nationalDailyRecord'
import stateDailyRecord from '../models/stateDailyRecord'
import StateDailyRecordType from '../datamap/StateDailyRecordType'
import NationalDailyRecordType from '../datamap/NationalDailyRecordType'
import collect from 'collect.js'
import moment from 'moment-timezone'
import {Op} from 'sequelize'

export default {
    async getNationalSummary (ctx) {
        let currentConfirmed = await nationalDailyRecord.findOne({
            where: {
                type: NationalDailyRecordType['Current Confirmed']
            },
            order: [
                ['official_updated_at', 'DESC']
            ]
        })
        let totalDeath = await nationalDailyRecord.findOne({
            where: {
                type: NationalDailyRecordType['Total Death']
            },
            order: [
                ['official_updated_at', 'DESC']
            ]
        })
        let statesReportingCases = await nationalDailyRecord.findOne({
            where: {
                type: NationalDailyRecordType['State Reporting']
            },
            order: [
                ['official_updated_at', 'DESC']
            ]
        })

        ctx.body = {
            success: true,
            data: {
                currentConfirmed: currentConfirmed['value'],
                totalDeath: totalDeath['value'],
                statesReportingCases: statesReportingCases['value']
            }
        }
    },

    getStateSummary: async function (ctx) {
        ctx.checkQuery('state').notEmpty()
        if (ctx.errors) {
            ctx.body = {
                success: false,
                error: ctx.errors
            }
            return
        }

        let currentConfirmed = await stateDailyRecord.findOne({
            where: {
                type: StateDailyRecordType['Current Confirmed'],
                state_code: ctx.query['state'],
                is_regional: 0
            },
            order: [
                ['official_updated_at', 'DESC']
            ]
        })

        let totalDeath = await stateDailyRecord.findOne({
            where: {
                type: StateDailyRecordType['Total Deaths'],
                state_code: ctx.query['state'],
                is_regional: 0
            },
            order: [
                ['official_updated_at', 'DESC']
            ]
        })

        ctx.body = {
            success: true,
            data: {
                currentConfirmed: currentConfirmed && currentConfirmed['value'] ? currentConfirmed['value'] : 0,
                totalDeath: totalDeath && totalDeath['value'] ? totalDeath['value'] : 0
            }
        }
    },

    async getNationalGraphData (ctx) {
        ctx.checkQuery('type').notEmpty().isInt()
        if (ctx.errors) {
            ctx.body = {
                success: false,
                error: ctx.errors
            }
        } else {
            let graphData = await nationalDailyRecord.findAll({
                where: {
                    type: ctx.query['type']
                },
                order: [
                    ['official_updated_at', 'DESC']
                ]
            })

            let graphDataCollection = collect(graphData).groupBy((item, key) => {
                /* 如果是同一天 */
                console.log(typeof item['official_updated_at'], item['official_updated_at'], moment(item['official_updated_at']).dates(), moment(item['recorded_at']).dates(), moment(item['official_updated_at']).dates() === moment(item['recorded_at']).dates())
                if (moment(item['official_updated_at']).dates() === moment(item['recorded_at']).dates()) {
                    return moment(item['official_updated_at']).format('YYYY/M/D')
                } else {
                    return moment(item['recorded_at']).format('YYYY/M/D')
                }
            }).map((item) => {
                let firstItem = item.sortByDesc((item) => {
                    return moment(item['official_updated_at']).unix()
                }).first()

                return [moment(firstItem['official_updated_at']).format('YYYY/M/D'), firstItem['value']]
            }).toArray()

            ctx.body = {
                success: true,
                data: {
                    title: `Covid-9 ${NationalDailyRecordType[ctx.query['type']]} in U.S.`,
                    graphData: graphDataCollection
                }
            }
        }
    },

    async caseStructureAnalysis (ctx) {
        let dailyData = await nationalDailyRecord.findAll({
            where: {
                type: {
                    [Op.in]: [12, 13, 14, 15, 16]
                }
            }
        })

        // 按日期分类
        let graphDataCollection = collect(dailyData).groupBy((item, key) => {
            /* 如果是同一天 */
            if (moment(item['official_updated_at']).day() === moment(item['recorded_at']).day()) {
                return moment(item['official_updated_at']).startOf('day').unix()
            } else {
                return moment(item['recorded_at']).startOf('day').unix()
            }
        }),
            dates = graphDataCollection.keys().sortByDesc((item) => {
                return item
            }).first()

        graphDataCollection = graphDataCollection.get(dates).groupBy('type').map((item) => {
            return item.sortByDesc((item) => {
                return moment(item['recorded_at']).unix()
            }).first()
        })

        let sum = collect(graphDataCollection.toArray()).sum('value')

        let percentageAnalysis = collect(graphDataCollection.toArray()).map((typeItem) => {
            return {
                name: typeItem['title'],
                value: typeItem['value'],
                percentage: (typeItem['value'] / sum).toFixed(4)
            }
        })

        ctx.body = {
            success: true,
            data: {
                title: `Covid-9 Case Structure in U.S.`,
                graphData: percentageAnalysis.all(),
                legend: percentageAnalysis.pluck('name').all(),
                subtitle: `Collected From CDC, Last Updated: ${moment.unix(dates).format('MMM DD, YYYY')}`
            }
        }
    }
}
