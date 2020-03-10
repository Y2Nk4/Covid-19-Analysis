import nationalDailyRecord from '../models/nationalDailyRecord'
import stateDailyRecord from '../models/stateDailyRecord'
import StateDailyRecordType from '../datamap/StateDailyRecordType'
import NationalDailyRecordType from '../datamap/NationalDailyRecordType'
import collect from 'collect.js'

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
    }
}
