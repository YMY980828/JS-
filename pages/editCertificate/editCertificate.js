// pages/editCertificate/editCertificate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    row:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    let row = JSON.parse(options.row)
      let obj=[
        {
          title:"产品名称",
          name:row.productName
        },
        {
          title:"产品数量",
          name:row.num
        },
        {
          title:"产品单位",
          name:row.unitName
        },
        {
          title:"生产日期",
          name:row.produceTime
        },
      ]
     
    
      this.setData({
        row:obj
      })
      wx.hideLoading()
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

  }
})