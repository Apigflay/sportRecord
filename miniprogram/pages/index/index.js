//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    findMessage:null,//点击查询数据库
    openid:''//用户唯一标识
  },

  onLoad: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenId',
      success(res) {
        // console.log(res) // 3
        that.setData({
          openid: res.result.openid
        })
      },
      fail(err) {
        console.log(err)
      }
    })
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'add',
    //   // 传给云函数的参数
    //   data: {
    //     a: 1,
    //     b: 2,
    //   },
    //   success(res) {
    //     // console.log(res) // 3
    //     console.log(res.result.sum) // 3
    //   },
    //   fail: console.error
    // })




    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
// 点击获取数据库信息
  getMessage:function(){
    const db = wx.cloud.database()
    db.collection("todos").where({
    }).get({
      success: res => {
        console.log(res)
      }, fail: err => {
        console.log(err)
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
    console.log(111)
  },
//点击添加信息
  findMessage:function(){
    console.log("tianjai")
    const db = wx.cloud.database()
    db.collection('111111').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        description: 'learn cloud database',
        due: new Date('2018-09-01'),
        tags: [
          'cloud',
          'database'
        ],
        // 为待办事项添加一个地理位置（113°E，23°N）
        location: new db.Geo.Point(113, 23),
        done: false
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        console.log(222)
      },
      fail(res){
        console.log(res)
        console.log(222)
      }
    })
  },
  //点击修改信息
  setMessage: function () {
    console.log("xiugai")
    const db = wx.cloud.database()
    db.collection('reMove').doc('988c1b1b5cc578cb083bc1fb352f1817').update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        "done": true
      },
      success(res) {
        console.log(res)
      },
      fail(err){
        console.log(err)
      }
    })
  },
  //点击删除信息
  removeMessage: function () {
    const db = wx.cloud.database()
    db.collection('reMove').doc('9c4488c75cc57901083c870a7af63f8c').remove({
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
// 点击创建就集合
  creatCollection:function(){
    const userOpenId = this.data.openid;
    wx.cloud.callFunction({
      name: 'creatCollection',
      data:{
        createCollection:userOpenId
      },
      success(res) {
        console.log(res) // 3
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
