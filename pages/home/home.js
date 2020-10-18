// pages/home/home.js
import {request} from "../../common/request/request"
Page({
 
  /**
   * 页面的初始数据  
   */
  data: {
      top:24,
      nickname:"点击微信授权",
      avatarUrl:"", 
      jsCode:"",
  },

  getuserinfo(e){
    let avatarUrl = this.data.avatarUrl;
     
  if(avatarUrl.trim()==""){
      
    if(e.detail){
      console.log(e)
      let {avatarUrl} = e.detail.userInfo;
      let nickName = wx.getStorageSync('valite').titleName;
      if(!nickName){
        nickName = "点击实名认证"
      }
      this.setData({
        nickname:nickName,
        avatarUrl:avatarUrl 
       })
       wx.setStorageSync('avatar', avatarUrl)
  }
  }else{
    this.login()
   
    }

  },


  open(e){
    
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url:`/pages/${name}/${name}`,
    })
  },  
  // getuserinfo(e){
  //   console.log(e)
  // }, 
    

  /**
   * 生命周期函数--监听页面加载
   */
  login(){
    let code = this.data.jsCode;
    let _this = this;
    if(code.trim()==""  ){
      wx.login({
        complete: (res) => {
          request({        
            url:"wx/login.do",
            header:{
             'Content-Type': 'application/x-www-form-urlencoded'
            }, 
            method:'post',
            data:{
              jsCode:res.code 
            }
          }).then(r=>{
              
             wx.setStorageSync('valite', r.data.data);
             wx.navigateTo({
               url: '/pages/certification/certification',
             })
             
          }).catch(err=>{
            wx.showToast({
              title: 'title',
              icon:"none"
            })
            wx.clearStorageSync();
          })


          _this.setData({
            jsCode:res.code  
          })
         
        },
      })
    }else{
      request({        
        url:"wx/login.do",
        header:{
         'Content-Type': 'application/x-www-form-urlencoded'
        }, 
        method:'post',
        data:{
          jsCode:code 
        }
      }).then(r=>{
          
         wx.setStorageSync('valite', r.data.data);
         wx.navigateTo({
           url: '/pages/certification/certification',
         })
         
      }).catch(err=>{
        wx.showToast({
          title: 'title',
          icon:"none"
        })
        wx.clearStorageSync();
      })
    }
  
  },



  onLoad: function (options) {
    let {height,top}  = wx.getMenuButtonBoundingClientRect();
    this.setData({
      height:height,
      top:top
    })
  
    let avatarUrl = wx.getStorageSync('avatar');
    if(avatarUrl.trim()!==""){
      this.setData({
       
        avatarUrl:avatarUrl 
       })
    }
    let vailte = wx.getStorageSync('valite');
    let _this = this;
    if(vailte){
      let token = wx.getStorageSync('valite').token;
      if(!token){
        this.getJsCode();
        return;
      }
      wx.checkSession({
        success () {
          //session_key 未过期，并且在本生命周期一直有效
        
        },
        fail () {
          // session_key 已经失效，需要重新执行登录流程
          _this.getJsCode() //重新登录
        }
      })
    
    }else{
      this.getJsCode()
    }
  
  },

getJsCode(){
  let _this = this;
  wx.login({
    complete: (res) => {
      _this.setData({
        jsCode:res.code  
      })
     
    },
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
    
    let nickname = wx.getStorageSync('valite').titleName;
    if(nickname=="匿名用户"){
      nickname+="(点击认证)"
    }
      this.setData({
        nickname,
        avatarUrl:wx.getStorageSync('avatar')
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