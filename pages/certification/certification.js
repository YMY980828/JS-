// pages/certification/certification.js
var bmap = require('../../libs/bmap-wx.min'); 
import {request} from "../../common/request/request"

let cities=[];
let countys=[];
let streets=[];
let industries=[];
let companies=[]
let histories =[]
 //地区编码-市
 let areaCodeCity="";
 //地区编码-区
 let areaCodeDistrict="";
  //地区编码-街道
  let areaCodeSubdistrict="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    //城市区
    AllDatas:[],
   //展示picker
    showPicker:false,
    //所属行业名
    industryNames:"",
    //企业类别名
    entClassifyName:"",
      //市名
      areaCodeCityName:"",
    //区名
    areaCodeDistrictName:"",
    //街道名
    areaCodeSubdistrictName:"",
    areacityIndex:-1,
    areacountyIndex:-1,
    areastreetIndex:-1,
    industryIndex:-1,
    companyIndex:-1,
    token:"",
    showdetail:false,
    cities:[],
    areacity:[],
    areacounty:[],
    countys:[],
    areastreet:[],
    streets:[],
    value:"",
    //当前用户状态
      info:{},
      state:"",
     
        //生产者姓名
        realName:"",
        //企业名称
        entName:"",
          //企业注册号
          registeredNumber:"",
            //行业id
            industryIds:"",
          //企业类别
          entClassifyId:"",
            //企业联系人
            contactPerson:"",
          //企业联系电话
          contactPhone:"",
            //详细地址
            address:"",
         //行业类别
      industry:[],
      //企业类别
      company:[],
      //历史绑定企业列表
      showEntDescs:[],
    
 
     

  },
  handleCity(data){
    let areacity =data.map(val=>{
      return val.areaName
    })
    return areacity
},
handleInfo(data){
    if(data.length>0){
      let showEntDescs = data.map(val=>{
        return val.showEntDesc
      })
      this.setData({
        showEntDescs:showEntDescs
      })
    }
},
getlocation(){
  wx.showLoading({
    title: '获取中...',
  })
   /**
     * 百度地图
     */
    this.map().then(res=>{
      console.log(res)
      if(res.wxMarkerData.length>0){
       wx.hideLoading({
       
       })
        this.setData({
          address:res.wxMarkerData[0].address
        })
      }else{
        wx.hideLoading({
       
        })
        this.Toast("自动获取失败,请手动输入")
      }
      // wx.navigateTo({
      //   url: '/pages/location/location?data='+JSON.stringify(res),
      //    })
    }).catch(err=>{
      wx.hideLoading({
       
      })
      this.Toast("自动获取失败,请手动输入")
    });

 
},
map(){
  var BMap = new bmap.BMapWX({ 
    ak: '0x9z1hUZ2ucdpCM2Iqhg8tN7C59Of7HM' 
}); 
var that = this; 
        return new Promise((resolv,reject)=>{
          var fail = function(data) { 
            console.log(data) 
            reject(data)
        }; 
        var success = function(data) { 
        
            resolv(data)
          
        } 
        // 发起regeocoding检索请求 
        BMap.regeocoding({ 
            fail: fail, 
            success: success, 
           
        }); 
        })
        
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    wx.showLoading({ });
 
    let count=3;
    let token = wx.getStorageSync('valite').token;
    request({
     url:"wx/getCurrEntInfo.do",
     header:{
      'X-Token': token
     }, 
     method:'get',
    }).then(res=>{  
      count--;
      if(count===0){
        wx.hideLoading({
          complete: (res) => {},
        })
      }
     
      if(res.data.state=='Y'){
        this.setData({
          showdetail:true,
          industryNames:res.data.data.industryNames,
        entClassifyName:res.data.data.entClassifyName,
        industryIds:res.data.data.industryIds,
        entClassifyId:res.data.data.entClassifyId+"",
        contactPerson:res.data.data.contactPerson,
        address:res.data.data.address,
        entName:res.data.data.entName,
        realName:res.data.data.realName,
        registeredNumber:res.data.data.registeredNumber,
        contactPhone:res.data.data.contactPhone,
          value:res.data.data.registeredNumber,

        })
        areaCodeCity = res.data.data.areaCodeCity;
        areaCodeDistrict = res.data.data.areaCodeDistrict;
        areaCodeSubdistrict = res.data.data.areaCodeSubdistrict;
       
        this.handleIndex(areaCodeCity,areaCodeDistrict,areaCodeSubdistrict);


      }
        if(res.data.state=="Y2"){
          this.handleInfo(res.data.data);
          histories = res.data.data
        }
        this.setData({
         
          info:{
            data:res.data.data,
            state:res.data.state
          },
        
        })
     
    })
    this.setData({
      token:token
    })
  
  request({
    url:"dic/getIndustryList.do",
    method:"get",
    header:{
      'X-Token': token
    }
  }).then(res=>{
   
   
    if(res.data.state=='Y'){
      count--;
      if(count===0){
        wx.hideLoading({
          complete: (res) => {},
        })
      }
      industries = res.data.data;
     
      let industry = res.data.data.map(val=>{
        return val.industryName;
      })
        this.setData({
          industry:industry
        })
    }
 
  })
  request({
    url:"dic/getEnterpriseClassifyList.do",
    method:"get",
    header:{
      'X-Token': token
    }
  }).then(res=>{
   
   
    if(res.data.state=='Y'){
      count--;
      if(count===0){
        wx.hideLoading({
          complete: (res) => {},
        })
      }
      companies = res.data.data;
      
      let company = res.data.data.map(val=>{
        return val.entClassifyName;
      })
        this.setData({
          company:company
        })
    } 
  })
  },  
