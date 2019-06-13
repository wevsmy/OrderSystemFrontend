// pages/order/order.js
const app = getApp();
const navigationBarHeight = (app.statusBarHeight + 44) + 'px'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarTitle: '订单确认',
    navigationBarHeight,
    cartList: [],
    foodList: [],
    payTotal: 0,
    openid: null,
    storeId: null,
  },

  // 付款事件
  pay: function(e) {

    let foodList = this.data.foodList
    let openid = this.data.openid
    let storeId = this.data.storeId

    // post请求，上报用户下单信息
    app.func.postReq("/api/order", {
      storeId: storeId,
      openid: openid,
      foodList: foodList,
    }, function(res) {
      if (res.code == 200) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          mask: true,
          duration: 2000,
          complete: function() {}
        })
        setTimeout(function() {
          //要延时执行的代码
          wx.reLaunch({
            url: `../cart/cart`
          })
        }, 1000) //延迟时间 这里是1秒
      } else {
        wx.showToast({
          title: '支付失败,错误信息：' + res.code + ' ' + res.msg,
          icon: 'none',
          mask: true,
          duration: 3000,
          complete: function() {}
        })
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var cart = JSON.parse(options.cart);
    let openid = app.globalData.openid;
    let storeId = options.storeId;

    let payTotal = 0;
    let list = [];
    let tempCart = [];
    let keysList = [];
    let itemsList = {};
    for (var i = 0; i < cart.length; i++) {
      payTotal += cart[i].count * cart[i].price;

      list.push({
        "foodId": cart[i].foodId,
        "count": cart[i].count
      })

      if (keysList.indexOf(cart[i].categoryIndex) == -1) {
        let cateValue = {
          "categoryIndex": cart[i].categoryIndex,
          "categoryName": cart[i].categoryName,
          "total": cart[i].price * cart[i].count,
          "items": [cart[i]]
        }
        tempCart.push(cateValue)
        let cartIndex = tempCart.indexOf(cateValue)
        itemsList[cart[i].categoryIndex] = cartIndex
        keysList.push(cart[i].categoryIndex)
      } else {
        tempCart[itemsList[cart[i].categoryIndex]].total += cart[i].price * cart[i].count
        tempCart[itemsList[cart[i].categoryIndex]].items.push(
          cart[i]
        )
      }

    }

    // console.log("ss", cart)
    // console.log("aa", tempCart)

    this.setData({
      cartList: tempCart,
      payTotal: payTotal,
      openid: openid,
      storeId: storeId,
      foodList: list,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})