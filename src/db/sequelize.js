import Sequelize from 'sequelize'
import sqlite3 from 'sqlite3'

const sequelize = new Sequelize({
  dialectModule: sqlite3,
  dialect: 'sqlite',
  storage: 'D:\\yanshizi\\data\\database.sqlite'
})



export default sequelize