change(e){
 
  let detail = parseInt(e.detail.value);
  if( histories.length>0){
    let value = histories[detail].registeredNumber;
    this.setData({
      value:value
    })
    this.next()
  }
},
next(){
setTimeout(()=>{
    if(this.data.value.trim()==""){
      wx.showToast({
        title: '认证信息不能为空!',
        icon:"none"
      })
      return 
    }
    
    
    request({
      url:"wx/getEntInfoByRegisteredNumber.do",
      header:{
        'X-Token': this.data.token,
        'Content-Type': 'application/x-www-form-urlencoded'
       }, 
       data:
       {
        registeredNumber : this.data.value.trim(),
       },
       method:'post',
    }).then(res=>{
     
     if(res.data.state=="Y"){
      console.log(res)
      areaCodeCity = res.data.data.areaCodeCity;
      areaCodeDistrict = res.data.data.areaCodeDistrict;
      areaCodeSubdistrict = res.data.data.areaCodeSubdistrict;
      this.handleIndex(areaCodeCity,areaCodeDistrict,areaCodeSubdistrict);
       this.setData({
        industryNames:res.data.data.industryNames,
        entClassifyName:res.data.data.entClassifyName,
        industryIds:res.data.data.industryIds,
        entClassifyId:res.data.data.entClassifyId+"",
        contactPerson:res.data.data.contactPerson,
        address:res.data.data.address,
        entName:res.data.data.entName,
        realName:res.data.data.realName,
        registeredNumber:res.data.data.registeredNumber,
        contactPhone:res.data.data.contactPhone,
         info:{
           data:res.data.data,
           state:res.data.state
         },
         showdetail:true
       })
    
     }else if(res.data.state=="N"){
     
       wx.showToast({
         title: res.data.msg,
       })
     }else if(res.data.state=="Y2"){
     
        this.setData({
          showdetail:true,
          info:{
            data:res.data.data,
            state:res.data.state
          },
        })
  
     }
      
    })
  
  },200)
 
},
handleIndex(areaCodeCity,areaCodeDistrict,areaCodeSubdistrict){
  let _this=this   
   this.getFixedName('32').then(res=>{
     if(res.data.code===200)
     {
       let r1 = res.data.data;
     let index1 =   r1.findIndex(val=>{
         return val.areaCode==areaCodeCity
       })
       let name = res.data.data[index1].areaName
       _this.setData({
         areaCodeCityName:name
       })
         return this.getFixedName(areaCodeCity)
     }
 }).then(r1=>{
   if(r1.data.code===200)
     {
       let r2 = r1.data.data;
     let index2 =   r2.findIndex(val=>{
         return val.areaCode==areaCodeDistrict
       })
       let name = r1.data.data[index2].areaName
        
         _this.setData({
           areaCodeDistrictName:name
         })
         return this.getFixedName(areaCodeDistrict)
     }
 }).then(r2=>{
   if(r2.data.code===200)
     {
       let r3 = r2.data.data;
     let index3 =   r3.findIndex(val=>{
         return val.areaCode==areaCodeSubdistrict
       })
     
       let name = r2.data.data[index3].areaName
        
       _this.setData({
         areaCodeSubdistrictName:name
       })
         return this.getFixedName(areaCodeSubdistrict)
     }
 })
},

