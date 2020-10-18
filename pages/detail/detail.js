import {formatTime} from "../../utils/util"
import {request} from "../../common/request/request" 
Page({
  
  data: {
    isAddmin:true,
    //canvas
    canvas:null,
    //产品数量
    count:"",
    //产品名称
    productName:"",
    value:-1,
    isShowPage:false,
    begin:{},
    moving:{},
    ctx:null,
     imgUrl:"",
     flag:true,
    info:{
      entName:"",
      entId:''
    },
    array:[],
    unitIds:[],
    date:"",
    //选择的date
    selectdate:""
  },
  showSignPage(){
      this.setData({
        isShowPage:true
      })
  },
  cancel(){
    this.data.ctx.draw()
 this.setData({
        isShowPage:false
      })
  },

  start(e){
    this.data.ctx.setLineWidth(5)
    this.data.ctx.fillStyle="#FF0000";
    let x = e.changedTouches[0].x;
    let y = e.changedTouches[0].y;
    this.data.ctx.moveTo(x,y)
  },  
  move(e){
    let x = e.changedTouches[0].x;
    let y = e.changedTouches[0].y;
    this.data.ctx.lineTo(x,y)
    this.data.ctx.stroke()
    this.data.ctx.draw(true);
    this.data.ctx.moveTo(x,y)
  },
  
  // 选择企业
  selectCompany(){
wx.navigateTo({
  url:"/pages/selectCompany/selectCompany"
})
  },
// 选择产品
selectProduct(){
  wx.navigateTo({
    url:"/pages/selectProduct/selectProduct?id="+this.data.info.entId
  })

},
//选择单位
selecteum(e){
    console.log(e)
    this.setData({
      value:e.detail.value
    })
},
//提交合格证
commit(){
  wx.showLoading()
  let query ={}
 
  query.entProductId=this.data.entProductId
  query.num = this.data.count
  query.unitId =  this.data.unitIds[this.data.value].unitId;
  query.produceTime = this.data.selectdate==''?this.data.date:this.data.selectdate;
  query.signature = this.data.imgUrl;
 
  if(this.data.isAddmin)
  {
    query.entId=this.data.info.entId
    query.entName = this.data.info.entName 
    if(query.entName==''){
      this.tips("提交失败!");
      return 
    }
  }
    if(query.entProductId==''||!query.entProductId|| query.num===''||query.unitId==0)
    {
      this.tips("提交失败!")
      wx.hideLoading()
      return 
    }
    this.commitCertificate(query).then(res=>{
      res.data.msg=res.data.msg==''?'上传成功':res.data.msg;
      wx.hideLoading()
      wx.showToast({
        title:res.data.msg,
        icon:"none"
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.setData({
        isAdd:true
      })
      wx.navigateBack({
        delta:1,
      })
    })
    .catch(e=>{
      wx.hideLoading()
       
    })
},
 
commitCertificate(query){
 return  request({
    url: 'cert/saveCertificateRecord.do',
    method: 'POST',
    data: query,
     header:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
},


selectDate(e){
 
  this.setData({
    selectdate:e.detail.value
  })
},

tips(title){
    wx.showToast({
      title,
      icon:"none"
    })
},


  onLoad: function (options) {
    let time = formatTime(new Date)
    let flag = wx.getStorageSync('flag')
    this.setData({
      date:time,
      isAddmin:flag
    })
        //获取产品单位列表
        this.getUnitList()
  },
  getUnitList(){
    request({
      url:"dic/getUnitList.do",
      method:"get"
    }).then(res=>{
        if(res.data.state=="Y"){
          
            let arr = res.data.data.map(r=>r.unitName);
            this.setData({
              unitIds:res.data.data,
              array:arr
            })
        }
    })
  },



  onReady: function () {
    const ctx = wx.createCanvasContext('firstCanvas')
    this.setData({
      ctx:ctx
    })  
    const query = wx.createSelectorQuery()
    query.select('#firstCanvas')
    .fields({ node: true, size: true ,context:true},res=>{
     this.setData({
      canvas:res.context._context.canvas
     })
    
    })
    .exec() 
  },
  upload(){
    wx.showLoading({
      title: '上传中...',
    })
    //获取token
    this.getToken()
    
     
    
  },
  getToken(){
    request({
      url: 'comm/getUploadToken.do',
      method: 'GET',
    
    }).then(res=>{
     
      if(res.data.state=='Y')
      {
        //保存token
        
        this.setData({
          token:res.data.data.token,
          url:res.data.data.url
        })
        this.canvasToTempFilePath();
      }
    })
  },
  canvasToTempFilePath(){
    let url = this.data.url;
    let that = this;
    this.data.ctx.draw(false, wx.canvasToTempFilePath({
     x: 0,
     y: 0,
     fileType: 'png',
     canvasId: 'firstCanvas',
     success(res) {
     let tempFilePath= res.tempFilePath;
     var key = new Date().getTime();
     var randomNum = parseInt(Math.random() * 10000);
     wx.uploadFile({
       filePath: tempFilePath, 
       name: 'file',
       url: 'https://upload.qiniup.com/',
       header:{
        'Content-Type': 'application/x-www-form-urlencoded'
       },  
       formData:{
        'token':that.data.token  ,
        'key':key + '_' + randomNum + '.png'
       },
       success:r1=>{
        if(r1.statusCode==200)
        {
          let key = JSON.parse(r1.data).key;
          wx.hideLoading()
          that.setData({
           flag:false,
           imgUrl: url+'/'+key,
           isShowPage:false
          })
        }

       },
       fail:err=>{
         console.log(err)
       }
     })

     },
     fail() {
     wx.showToast({
      title: '导出失败',
      icon: 'none',
      duration: 2000
     })
     }
    }))
  },

  selectcount(e){
    this.setData({
      count:e.detail.value
    })
  },
  clear(){
this.data.ctx.draw()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
      var pages = getCurrentPages();
     var currPage = pages[pages.length - 1]; //当前页面
  
     
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