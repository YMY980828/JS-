import {request} from "../../common/request/request"
Page({

  data: {
    params:{
      areaCodeCity:"",
      areaCodeDistrict:"", 
      areaCodeSubdistrict:"",
      entName:"",  
      kssj:"",
      jssj:"",
      pageNum:1,
      pageSize:20,
      withTotalCount:true
    }
  },
  //下拉加载更多
  loadimgMore(){
    let params = this.data.params
    params.pageNum++;
    request({
      url:"print/pagePrintRecord.do",
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
  onLoad: function (options) {
    this.getList()
  },
  getList(){
    wx.showLoading()
    request({
      url:"print/pagePrintRecord.do",
      method:"get",
      data:this.data.params
  }).then(res=>{
   if(res.data.code===200)
   {
   
    wx.hideLoading()
    let data={
      total:res.data.total,
      rows:res.data.rows,
      data:res.data.data
    }
    this.setData({
    data:data
    })
   }
  
  })
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