blur(e){
  this.setData({
    value:e.detail.value,
    registeredNumber:e.detail.value
  })

},
/**
 * 提交信息 
 */
submit(){
   
  let realName = this.data.realName;

  let entName = this.data.entName;
  if( entName=="" ){
    this.Toast("企业名称不能为空!")
    return
  }
  let registeredNumber = this.data.registeredNumber;
  if( registeredNumber=="" ){
    this.Toast("企业注册号不能为空!")
    return
  }
  let industryIds = this.data.industryIds;
  if( industryIds=="" ){
    industryIds = "种植业";
  }
  let entClassifyId = this.data.entClassifyId;
  if( entClassifyId=="" ){
    this.Toast("企业类别不能为空!")
    return
  }else{
   if(typeof entClassifyId =="string"){
    entClassifyId  =parseInt(entClassifyId.trim());
   }
  
    
  }
  let contactPerson = this.data.contactPerson;
  if( contactPerson=="" ){
    this.Toast("负责人不能为空!")
    return
  }
  let contactPhone = this.data.contactPhone;
  if( contactPhone==""  ){
    this.Toast("手机号不能为空!")
    return
  }

  let address = this.data.address;
  if( address=="" ){
    this.Toast("地址不能为空!")
    return
  }

  if( areaCodeCity=="" ){
    this.Toast("市编码不能为空!")
    return
  }
 
  if( areaCodeDistrict=="" ){
    this.Toast("区编码不能为空!")
    return
  }
 
  if( areaCodeSubdistrict=="" ){
    this.Toast("街道编码不能为空!")
    return
  }
  wx.showLoading({ })
  let data = {
    entName,
    registeredNumber,
    industryIds,
   entClassifyId,
    contactPerson,
    contactPhone,
    address,
    areaCodeCity,
    areaCodeDistrict,
    areaCodeSubdistrict,
  }
  if( this.data.info.state=="Y" ){
    if( !this.data.info.data.entId){
      data['entId'] =  "";
    }else{
      data['entId'] =  this.data.info.data.entId;
    }
    
  }
  request({
    header:{
     // 'Content-Type': 'application/json',
     'X-Token':this.data.token ,
    'Content-Type':  'application/json;charset=utf-8',
     },        
    url:"wx/saveAndBindEntInfo.do",  
    method:"post", 
    data:data
  }).then(res=>{
 
    wx.hideLoading({  })
    if(res.data.state=='Y'){
    
      let data = res.data.data;
      if(data.token){
        wx.setStorageSync('valite', res.data.data)
      }
        wx.showToast({
          title: '实名认证成功!',
         
        }) 
    }else if(res.data.state=='N'){
      wx.showToast({
        title: res.data.msg,
        icon:"none"
      })
    }
  })

},
Toast(str){
  wx.showToast({
    title: str,
    icon:"none"
  })
},
/**
 * bindblur
 * 
 */

