import { Model, DataTypes } from 'sequelize'
import sequelize from '../db/sequelize'

class User extends Model { }

User.init({
  userName: DataTypes.STRING,
  idCard: DataTypes.STRING
}, { sequelize, modelName: 'user' })

export default User