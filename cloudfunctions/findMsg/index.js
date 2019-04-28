// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'record'
})
// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  db.collection('todos').where({
    "num":1
  }).get({

    success(res) {
      // res.data 包含该记录的数据
      console.log(1111)
    }
  })
}