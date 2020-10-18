import {request} from "../../common/request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{
      
    },
    params:{
      entId:"",
      productName:"",
      pageNum:1,
      pageSize:20
    }
  },
  select(e){
    let index = e.currentTarget.dataset.index
    let productName = this.data.data.rows[index].productName
    let entProductId = this.data.data.rows[index].entProductId
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      productName:productName,
      entProductId:entProductId
    })
   wx.navigateBack({  
     delta:1,               
   })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.params.entId = options.id;
    request({ 
      url:"dic/pageEnterpriseProduct.do",
      method:"get",
      data:this.data.params
     })
    .then(res=>{
        console.log(res)
      if(res.data.state==="Y")
      {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  loadimgMore(){
    let params = this.data.params
    params.pageNum++;
    request({
      url:"dic/pageEnterpriseProduct.do",
      method:"get",
      data:params
  }).then(res=>{
     if(res.data.state=="Y"){
      let data = this.data.data
      data.rows= data.rows.concat(res.data.rows)
     this.setData({
       data
     })
     }
  
  })
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