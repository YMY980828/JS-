import {request} from "../../common/request/request";
const formatTime=require("../../utils/util").formatTime
let cities=[];
let countys=[];
let streets=[]
Component({
  ready(){
       
      
      let flag = wx.getStorageSync('flag');
      if(flag)
      {
        this.selectCity()
      }
      let time = formatTime(new Date())
        this.setData({
          time,
          isAddmin:flag
        })
  },
  properties: {

  },

  data: {
    isAddmin:false,
    areaCodeCity:"",
    areaCodeDistrict:"",
    areaCodeSubdistrict:"",
    isShowAreaList:false,
    isShowDateList:false,
    isSearchList:false,
    areacity:[],
    areacounty:[],
    areastreet:[],
    areacityIndex:-1,
    areacountyIndex:-1,
    areastreetIndex:-1,
    time:"",
    startDate:"",
    endDate:"",
  },

  methods: {
    showSearchList(){
      if(this.data.isShowDateList)
      {
        this.setData({
          isShowDateList:false
        })
      }
      if(this.data.isShowAreaList)
      {
        this.setData({
          isShowAreaList:false
        })
      }
      this.setData({
        isSearchList:true
      })
    },
  showAreaList(e){
    if(this.data.isShowDateList)
    {
      this.setData({
        isShowDateList:false
      })
    }
    if(this.data.isSearchList)
    {
      this.setData({
        isSearchList:false
      })
    }
      this.setData({
        isShowAreaList:true
      })
  },
  showDateList(){
    if(this.data.isSearchList)
    {
      this.setData({
        isSearchList:false
      })
    }
    if(this.data.isShowAreaList)
    {
      this.setData({
        isShowAreaList:false
      })
    }
    this.setData({
      isShowDateList:true
    })
  },
  clear(){
    this.setData({
      isShowAreaList:false,
      isShowDateList:false,
      isSearchList:false
    })
  },
  //点击获取城市
  selectCity(){
    if(this.data.areacity.length>0)
    {
      return
    }
   
    request({
      url:"dic/getAreasByParAreaCode.do",
      method: 'get',
    data: {
        areaCode:32
      }
    }).then(res=>{
      if(res.data.code===200)
      {
      let areacity= this.handleCity(res.data.data)
      cities=res.data.data,
       this.setData({
        areacity
       })
      }
    
    })
  },
  handleCity(data){
      let areacity =data.map(val=>{
        return val.areaName
      })
      return areacity
  },
  //获取区县
  bindareacityrChange(e){
  
    let value = e.detail.value;
    let areaCode = cities[value].areaCode;
   this.setData({
    areacityIndex:value
   })
    request({
      url:"dic/getAreasByParAreaCode.do",
      method: 'get',
      data: {
        areaCode:areaCode
      }
    }).then(res=>{
      if(res.data.code===200)
      {
        
      let areacounty= this.handleCity(res.data.data);
      countys=res.data.data,
       this.setData({
        areacounty
       })
      }
    })
  },
  //获取街道
  bindareacountyChange(e){
  
    let value = e.detail.value;
    let areaCode = countys[value].areaCode;
    this.setData({
      areacountyIndex:value
     })
      request({
        url:"dic/getAreasByParAreaCode.do",
        method: 'get',
        data: {
          areaCode:areaCode
        }
      }).then(res=>{
        if(res.data.code===200)
        {
        let areastreet= this.handleCity(res.data.data);
     
        streets=res.data.data,
         this.setData({
          areastreet
         })
        }
      })
  },

  bindareastreetChange(e){
   
    let value = e.detail.value;
    this.setData({
      areastreetIndex:value
     })
  },
 //开始日期
 startchange(e){

  this.setData({
    startDate:e.detail.value
  })
 },
 //结束日期
 endchange(e){
     
      this.setData({
        endDate:e.detail.value
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
  },
  created(){
     let flag = wx.getStorageSync('flag');
 
     let obj = wx.getStorageSync('valite')
     
     if(!flag) 
     {
       let _this=this
       let areaCodeCity = obj.areaCodeCity
       let areaCodeDistrict = obj.areaCodeDistrict
       let areaCodeSubdistrict = obj.areaCodeSubdistrict
        
        this.getFixedName('32').then(res=>{
          if(res.data.code===200)
          {
            let r1 = res.data.data;
          let index1 =   r1.findIndex(val=>{
              return val.areaCode==areaCodeCity
            })
            let name = res.data.data[index1].areaName
            _this.setData({
              areaCodeCity:name
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
                areaCodeDistrict:name
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
              areaCodeSubdistrict:name
            })
              return this.getFixedName(areaCodeSubdistrict)
          }
      })
    
     }
  }
})
