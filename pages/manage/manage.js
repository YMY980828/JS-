// pages/manage/manage.js
import {request} from "../../common/request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:""
  },

  exit(){
    wx.showModal({
      content:"确定注销?",
      success:(e)=>{
            if(e.confirm)
            {
              wx.showLoading({    })
             
             request({
                url: 'wx/logoffEntMapInfo.do',
                method:"get"
              }).then(res=>{
                wx.hideLoading({    })
                if(res.data.state=="Y"){
                  wx.clearStorageSync()
                  wx.showToast({
                    title: "注销成功!",
                    icon:"none" 
                  })
                  wx.setStorageSync('valite', res.data.data);
                  this.refresh()
                }
                if(res.data.state=="N"){
                  wx.showToast({
                    title: "注销失败",
                    icon:"none"
                  })
                }
                console.log(res)
              })       
            }
      }
    })
  },
  toCertification(){
    wx.navigateTo({
      url: '/pages/certification/certification',
    })
  },
refresh(){
  this.setData({
    name:wx.getStorageSync('valite').titleName|| '尚未登录'
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.refresh()
       
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
    console.log(111)
    this.setData({
      name:wx.getStorageSync('valite').titleName|| '尚未登录'
    })
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