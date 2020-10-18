import {request} from "../../common/request/request"
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    top:0,
    toTop:false,
    params:{
      productName:"",
      pageNum:1,
      isActive:"",
      pageSize:20
    },
    data:{},
    
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading()
      this.getList()

  },
  getList(){
    wx.showLoading()
    request({
      url:"ent/pageEnterpriseProduct.do",
      method:"get",
      data:this.data.params
  }).then(res=>{
     wx.hideLoading()
    let data={      
      total:res.data.total,
      rows:res.data.rows,
    }
    this.setData({
    data:data
    })
  })
  },
  loadimgMore(){
    let params = this.data.params
    params.pageNum++;
    request({
      url:"ent/pageEnterpriseProduct.do",
      method:"get",
      data:params
  }).then(res=>{
     
     let data = this.data.data
     data.rows= data.rows.concat(res.data.rows)
    this.setData({
      data
    })
  })
  },

  add(){
      wx.navigateTo({
        url: '/pages/productDeatil/productDeatil',
      })
  }, 

  toDelete(e){
   
    let item = JSON.stringify(e.currentTarget.dataset.item);
     wx.navigateTo({
       url: '/pages/deleteCompany/deleteCompany?info='+item,
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
    if(this.data.toTop){
      this.setData({
        params:{
          productName:"",
          pageNum:1,
          isActive:"",
          pageSize:20
        },
      })
      this.getList()
        this.setData({
          top:0,
          toTop:false
        })

    }
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