getentName(e){
  
  this.setData({
    entName:e.detail.value
  })
},

getindustryIds(e){
 
  this.setData({
    industryIds:e.detail.value
  })
},
getentClassifyId(e){

  this.setData({
    entClassifyId:e.detail.value
  })
},
getcontactPerson(e){
  
  this.setData({
    contactPerson:e.detail.value,
    realName:e.detail.value
  })
},
getcontactPhone(e){
  
  this.setData({
    contactPhone:e.detail.value
  })
},
getaddress(e){
  
  this.setData({
    address:e.detail.value
  })
},
getFixedName(areaCode){
  return request({
    url:"dic/getAreasByParAreaCode.do",
    method: 'get',
  data: {
      areaCode:areaCode
    }
  })
}, 
//  //获取区县
//  bindareacityrChange(e){
 
//   let value = e.detail.value;
//   areaCodeCity = cities[value].areaCode;
//  this.setData({
//   areacityIndex:value,
//   areaCodeCityName:this.data.areacity[value]
//  })
 
//   request({
//     url:"dic/getAreasByParAreaCode.do",
//     method: 'get',
//     data: {
//       areaCode:areaCodeCity
//     }
//   }).then(res=>{
//     if(res.data.code===200)
//     {
//     let areacounty= this.handleCity(res.data.data);
//     countys=res.data.data,
//      this.setData({
//       areacounty,
//       areacountyIndex:0,
   
//      })
//      this.bindareacountyChange({
//        detail:{
//         value:1
//        }
//      })
//     }
//   })
// }, 
//  //获取街道 
//  bindareacountyChange(e){

//   let value = e.detail.value;
  
//   areaCodeDistrict = countys[value].areaCode;
//   this.setData({
//     areacountyIndex:value,
//     areaCodeDistrictName:this.data.areacounty[value]
//    })
//     request({
//       url:"dic/getAreasByParAreaCode.do",
//       method: 'get',
//       data: {
//         areaCode:areaCodeDistrict
//       }
//     }).then(res=>{
//       if(res.data.code===200)
//       {
//       let areastreet= this.handleCity(res.data.data);
//       streets=res.data.data,
//        this.setData({
//         areastreet,
//         areastreetIndex:0,
       

//        })
//        this.bindareastreetChange({
//          detail:{
//            value:1
//          }
//        })
//       } 
//     })  
// },

// bindareastreetChange(e){
 
//   let value = e.detail.value;
//   if(streets.length>0){
//     areaCodeSubdistrict= streets[value].areaCode;
//     this.setData({
//       areastreetIndex:value,
//       areaCodeSubdistrictName:this.data.areastreet[value]
//      })
//   }

 
// },

bindindustryChange(e){

    let index = e.detail.value;
    this.setData({
      industryIndex:index,
      industryIds:industries[index].industryId+"",
      industryNames:this.data.industry[index],
    })

},
bindcompanyChange(e){
  let index = e.detail.value;

    this.setData({
      companyIndex:index,
      entClassifyId:companies[index].entClassifyId,
      entClassifyName:this.data.company[index]
    })
},
getPhoneNumber(e){
  console.log(e)
},
showPickerFn(){
  this.setData({
    showPicker:true
  })
},
hidePicker(){
 
  this.setData({
    showPicker:false
  })
},
confirmPicker(){
  let data = this.data.AllDatas; 
  if(data.length<3){
    wx.showToast({
      title: '请选择所在市区街道!',
      icon:"none"
    })
    return 
  }
 
  this.setData({
    showPicker:false,
    areaCodeCityName :data[0][1],
    areaCodeDistrictName : data[1][1],
    areaCodeSubdistrictName : data[2][1],
    
  })
  areaCodeCity=data[0][0];
    areaCodeDistrict=data[1][0];
    areaCodeSubdistrict=data[2][0];
},
receivePicker(e){
  
    let data = e.detail
   this.setData({
     AllDatas:data
   })

},
getPhoneNumber(e){
  console.log(e)
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