import Spider from './Spider.js'
import nationalDailyRecord from '../server/models/nationalDailyRecord.js'

Spider.prototype.storage_national_daily_record = function (type, title, value, officialUpdatedAt) {
    return nationalDailyRecord.addRecord(type, title, value, officialUpdatedAt)
}

export default {}
