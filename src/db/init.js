import '../model'
import sequelize from './sequelize'

export const initDB = async () => {
  await sequelize.authenticate()
  await sequelize.sync()
  console.log('初始化数据库')
}