// pages/user/user.js
const app = getApp();
const navigationBarHeight = (app.statusBarHeight + 44) + 'px'
Page({

  // 调用微信接口跳转到拨号界面
  getPhoneNum: function () {
    wx.showActionSheet({
      itemList: ['客服电话：18236109106'],
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: '18236109106',
        })
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarTitle: "用户中心",
    navigationBarHeight,
    phoneNum: '18236109106'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) {
      console.log("aaaaa")
      console.log(app.globalData.openid)
      console.log(app.globalData.userInfo)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})