// pages/store/store.js

const app = getApp();
const navigationBarHeight = (app.statusBarHeight + 44) + 'px'
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigationBarTitle: 'store',
    navigationBarHeight,

    viewTo: "",
    viewToLeft: "",
    listHeight: 300,
    activeIndex: 0,
    tabIndex: 0,
    showModal: false,
    showCart: false,
    heigthArr: [],
    cart: [],
    totalMoney: 0,
    activesInfo: {
      1: {
        class: "manjian",
        text: "减"
      },
      2: {
        class: "xindian",
        text: "新"
      },
      3: {
        class: "zhekou",
        text: "折"
      },
      4: {
        class: "daijinquan",
        text: "券"
      },
      5: {
        class: "xinyonghu",
        text: "新"
      },
      6: {
        class: "peisong",
        text: "配"
      },
      7: {
        class: "lingdaijin",
        text: "领"
      },
      8: {
        class: "zengsong",
        text: "赠"
      }
    },
    storeInfo: {},
    food: [],
    storeId:null,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // post请求，获取指定storeId的storeInfo,并拼接服务器域名
    app.func.postReq("/api/storeInfo", {
      storeId: options.storeId
    }, function (res) {
      res.data.storeInfo.storeImgUrl = app.globalData.serverDomain + res.data.storeInfo.storeImgUrl
      that.setData({
        storeInfo: res.data.storeInfo,
        navigationBarTitle: res.data.storeInfo.storeName,
      })
    });
    // post请求，获取指定storeId的food,并拼接服务器域名
    app.func.postReq("/api/storeFood", {
      storeId: options.storeId
    }, function (res) {
      for (let i = 0; i < res.data.storeFood.length; i++) {
        for (let j = 0; j < res.data.storeFood[i].items.length; j++) {
          let s = res.data.storeFood[i].items[j].foodImgUrl
          res.data.storeFood[i].items[j].foodImgUrl = app.globalData.serverDomain + s
        }
      }
      that.setData({
        food: res.data.storeFood,
        storeId: options.storeId
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let height1, height2;
    let res = wx.getSystemInfoSync();
    let winHeight = res.windowHeight;
    let query = wx.createSelectorQuery();
    query.select(".head").boundingClientRect();
    query.exec(res => {
      height1 = res[0].height;
      let query1 = wx.createSelectorQuery();
      query1.select(".tab").boundingClientRect();
      query1.exec(res => {
        height2 = res[0].height;
        this.setData({
          listHeight: winHeight - height1 - height2
        });
        this.calculateHeight();
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  selectFood(e) {
    this.setData({
      activeIndex: e.target.dataset.index,
      viewTo: e.target.dataset.titleid
    });
  },
  calculateHeight() {
    let heigthArr = [];
    let height = 0;
    heigthArr.push(height);
    var query = wx.createSelectorQuery();
    query.selectAll(".title-group").boundingClientRect();
    query.exec(res => {
      for (let i = 0; i < res[0].length; i++) {

        // console.log(res[0][i])
        height += parseInt(res[0][i].height);
        heigthArr.push(height);
      }
      this.setData({
        heigthArr: heigthArr
      });
    });
  },
  // 手机端有延迟 节流函数效果不好 用防抖函数凑合
  scroll(e) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      let srollTop = e.detail.scrollTop;
      for (let i = 0; i < this.data.heigthArr.length; i++) {
        if (
          srollTop >= this.data.heigthArr[i] &&
          srollTop < this.data.heigthArr[i + 1] &&
          this.data.activeIndex != i
        ) {
          this.setData({
            activeIndex: i
          });
          if (i < 3) {
            this.setData({
              viewToLeft: 'title1left'
            })
          } else {
            this.setData({
              viewToLeft: 'title' + (i - 2) + 'left'
            })
          }
          return;
        }
      }
    }, 100)
  },
  // 添加菜品到购物车
  add(e) {
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;

    let countMsg =
      "food[" +
      groupindex +
      "].items[" +
      index +
      "].count";
    let count = this.data.food[groupindex].items[
      index
    ].count;
    let foodCountMsg = "food[" + groupindex + "].foodCount";
    let foodCount = this.data.food[groupindex].foodCount;
    let foodId = this.data.food[groupindex].items[
      index
    ].foodId;

    count += 1;
    foodCount += 1;
    this.setData({
      [countMsg]: count, //数据的局部更新
      [foodCountMsg]: foodCount
    });
    let cart = this.data.cart;
    let hasCart = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].foodId == foodId) {
        hasCart = true;
        break;
      }
    }
    let categoryIndex = groupindex
    let categoryName = this.data.food[groupindex].title
    if (hasCart) {
      cart[i].count++;
    } else {
      cart.push({
        ...this.data.food[groupindex].items[index],
        groupindex,
        categoryIndex,
        categoryName
      });
    }
    let totalMoney = this.data.totalMoney;
    totalMoney += this.data.food[groupindex].items[
      index
    ].price;
    this.setData({
      cart: cart,
      totalMoney: totalMoney
    });
  },
  // 减少菜品数量
  reduce(e) {
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;
    let countMsg =
      "food[" +
      groupindex +
      "].items[" +
      index +
      "].count";
    let count = this.data.food[groupindex].items[
      index
    ].count;
    let foodCountMsg = "food[" + groupindex + "].foodCount";
    let foodCount = this.data.food[groupindex].foodCount;
    let foodId = this.data.food[groupindex].items[
      index
    ].foodId;
    count -= 1;
    foodCount -= 1;
    this.setData({
      [countMsg]: count,
      [foodCountMsg]: foodCount
    });
    let cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].foodId == foodId) {
        if (cart[i].count == 1) {
          cart.splice(i, 1);
        } else {
          cart[i].count--;
        }
        break;
      }
    }
    let totalMoney = this.data.totalMoney;
    totalMoney -= this.data.food[groupindex].items[
      index
    ].price;
    this.setData({
      cart: cart,
      totalMoney: totalMoney
    });
  },

  // 显示购物车
  listCart() {
    if (this.data.cart.length > 0) {
      this.setData({
        showCart: !this.data.showCart
      })
    }
  },
  // 清空购物车
  clearCart() {
    // 清空购物车
    if (this.data.cart.length > 0) {
      this.setData({
        cart: [],
        totalMoney: 0
      })
    }
    // 清空food中的count值
    let food = this.data.food;
    for (var i = 0; i < food.length; i++) {
      if (food[i].foodCount != 0) {
        food[i].foodCount = 0
      }
      for (var j = 0; j < food[i].items.length; j++) {
        if (food[i].items[j].count != 0) {
          food[i].items[j].count = 0
        }
      }
    }
    this.setData({
      food: food
    });

  },
  // 购物车加菜
  // 对应的food 也要加
  cartAdd(e) {
    let foodId = e.currentTarget.dataset.item.foodId;
    let cart = this.data.cart;
    let food = this.data.food;
    for (var i = 0; i < cart.length; i++) {
      // 增加购物车中的数
      if (cart[i].foodId == foodId) {
        // groupindex  需要改为类别索引
        let categoryIndex = cart[i].categoryIndex;
        for (var j = 0; j < food[categoryIndex].items.length; j++) {
          if (food[categoryIndex].items[j].foodId == foodId) {
            let countMsg =
              "food[" +
              categoryIndex +
              "].items[" +
              j +
              "].count";
            let count = food[categoryIndex].items[j].count;
            count += 1;
            this.setData({
              [countMsg]: count
            })
            break
          }
        }
        let foodCountMsg = "food[" + categoryIndex + "].foodCount";
        let foodCount = this.data.food[categoryIndex].foodCount;
        foodCount += 1;
        this.setData({
          [foodCountMsg]: foodCount
        });
        // 购物车里的数整加
        cart[i].count++;
        break;
      }
    }
    this.setData({
      cart: cart
    });
  },
  // 购物车减菜
  cartReduce(e) {
    let foodId = e.currentTarget.dataset.item.foodId;
    let cart = this.data.cart;
    let food = this.data.food;
    for (var i = 0; i < cart.length; i++) {
      // 减少购物车中的数
      if (cart[i].foodId == foodId) {
        // groupindex  需要改为类别索引
        let categoryIndex = cart[i].categoryIndex;
        for (var j = 0; j < food[categoryIndex].items.length; j++) {
          if (food[categoryIndex].items[j].foodId == foodId) {
            let countMsg =
              "food[" +
              categoryIndex +
              "].items[" +
              j +
              "].count";
            let count = food[categoryIndex].items[j].count;
            count -= 1;
            this.setData({
              [countMsg]: count
            })
            break
          }
        }
        let foodCountMsg = "food[" + categoryIndex + "].foodCount";
        let foodCount = this.data.food[categoryIndex].foodCount;
        foodCount -= 1;
        this.setData({
          [foodCountMsg]: foodCount
        });
        // 购物车里的数减少
        if (cart[i].count == 1) {
          cart.splice(i, 1);
        } else {
          cart[i].count--;
        }
        break;
      }
    }
    this.setData({
      cart: cart
    });
  },
  // 购物车结算
  checkoutCart() {
    var cart = JSON.stringify(this.data.cart);
    if (this.data.cart.length){
      wx.navigateTo({
        url: `../../pages/order/order?cart=` + cart + '&storeId=' + this.data.storeId
      })
    } 
  },
  

  selectTabItem(e) {
    if (e.target.dataset.index) {
      this.setData({
        tabIndex: e.target.dataset.index
      });
    }
  },
  preventScrollSwiper() {
    return false;
  },
  showStoreDetail() {
    this.setData({
      showModal: true
    });
  },
  closeModal(e) {
    this.setData({
      showModal: false
    });
  }
});