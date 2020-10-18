import {request} from "../../common/request/request"
Page({

  data: {
      data:{},
      params:{
        areaCodeCity:"",
        areaCodeDistrict:"",
        areaCodeSubdistrict:"",
        entName:"",  
        kssj:"",
        jssj:"",
        pageNum:1,
        pageSize:20
      }
  },
 //下拉加载更多
 loadimgMore(){
  let params = this.data.params
  params.pageNum++;
  request({
    url:"search/pageSearchRecord.do",
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
      url:"search/pageSearchRecord.do",
      method:"get",
      data:this.data.params
  }).then(res=>{
   if(res.data.code===200)
   {
     console.log(res)
    wx.hideLoading()
    let data={
      total:res.data.total,
      rows:res.data.rows,
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