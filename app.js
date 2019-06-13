//app.js
var http = require('service/http.js')

App({
  // 全局变量
  globalData: {
    userInfo: null,
    openid: null,
    cartFood: [],
    windowHeight: null,
    serverDomain: http.serverDomain,
  },
  // 全局函数
  func: {
    getReq: http.getReq,
    postReq: http.postReq,
  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        this.statusBarHeight = res.statusBarHeight
      }
    })
    // 展示本地存储能力
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId
        http.postReq("/api/wx_login", {
          res: res
        }, function (res) {
          if (res.data.openid != "") {
            that.globalData.openid = res.data.openid
          }
        });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo

              if (that.globalData.openid != null) {
                
                http.postReq("/api/userInfo", {
                  res: res,
                  openid: that.globalData.openid
                }, function (res) {
                  console.log("app/api/userInfo", res)
                });
              }

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // 未授权，跳转到授权页面
          wx.reLaunch({
            url: '/pages/auth/auth',
          })
        }
      }
    })
  },
  statusBarHeight: 0
})