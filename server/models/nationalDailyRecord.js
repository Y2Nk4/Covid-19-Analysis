const Sequelize = require('sequelize'),
      {Model} = Sequelize;

import sequelize from "../config/db";

class NationalDailyRecord extends Model{

}

NationalDailyRecord.init({
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  value: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  recorded_at: {
    type: Sequelize.TIME
  }
}, {
  sequelize,
  timestamps: true
})

export default NationalDailyRecord
