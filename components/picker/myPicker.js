let city=[
  {areaName:"请选择", areaCode: '' },
  {areaName: '南京市', areaCode: '3201'},
  {areaName: '无锡市', areaCode: '3202'},
  {areaName: '徐州市', areaCode: '3203'},
  {areaName: '常州市', areaCode: '3204'},
  {areaName: '苏州市', areaCode: '3205'}, 
  {areaName: '南通市', areaCode: '3206'},
  {areaName: '连云港市', areaCode: '3207'},
  {areaName: '淮安市', areaCode: '3208'},
  {areaName: '盐城市', areaCode: '3209'},
  {areaName: '扬州市', areaCode: '3210'},
  {areaName: '镇江市', areaCode: '3211'},
  {areaName: '泰州市', areaCode: '3212'},
  {areaName: '宿迁市', areaCode: '3213'}
]
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    city:city,
    value:[0,0,0],
    city1:[],
    city2:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange(e){
      let cityIndex = this.data.value[0];
      let substirctIndex = this.data.value[1];
      let streetIndex = this.data.value[2]
      let value = e.detail.value;
      let obj =[];
      if( value[0]!=cityIndex ){
  
          let code = city[value[0]].areaCode;
          this.getList(code).then(res=>{
           
            this.setData({
              city1:res,
              city2:[],
              value:[value[0],0,0]
            })
            this.triggerEvent('myevent', [])
          })
  
      }else if( value[1]!=substirctIndex ){
        let code = this.data.city1[value[1]].areaCode;
        this.getList(code).then(res=>{
       
          this.setData({
            city2:res,
            value:[value[0],value[1],0]
          })
           obj =[
              [ city[value[0]].areaCode,city[value[0]].areaName  ],
              [ this.data.city1[value[1]].areaCode,this.data.city1[value[1]].areaName  ],
              [ res[0].areaCode,res[0].areaName  ],
          ];
         
          this.triggerEvent('myevent', obj)
        })
      }else{
       
       obj =[

          [ city[value[0]].areaCode,city[value[0]].areaName  ],
          [ this.data.city1[value[1]].areaCode,this.data.city1[value[1]].areaName  ],
          [ this.data.city2[value[2]].areaCode,this.data.city2[value[2]].areaName  ],

      ];
      
      this.triggerEvent('myevent', obj)
      }
    
      
  
    },
  
    getList( code ){
      let val = wx.getStorageSync('valite')
      return new Promise( (resolve,reject)=>{
        wx.request({
          method:"get",
          header:{
              'X-Token':val.token
  
          },
          url: 'https://jshgz.snzfnm.com/jscertificate/webapp/dic/getAreasByParAreaCode.do?areaCode='+code,
          success:res=>{
            resolve(res.data.data)
          }
        })
      } )
  
      
  
    },
 
  }
})
