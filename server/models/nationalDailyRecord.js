import sequelize from '../config/db'

let Sequelize = require('sequelize'),
    moment = require('moment'),
    {Model} = Sequelize

class NationalDailyRecord extends Model {
    addRecord (type, title, value, officialUpdatedAt) {
        return this.create({
            type,
            title,
            value,
            'official_updated_at': officialUpdatedAt,
            'recorded_at': moment().format('YYYY-MM-DDTHH:mm:ssZ')
        })
    }
}

NationalDailyRecord.init({
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true
    },
    value: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    recorded_at: {
        type: 'TIMESTAMP',
        get () {
            return moment(this.getDataValue('recorded_at')).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    official_updated_at: {
        type: 'TIMESTAMP',
        get () {
            return moment(this.getDataValue('official_updated_at')).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        get () {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true,
        get () {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
        }
    }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'national_daily_records'
})

export default NationalDailyRecord
module.exports = NationalDailyRecord
