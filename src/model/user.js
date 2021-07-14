import { Model, DataTypes, Op } from 'sequelize'
import sequelize from '../db/sequelize'

class User extends Model {
  static async list (page, limit, keyword) {
    const offset = (page - 1) * limit
    const ops = {
      limit,
      offset,
      order: [
        ['createdAt', 'DESC']
      ]
    }
    if (keyword !== undefined && keyword !== '' && keyword !== null) {
      ops.where = {
        [Op.or]: [
          {
            userName: {
              [Op.like]: `%${keyword}%`
            },

          },
          {
            idCard: {
              [Op.like]: `%${keyword}%`
            }
          }
        ]
      }
    }
    const result = await User.findAndCountAll(ops)
    const pageInfo = {
      pageSize: limit,
      total: result.count,
      currentPage: page
    }
    return {
      pageInfo,
      items: result.rows
    }
  }
}

User.init({
  userName: DataTypes.STRING,
  idCard: DataTypes.STRING,
  qrCode: DataTypes.STRING,
  dateTime: DataTypes.STRING
}, { sequelize, modelName: 'user' })

export default User