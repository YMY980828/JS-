import {request} from "../../common/request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      data:{}
  },

 getInfo(code){
  request({
    url:"search/searchByPrintCode.do",
    method:"get",
    data:{
      searchFrom:1,
      printCode:code
    }
  }).then(res=>{
      console.log(res)
    let data ={  
      shortPrintCode:res.data.data.shortPrintCode,
      address:res.data.data.address,
      num:res.data.data.num,
      productName:res.data.data.productName,
      unitName:res.data.data.unitName,
      contactPhone:res.data.data.contactPhone,
      entName:res.data.data.entName,
      issueTimeStr:res.data.data.issueTimeStr,
      signature:res.data.data.signature,
    }
    this.setData({
      data
    })
  })
 },
  onLoad: function (options) {
    this.getInfo(options.code)
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