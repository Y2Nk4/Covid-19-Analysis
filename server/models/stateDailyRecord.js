import sequelize from '../config/db'

let Sequelize = require('sequelize'),
    moment = require('moment'),
    {Model} = Sequelize

class StateDailyRecord extends Model {
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

StateDailyRecord.init({
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
    state_code: {
        type: Sequelize.STRING,
        allowNull: true
    },
    county: {
        type: Sequelize.STRING,
        allowNull: false
    },
    recorded_at: {
        type: 'TIMESTAMP'
    },
    official_updated_at: {
        type: 'TIMESTAMP'
    },
    is_regional: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
    }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'states_daily_records'
})

export default StateDailyRecord
module.exports = StateDailyRecord
