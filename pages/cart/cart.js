// pages/cart/cart.js
const app = getApp()
const navigationBarHeight = (app.statusBarHeight + 44) + 'px'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarTitle: '订单列表',
    navigationBarHeight,
    orderList: [],
    a:[],
    openid: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = app.globalData.openid;
    this.setData({
      openid: openid,
    })

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
    var that = this
    if (that.data.openid) {
      // get请求，获取对应用户的订单  拼接域名
      app.func.getReq("/api/order?openid=" + that.data.openid, function (res) {
        if (res.code == 200) {
          for (var i = 0; i < res.data.orderList.length; i++) {
            let s = res.data.orderList[i].store_img
            res.data.orderList[i].store_img = app.globalData.serverDomain + s
          }
    
          // console.log("orderList", res.data.orderList)

          that.setData({
            orderList: res.data.orderList
          })
        } else {
          wx.showToast({
            title: '获取订单失败：' + res.code + ' ' + res.msg,
            icon: 'none',
            mask: true,
            duration: 3000,
            complete: function () { }
          })
        }
      })
    }
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

  }
})