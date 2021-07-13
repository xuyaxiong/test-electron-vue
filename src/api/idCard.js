import axios from 'axios'

const BASE_ID_URL = 'http://127.0.0.1:19196/'

// 连接
export const openDevice = async () => {
  return await axios.get(`${BASE_ID_URL}OpenDevice`)
}

// 读取
export const readDevice = async () => {
  return await axios.get(`${BASE_ID_URL}readcard`)
}

// 断开
export const closeDevice = async () => {
  return await axios.get(`${BASE_ID_URL}CloseDevice`)
}
