//index.js
//获取应用实例
const app = getApp()
const navigationBarHeight = (app.statusBarHeight + 44) + 'px'

Page({
  data: {
    navigationBarTitle: '张小薇毕设',
    navigationBarHeight,

    userInfo: {},
    hasUserInfo: false,
    showFixed: false,
    sortHeight: 0,
    sortIndex: 0,
    sortListIndex: 0,
    showSort: false,
    scrollFixedTop: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    carouselList: [],
    categoriesList: [],
    storeList: [],
  },


  //事件处理函数
  onLoad: function(query) {
    var that = this
    // 扫描小程序码
    const scene = decodeURIComponent(query.scene)
    if (scene != "undefined") {
      wx.navigateTo({
        url: `../store/store?storeId=` + scene
      })
    }

    // get请求，获取首页轮播图列表carouselList
    app.func.getReq("/api/carousel", function(res) {
      for (var i = 0; i < res.data.carouselList.length; i++) {
        let s = res.data.carouselList[i].imgUrl
        res.data.carouselList[i].imgUrl = app.globalData.serverDomain + s
      }
      that.setData({
        carouselList: res.data.carouselList
      })
    })

    // get请求，获取附近商家列表storeList
    app.func.getReq("/api/store", function(res) {
      for (var i = 0; i < res.data.storeList.length; i++) {
        let s = res.data.storeList[i].storeImgUrl
        res.data.storeList[i].storeImgUrl = app.globalData.serverDomain + s
      }
      that.setData({
        storeList: res.data.storeList
      })
    })
  },
  onReady: function(e) {},
  onPageScroll: function(e) {
    wx.stopPullDownRefresh()
    if (e.scrollTop >= this.data.scrollFixedTop && !this.data.showFixed) {
      this.setData({
        showFixed: true
      })
    } else if (e.scrollTop < this.data.scrollFixedTop && this.data.showFixed) {
      this.setData({
        showFixed: false
      })
    }
  },
  select(id) {
    wx.navigateTo({
      url: `../store/store?storeId=` + id.detail
    })
  },
  getTabsInfo(e) {
    wx.pageScrollTo({
      scrollTop: e.target.offsetTop - 1,
      duration: 300
    })
    setTimeout(() => {
      if (e.target.dataset.index == 0) {
        this.setData({
          showSort: !this.data.showSort
        })
      }
      if (e.target.dataset.index) {
        this.setData({
          showFixed: true,
          sortIndex: e.target.dataset.index
        })
      }
    }, 350)
  },
  getFixedTabsInfo(e) {
    if (e.target.dataset.index) {
      this.setData({
        sortIndex: e.target.dataset.index
      })
    }
    if (e.target.dataset.index == 0) {
      this.setData({
        showSort: !this.data.showSort
      })
    } else {
      this.setData({
        showSort: false
      })
    }
  },
  move() {},
  selectSort(e) {
    if (e.target.dataset.sortindex || e.target.dataset.sortindex == 0) {
      this.setData({
        sortListIndex: e.target.dataset.sortindex,
        showSort: false
      })
    } else {
      this.setData({
        showSort: false
      })
    }
  },

  // onLoad: function (opt) {
  //   console.log(opt.name)
  //   app.func.getReq("/api/test", function (res) {
  //     console.log("banner==")
  //     console.log(res)
  //   });
  //   // post 请求
  //   app.func.postReq("/api/test",{x: '',y: ''},function (res) {
  //     console.log("banner==")
  //     console.log(res)
  //   });
  // }

})