// components/order-list/order-list.js

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      'type': Object,
      'value': null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    orderInfo: function (e) {
      console.log("orderInfo", e)
    },
  }
})