import {request} from "../../common/request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    value:"",
       info:{

       },
       classLists:[],
       productClassNames:[],
  },
  cancelprint(){
    wx.showLoading({
        
    })
  },
/**
 * 删除产品
 */
research(){
  wx.showModal({
    content:"确定删除?",
    success:(e)=>{
          if(e.confirm)
          {
            wx.showLoading({    })
            request({ 
              url: 'ent/delEnterpriseProduct.do',
              header:{
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method:"post",
              data:{
                entProductId:this.data.info.entProductId
              }
            }).then(res=>{
              wx.hideLoading({    })
             if(res.data.state=="Y"){
                  wx.showToast({
                    title: '删除成功!',
                  })
                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2]; //上一个页面
                  prevPage.setData({
                    toTop:true
                  })
                  wx.navigateBack({
                   delta:1
                  })

            }
            else{
              wx.showToast({
                title: res.data.msg,
              })
            }
            }).catch(err=>{
              wx.hideLoading({    })
              wx.showToast({
                title: "删除失败",
              })
            }) 
          }
    }
  })
 
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        info:JSON.parse(options.info)
      })
      this.getClassLists();
  },
getClassLists(){
  request({
    url:"dic/getProductClassList.do"
  }).then(res=>{

    if(res.data.code===200){
      let productClassNames = res.data.data.map(val=>{
     
        return val.productClassName
      })
        this.setData({
          productClassNames:productClassNames,
          classLists:res.data.data
        })
    }
  })
},

//选择产品类别
selectProductClass(e){

  this.setData({
    value:e.detail.value
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