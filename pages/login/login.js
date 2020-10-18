import {request} from "../../common/request/request"
Page({
  data: {
    username:"",
    password:""
  },
login(){
  wx.showLoading()
    let data={
      loginName:this.data.username.trim(),
      password:this.data.password.trim(),
      type:0
    }
  request({
    login:true,
    url: 'auth/getToken.do',
    method: 'post',
    data,
    header:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }).then(res=>{
    if(res.data.code===200)
    {
      console.log(res.data)
      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon:"none"
      })
      wx.showLoading()
        let value = res.data.data
       
        wx.setStorageSync('valite', value)
        wx.hideLoading({  
          complete: () => {
            wx.reLaunch({
              url: '/pages/home/home',
            })
          },
        })
        let type = res.data.data.userType
      
        //type 0 
        if (type === 1 || type === -1 ) { // 企业端 和 游客
           wx.setStorageSync('flag', false)
        } else { // 管理员 和 监管用户
          wx.setStorageSync('flag', true)
        }
    }
    else{
      wx.hideLoading()
      wx.showToast({
        title: '登录失败!',
        icon:"none"
      })
    }
  }).catch(err=>{
  
    wx.hideLoading()
    wx.showToast({
      title: '登录超时!',
      icon:"none"
    })
  })
},

UserNamePut(e){
  this.setData({
    username:e.detail.value
  })  
},
PassWordPut(e){
  this.setData({
    password:e.detail.value
  })
},


  onLoad: function (options) {

  },

  onReady: function () {

  },


  onShow: function () {

  },

 
  onHide: function () {

  },

 
  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  
  onShareAppMessage: function () {

  }
})