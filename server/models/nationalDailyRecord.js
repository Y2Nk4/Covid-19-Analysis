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
        allowNull: false
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
        type: 'TIMESTAMP'
    },
    official_updated_at: {
        type: 'TIMESTAMP'
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    sequelize
})

export default NationalDailyRecord
module.exports = NationalDailyRecord
