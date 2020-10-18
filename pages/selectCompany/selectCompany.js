import {request} from "../../common/request/request"
Page({

  data: {
    data:{},
      params:{
        areaCodeCity:"",
        areaCodeDistrict:"",
        areaCodeSubdistrict:"",
        villageCode:"",  
        industryId:"",
        registeredNumber:"",
        contactPhone:"",
        entName:"",
        pageNum:1,
        pageSize:20
      } 
  },
  


  loadimgMore(){
    let params = this.data.params
    params.pageNum++;
    request({
      url:"dic/pageEnterprise.do",
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

  select(e){
      let index = e.currentTarget.dataset.index
      let entName = this.data.data.rows[index].entName
      let entId = this.data.data.rows[index].entId
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      let info ={
        entName,
        entId
      }
      prevPage.setData({
        info:info
      })
     wx.navigateBack({  
       delta:1,               
     })
  },

  onLoad: function (options) {
    wx.showLoading({})
    request({
      url:"dic/pageEnterprise.do",
      method:"get" , 
      data:this.data.params
    }).then(res=>{
      if(res.data.code===200)
      {
       
        wx.hideLoading({});
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