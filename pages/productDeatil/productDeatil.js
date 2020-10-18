import {request} from "../../common/request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    info:{
      entName:"",
      entId:''
    },
  flag:true,
    value:"",
    row:[
      {
        title:"产品类别",
        name:""
      },
      {
        title:"产品名称",
        name:""
      }
    ],
     classLists:[],
     productClassNames:[],
     productName:"",
  },
//选择产品类别
selectProductClass(e){
      console.log(e)
      this.setData({
        value:e.detail.value
      })
      
},
  onLoad: function (options) {
      this.getClassLists();
      let flag =wx.getStorageSync('flag')
      this.setData({
        flag:flag
      })
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

put(e){
    let value = e.detail.value;
    this.setData({
      productName:value
    })
},

//提交产品
submit(){
    let query ={};
      let value = this.data.value;
      let productName = this.data.productName;// 产品名称
    
      if(value==='')
      {
        wx.showToast({
          title: '请选择产品类别!',
          icon:"none"
        })
        return 
      }
      if(productName===''||productName.trim().length==0){
        wx.showToast({
          title: '请选择产品名称!',
          icon:"none"
        })
        return 
      }
      wx.showLoading()
     let productClassId=this.data.classLists[this.data.value].productClassId // 产品类别id
     let productClassName = this.data.productClassNames[this.data.value]
     query.productClassId=productClassId
     query.productClassName=productClassName
     query.productName=productName
      //flag:false 企业端 和 游客
    //flag:true  管理员 和 监管用户
      if(this.data.flag){
        query.entName = this.data.info.entName
        query.entId = this.data.info.entId
      }
      this.saveEnterpriseProduct(query).then(res=>{
          wx.hideLoading({
            
          })
        if(res.data.code===200){
           wx.showToast({
             title: '添加成功',
             icon:"none"
           })
           var pages = getCurrentPages();
           var prevPage = pages[pages.length - 2]; //上一个页面
           prevPage.getList()
            wx.navigateBack({
              delta:1
            })

        }else{
          wx.showToast({
            title: '添加失败',
            icon:"none"
          })
        }
      }).catch(err=>{
        wx.hideLoading({
            
        })
        wx.showToast({
          title: '添加失败',
          icon:"none"
        })
      })
      
      
},
saveEnterpriseProduct(query){
  return request({
    url: 'ent/saveEnterpriseProduct.do',
    method: 'POST',
    header:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: query
  })
},



 // 选择企业
 selectCompany(){
  wx.navigateTo({
    url:"/pages/selectCompany/selectCompany"
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