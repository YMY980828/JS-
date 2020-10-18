import {request} from "../../common/request/request"
const toGbkBytes = require('../../utils/index');
const encoding = require('../../utils/encoding.js')
const cpclExp = require('../../utils/cpcl-exp.js');
const hddExp = require("../../utils/hdd");
let gbToBase64 = require("../../utils/gb2312ToBase64.js");
const ToBase64 = require('../../utils/base64gb2312.js');
const services_uuid1 = "0000EEE0-0000-1000-8000-00805F9B34FB";
const services_uuid2 = "0000FF00-0000-1000-8000-00805F9B34FB";
const services_uuid3 = "49535343-FE7D-4AE5-8FA9-9FAFD205E455";
//ds服务id
const DS_serviceId='49535343-FE7D-4AE5-8FA9-9FAFD205E455';
const DS_characteristicId='49535343-8841-43F4-A8D4-ECBE34729BB3';

let type = "TXT-8";

let QRCodeUrl=""
let val='',data={},hddVal="";
// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
Page({
     
  data: {
    //打印机设备名
    name:"",
//macAddr
macAddr:"",

    top:0,
    isAdd:false,
    //打印机型号索引
    typeCount:'0',
    //打印机型号
    type:[
    
      {
        name:'TXT-8',
      },
      // {
      //   name:'好搭档',
      // }
    ],
    // //控制正向 反向打印的标记
    // flag:true,
   //打印数量
   count:'1',
    index:"",
    printList:[],
    storageList:[],
    printList:[],
    sendData64: [],
    services:[],
    serviceId:'',
    deviceId:"",
    writeId: '',
    readId: '',
    notifyId: '',
    data:{
      
    },
    params:{
      areaCodeCity:"",
      areaCodeDistrict:"",
      areaCodeSubdistrict:"",
      entName:"",  
      kssj:"",
      jssj:"",
      pageNum:1,
      pageSize:20
    },
    isShowPrint:true,
    platform:'android'
  },
  editCertificate(e){
     let index = e.detail
     let row =JSON.stringify(this.data.data.rows[index]) 

    wx.navigateTo({
      url: '/pages/editCertificate/editCertificate?row='+row,
    })
  },

  //下拉加载更多
  loadimgMore(){
      let params = this.data.params
      params.pageNum++;
      request({
        url:"cert/pageCertificateRecord.do",
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

  // controlDes(){
  //     this.setData({
  //       flag:false
  //     })
  // },
  // syncontrolDes(){
  //   this.setData({
  //     flag:true
  //   })
  // },

//添加合格证
addCertificate(){
  wx.navigateTo({
    url: '/pages/detail/detail',
  })  
},
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getList()
    var _this =this;
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == "ios") {
          _this.setData({
            platform: 'ios',
          })
        } else if (res.platform == "android") {
          _this.setData({
            platform: 'android',
          })
        }
      }
    })

  },

  blur(e){
   
    let count = e.detail.value;
    if(count==='0'||count==='') {
     
      count='1'
    }
    this.setData({
      count
    })
  },




getList(){
  wx.showLoading()
  request({
    url:"cert/pageCertificateRecord.do",
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

print(e){
  

    let index = e.detail.index;
    // this.setData({
    //   index:index
    // })
    let item =this.data.data.rows[index]
    this.setData({
      certificateRecordId:item.certificateRecordId
    })
    data.productName=item.productName
    data.unitName=item.unitName
    data.num=item.num
    data.address=item.address
    data.contactPhone=item.contactPhone
    data.issueTime=item.issueTime
    data.entName=item.entName
 //val = cpclExp.val
    this.setData({
      isShowPrint:false
    })
},

  //搜索
  research: function () {
    
    if(this.data.count==='')
    {
      this.showTip("打印数量不能少于一张!")
      return 
    }
     // data.des=this.data.flag?'POPRINT':'PRINT';
      let count = this.data.count
      if(count==='0'||count===''){
        count='1'
      }
    data.count = count;
    this.closeBluetoothAdapter();
    // var _this = this;
    //       request({
    //         url:"print/savePrintRecord.do",
    //         data:{
    //           certificateRecordId:this.data.certificateRecordId,
    //           printCount : data.count,
    //           macAddr:'WeChart',
    //           deviceName :'TXT-8',
    //         } 
    //       }).then(res=>{
    //         if(res.data.state==='Y'){
    //           data.printCode=res.data.data.printCode
    //           data.certificateCode=res.data.data.shortPrintCode
    //           val =cpclExp(data)
    //           hddVal = hddExp(data)
    //           _this.closeBluetoothAdapter();
    //         }else{
    //           wx.showToast({
    //             title: `${res.data.msg}`,
    //             icon:"none"
    //           })
    //         }
    //       })
  },


  closeBluetoothAdapter(){
    let _this = this;
    wx.closeBluetoothAdapter({
      complete: function (res) {
        _this.start();
      }
    })  
  },


start: function() {
  if (!wx.openBluetoothAdapter) {
    this.showTip("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。")
    return;
  }
  var _this = this;
  wx.openBluetoothAdapter({
    fail:err=>{
      if(err.errCode===10001)
      {
        this.showTip("请开启手机蓝牙")
      }
     },
    complete: function(res) {
      _this.getBluetoothAdapterState();
    }
  })
},
showTip(title){
wx.showToast({
  title,
  icon:"none"
})
},
getBluetoothAdapterState: function() {
  var _this = this;
  wx.getBluetoothAdapterState({
    complete: function(res) {
      if (!!res && res.available) {
        _this.startSearch();
      } else {
        _this.showTip("请开启手机蓝牙")
      }
    }
  })
},
startSearch: function() {
  var _this = this;
  //本地获取serviceId
 let id = wx.getStorageSync('id')

  if(id)
  {

        this.connectDevice(id)
        return  
  } 
  wx.showLoading({
    title: '搜索中',
    mask: true
  })
  wx.startBluetoothDevicesDiscovery({
    services: [],
    complete: function(res) {
      setTimeout(function() {
        wx.getBluetoothDevices({
          complete: function(res) {
            wx.hideLoading();
            var list = _this.filterPrint(res.devices);
            _this.setData({
              printList: list
            });
            if (list.length == 0) {
              _this.showTip('没有发现新的设备哦');
            }
            else{
              getApp().globalData.list=list
                wx.navigateTo({
                  url: '/pages/searchTeeth/searchTeeth',
                })
            }
          }
        });
        wx.stopBluetoothDevicesDiscovery({
          success: function(res) {},
        })
      }, 4000)
    }
  })
},
filterPrint: function(list) {
  var _this = this;
  let printList = [];
  let storageList = _this.data.storageList;
  for (let i = 0; i < list.length; i++) {
    let base64 = wx.arrayBufferToBase64(list[i].advertisData);
    let str = Array.prototype.map.call(new Uint8Array(list[i].advertisData), x => ('00' + x.toString(16)).slice(-2)).join('');
    if (str.length == 16) {
      let has = false;
      for (let j = 0; j < storageList.length; j++) {
        if (storageList[j].deviceId == list[i].deviceId) {
          has = true;
          break;
        }
      }
      if (!has) {
        list[i].address = str.toUpperCase()
        printList.push(list[i]);
      }
    }
  }
  return printList;
},
//连接
connectDevice: function(id) {
          

  var _this = this;
  var deviceId; 

  if(id){
    deviceId = id;
  }
  else{
    var index = this.data.index;
  var printList = _this.data.printList;
    deviceId=printList[index].deviceId;
    this.setData({
      name: printList[index].name,
      macAddr: printList[index].deviceId,
    })
    wx.setStorageSync('id', deviceId)
  }
  wx.showLoading({
    title: '连接中...',
    mask: true
  })
let name = this.data.name;
let macAddr = this.data.macAddr;
request({
  url:"print/savePrintRecord.do",
  data:{
    certificateRecordId:this.data.certificateRecordId,
    printCount : data.count,
    macAddr:macAddr,
    deviceName :name,
  } 
}).then(res=>{
  if(res.data.state==='Y'){
    data.printCode=res.data.data.printCode
    data.certificateCode=res.data.data.shortPrintCode
    val =cpclExp(data)
    hddVal = hddExp(data)
    _this.createBLEConnection(name,deviceId)
  }else{
    wx.hideLoading();
    wx.showToast({
      title: `${res.data.msg}`,
      icon:"none"
    })
  }
})

  
},

createBLEConnection(name,deviceId){
  var _this =this
  wx.createBLEConnection({
    deviceId: deviceId,
    success(res) {
      wx.hideLoading();
      _this.showTip('连接成功');
      _this.setData({
        deviceId: deviceId,
        printList: [],
        btnTitle: '断开当前连接',  
      })
      //得实
      if(/^DP/.test(name)){
        _this.getDsDeviceService(deviceId)
      }else if(  /^TXT/.test(name)||/^HDD/.test(name) ){
        //好搭档&TXT-8
        _this.getDeviceService(deviceId);
      }else{
        wx.showToast({
          title:"暂不支持该设备",
          icon:"none",
        })
        wx.removeStorageSync('id')
      }
    },
    fail(res) {
      wx.hideLoading();
    
      wx.removeStorageSync('id')
      _this.showTip('连接失败,请重新打印');
    },
  
  })
},


//DS
getDsDeviceService(deviceId){
  let self = this
    wx.getBLEDeviceServices({
      deviceId:deviceId,
      success: function(res) {
        var serviceId = DS_serviceId;
        wx.getBLEDeviceCharacteristics({
          deviceId: deviceId,
          serviceId: serviceId,
          success: function(res) {
            var characteristicId = DS_characteristicId
            let count = self.data.count;
            let random = Date.now().toString().substr(-4,3)
            // let QRCodeUrl = `https://hgzapp.jsncpaq.com/#/model?c=${data.printCode}&t=${random}`;
             QRCodeUrl = `https://jshgzapp.snzfnm.com/#/model?c=${data.printCode}&t=${random}`;
            for(let i=0; i<count;i++){
              self.textPrint([deviceId, serviceId, characteristicId])
            }
           
         
          },
          fail: function(res) {
            wx.showToast({
              title: '获取Characteristic失败，请重启蓝牙再进行连接',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            console.log('getBLEDeviceCharacteristics', res.characteristics)
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '获取Service失败，请重启蓝牙再进行连接',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        console.log('getBLEDeviceServices', res)
      }
    })
},
  /*文字*/
  textPrint: function(e) {
    //~JA(复位) ^XA~^XZ(头尾) ^CI(编码-中文26) ^LL(连续纸定义长度y) ^LH(起始位置xy) ^FO(文本位置xy) ^A(字体A~Z/0~9,旋转NRIB-0-90-180-270,字高,字宽)
    let str = "~JA^XA" + "^CI26^LL520" + "^LH50,50"
    str+=`^FO0,35^A0N,25,25^FD食用农产品名称:${data.productName}^FS`
    str+=`^FO0,65^A0N,25,25^FD数量(重量):${data.num}${data.unitName}^FS`
    str+=`^FO0,95^A0N,25,25^FD产地:${data.address}^FS`
    str+=`^FO0,125^A0N,25,25^FD联系方式:${data.contactPhone}^FS`
    str+=`^FO0,155^A0N,25,25^FD开具日期:${data.issueTime}^FS`
    str+=`^FO0,185^A0N,25,25^FD生产者:${data.entName}^FS`
    str+="^FO320,30" + "^BQ,2,4" + `^LL300^FDLA,${QRCodeUrl} code^FS`
    str+=`^FO0,215^A0N,25,25^FD合格证编号:${data.certificateCode}^FS^XZ`
    let buffer = this.textchange(str, 'text')
    for (var j = 0; j < buffer.byteLength; j += 20) {
      this.writeBle(e, buffer.slice(j, j + 20))
    }
  },
  /*编译*/
  textchange: function(e, changetype) {
    if (changetype == 'text') {
      //字符串转gb2312
      return new encoding.TextEncoder("gb2312", {
        NONSTANDARD_allowLegacyEncoding: true
      }).encode(e).buffer
    } else if (changetype == 'image') {
      //RGB数组转黑白数组
      let imageor = []
      let ints = Array.from(e)
      for (var i = 0, j = 0; i < ints.length; i = i + 4, j++) {
        imageor[j] = (ints[i] * 0.299 + ints[i + 1] * 0.587 + ints[i + 2] * 0.144) > 170 ? 0 : 1
      }
      //黑白数组转16进制数组
      let image = []
      let temp = 0
      //let WH = this.data.WH
      for (var j = 0; j < imageor.length / 8; j++) {
        image[j] = imageor[temp] + "" + imageor[temp + 1] + "" + imageor[temp + 2] + "" + imageor[temp + 3] + "" + imageor[temp + 4] + "" + imageor[temp + 5] + "" + imageor[temp + 6] + "" + imageor[temp + 7]
        temp += 8
        image[j] = bin_to_hex(image[j])
      }
      return image
    } 
    //二进制转十六进制
    function bin_to_hex(str) {
      let hex_array = [{
        key: 0,
        val: "0000"
      }, {
        key: 1,
        val: "0001"
      }, {
        key: 2,
        val: "0010"
      }, {
        key: 3,
        val: "0011"
      }, {
        key: 4,
        val: "0100"
      }, {
        key: 5,
        val: "0101"
      }, {
        key: 6,
        val: "0110"
      }, {
        key: 7,
        val: "0111"
      }, {
        key: 8,
        val: "1000"
      }, {
        key: 9,
        val: "1001"
      }, {
        key: 'a',
        val: "1010"
      }, {
        key: 'b',
        val: "1011"
      }, {
        key: 'c',
        val: "1100"
      }, {
        key: 'd',
        val: "1101"
      }, {
        key: 'e',
        val: "1110"
      }, {
        key: 'f',
        val: "1111"
      }]
      let value = ''
      let list = []
      if (str.length % 4 !== 0) {
        let a = "0000"
        let b = a.substring(0, 4 - str.length % 4)
        str = b.concat(str)
      }
      while (str.length > 4) {
        list.push(str.substring(0, 4))
        str = str.substring(4);
      }
      list.push(str)
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < hex_array.length; j++) {
          if (list[i] == hex_array[j].val) {
            value = value.concat(hex_array[j].key)
            break
          }
        }
      }
      return value
    }
  },

  /*写入*/
  writeBle: function(e, buffer) {
    wx.writeBLECharacteristicValue({
      deviceId: e[0],
      serviceId: e[1],
      characteristicId: e[2],
      value: buffer,
      success: function(res) {
        console.log('write', res.errMsg)
      },
      fail: function(res) {
        console.log('writeBLECharacteristicValue', res)
      }
    })
  },

  //获取蓝牙设备所有服务
  getDeviceService: function(deviceId) {
    var _this = this
    var deviceId = _this.data.deviceId
    var p = new Promise(function(resolve, reject) {
      wx.getBLEDeviceServices({
        deviceId: deviceId,
        success: function(res) {
          var serviceId = _this.filterService(res.services);
          if (serviceId != "") {
            _this.setData({
              serviceId: serviceId
            })
          } else {
            // _this.showTip('没有找到主服务');
            _this.closeBLEConnection(deviceId);
            reject('没有找到主服务')
          }
          resolve(serviceId)
        },
        fail: function(res) {
          console.log(res)
          // _this.showTip('搜索设备服务失败');
          _this.closeBLEConnection(deviceId);
          reject("搜索设备服务失败")
        }
      })
    }).then(function(data) {
      wx.getBLEDeviceCharacteristics({
        deviceId: deviceId,
        serviceId: data,
        success: function(res) {
          _this.filterCharacter(res.characteristics);
          let writeId = _this.data.writeId;
       
          if (writeId == '') {
            //_this.showTip('获取特征值失败');
            _this.closeBLEConnection(deviceId);
            reject("获取特征值失败")
          }
          else{
            setTimeout(()=>{
              _this.printing()
             },1000)
          }
        },
        fail: function(res) {
          //_this.showTip('获取特征值失败');
          _this.closeBLEConnection(deviceId);
          reject("获取特征值失败")
        }
      })
    }).catch(function(error) {
      _this.showTip(error);
    })
  },

  filterService: function(services, deviceId) {
    let serviceId = "";
    var _this = this;

    for (let i = 0; i < services.length; i++) {
      let serverid = services[i].uuid.toUpperCase();
      if (serverid.indexOf(services_uuid1) != -1 ||
        serverid.indexOf(services_uuid2) != -1 ||
        serverid.indexOf(services_uuid3) != -1
      ) {
        serviceId = services[i].uuid;
        break;
      }
    }
    return serviceId;
  },

  filterCharacter: function(characteristics) {
    var _this = this;

    var deviceId = _this.data.deviceId;
    var serviceId = _this.data.serviceId;

    let writeId = '';
    let readId = '';
    let notifyId = '';
    for (let i = 0; i < characteristics.length; i++) {
      let charc = characteristics[i];
      if (charc.properties.write) {
        writeId = charc.uuid;
      }
      if (charc.properties.read) {
        readId = charc.uuid;
      }
      if (charc.properties.notify) {
        notifyId = charc.uuid;
      }

      if (charc.properties.notify || charc.properties.indicate) {
        wx.notifyBLECharacteristicValueChange({
          deviceId,
          serviceId,
          characteristicId: charc.uuid,
          state: true,
        })
      }
    }
    _this.setData({
      writeId: writeId,
      readId: readId,
      notifyId: notifyId
    })

    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      var data = ab2hex(characteristic.value)
    
      //00: 打印成功
      //01:缺纸
      //02:开盖
      console.log('返回：' + data)
    })
  },

  //打印
  printing: function(res) {
   
  

    var _this = this;

    //var index = res.currentTarget.dataset.index;
    var index = this.data.typeCount;
    var deviceId = _this.data.deviceId;
    var serviceId = _this.data.serviceId;
    var writeId = _this.data.writeId;
    var readId = _this.data.readId;
    if (index != 0 && index != 1 && index != 2 && index != 6 && index != 7) {
      _this.showTip("缺少该指令模板");
      return false;
    }
    if(/^TXT/.test(_this.data.name)){
      _this.pickerData(index); //1s
      var p = new Promise(function(resolve, reject) {
        _this.writeBLECharacteristicValue(deviceId, serviceId, writeId, 1); //32s
      }).then(function(data) {
      }).catch(function(error) {
        console.log('my error:' + error)
        _this.showTip(error);
      })
    }else if(/^HDD/.test(_this.data.name)){
      var arrayBuffer = '';
      
        arrayBuffer = wx.base64ToArrayBuffer(gbToBase64.encode64(hddVal));
        let count = this.data.count
        if(count==='0'||count===''){
          count=1
        }
        count=parseInt(count);
        for(let i=0;i<count;i++){
          _this.writetoHdd(deviceId, serviceId, writeId,arrayBuffer);
        }
        // if (_this.data.platform == 'ios'){
        //   for(let i=0;i<count;i++){
        //     _this.writetoHdd(deviceId, serviceId, writeId,arrayBuffer);
        //   }
        // }else{
        //   let dataView1 = new DataView(arrayBuffer)
        //   var length = dataView1.byteLength
        //   var size = 100
        //   var package_count = Math.round(length / size + 0.5);
        //   for(let i=0;i<count;i++){
        //     _this.writeFuction(_this, arrayBuffer, package_count, size,deviceId, serviceId, writeId);
        //   }
        // }
    }
 
  },
  writeFuction(that, data, count, size,deviceId, serviceId, writeId) {
    
    let dataView_temp1 = new DataView(data);
    var packages = Math.round(dataView_temp1.byteLength / size + 0.5)
    var yushu = dataView_temp1.byteLength % size
    let buffer = null
    let dataView_temp2 = null
    if (yushu != 0 && count == 1) {
      buffer = new ArrayBuffer(yushu)
      dataView_temp2 = new DataView(buffer)
      for (var i = 0; i < dataView_temp2.byteLength; i++) {
        dataView_temp2.setUint8(i, dataView_temp1.getUint8((packages - count) * size + i))
      }
    } else {
      buffer = new ArrayBuffer(size)
      dataView_temp2 = new DataView(buffer)
      for (var i = 0; i < dataView_temp2.byteLength; i++) {
        dataView_temp2.setUint8(i, dataView_temp1.getUint8((packages - count) * size + i))
      }
    }
    wx.writeBLECharacteristicValue({
      deviceId:deviceId,
      serviceId: "49535343-FE7D-4AE5-8FA9-9FAFD205E455",
      characteristicId: "49535343-6DAA-4D02-ABF6-19569ACA69FE",
      value: buffer,
      // value: arrayBuffer,
      success: function (res) {
        if (count != 0) {
          that.writeFuction(that, data, count, size,deviceId, serviceId, writeId)
        } else {
       
        }
      },
    fail:err=>{
      console.log(err);
    },
      complete: function (res) {
        console.log(res);
      }
    })
    count--;
    return 0;

  },

  //分包
  pickerData: function(index) {
    var _this = this;
    var data = '';
    // console.log(index);
    switch (index) {
      case '0':
        data = val;
        _this.cutCommand(data);
      
       
        break;
      case '1':
        data = escExp.val;
        _this.cutEscCommand(data);
        break;
      case '2':
        data = tspl.val;
        _this.cutCommand(data);
        break;
      case '6':
        data = cpclpic.val;
        _this.cutCommand(data);
        break;
      case '7':
        data = cpclpic2.val;
        _this.cutCommand(data);
        break;
    };
  },
 
  cutCommand: function(data) {
    var _this = this;
    var sendData64 = [];

    var packageLength = 10

    if (_this.data.platform == 'ios')
      packageLength = 40  


     for (let i = 0; i < Math.ceil(data.length / packageLength); i++) {
      
    // //   //  var base64Len = ToBase64.encode64gb2312(data.substr(i * packageLength, packageLength))
    // //   //  console.log("base64Len:" + base64Len.length)
  
     sendData64[i] = wx.base64ToArrayBuffer(ToBase64.encode64gb2312(data.substr(i * packageLength, packageLength)))
    // //   // var int32View = new Int32Array(sendData64[i]); 
    // //   // console.log("arrybuffrtLen:" + int32View)
    
  }

    this.setData({
      sendData64: sendData64
    })
  },
  cutEscCommand: function(data) {
    var _this = this;
    let sendData64 = [];
    let packageLength = 3;
    if (Math.ceil(data.length % 9 == 0)) packageLength = 9;
    else if (Math.ceil(data.length % 6 == 0)) packageLength = 6;

    for (let i = 0; i < Math.ceil(data.length / packageLength); i++) {
      sendData64[i] = ToBase64.string2HexArrayBuffer(data.substr(i * packageLength, packageLength));
    }
    // console.log(sendData64);

    this.setData({
      sendData64: sendData64
    })
  },
//向低功耗蓝牙设备特征值中写入二进制数据 hdd
writetoHdd:function(deviceId, serviceId, writeId,value){
  wx.writeBLECharacteristicValue({
    deviceId:deviceId,
    // serviceId: serviceId,
    // characteristicId: writeId,
    serviceId: "49535343-FE7D-4AE5-8FA9-9FAFD205E455",
      characteristicId: "49535343-6DAA-4D02-ABF6-19569ACA69FE",
    value:value,
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log(err);
      console.log('deviceId:' + deviceId);
      console.log('serviceId:' + serviceId);
      console.log('writeId:' + writeId);
      _this.showTip('传输失败');
    }
  })
},

  //向低功耗蓝牙设备特征值中写入二进制数据 txt-8
  writeBLECharacteristicValue: function(deviceId, serviceId, writeId, times) {
   
    var _this = this;
    var sendData64 = _this.data.sendData64;
    if (sendData64.length >= times) {
      wx.writeBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: writeId,
        value: sendData64[times - 1],
        success: function(res) {
          wx.showLoading({
            title: '传输中...',
            mask: true
          });
          _this.writeBLECharacteristicValue(deviceId, serviceId, writeId, ++times);
        },
        fail: function(res) {
          console.log(res);
          console.log('deviceId:' + deviceId);
          console.log('serviceId:' + serviceId);
          console.log('writeId:' + writeId);
          _this.showTip('传输失败');
          //  _this.closeBLEConnection(deviceId);
        }
      })

    } else {

      wx.hideLoading();
      _this.showTip('传输完成');
      var readId = _this.data.readId;
      wx.readBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId: readId,
        success(res) {
          console.log('readBLECharacteristicValue:', res)
        }
      })
      //_this.closeBLEConnection(deviceId);
    }
  },
  add(){
      let count = Number(this.data.count) 
      count++
      this.setData({
        count:count.toString()
      })
  },
  cut(){
    let count = Number(this.data.count)    
    if(count<=1)return 
    count--
    this.setData({
      count:count.toString()
    })
},
// 取消打印
cancelprint(){
    this.setData({
      isShowPrint:true
    })
},

//阻止冒泡
cancelbuble(){

},
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:  function () {
     //每次进入打印页面删除打印机id，重新搜索  
     wx.removeStorageSync('id')
      if(this.data.index!=='')
      {

        this.connectDevice()
        
      }
        if(this.data.isAdd){
            let params ={
              areaCodeCity:"",
              areaCodeDistrict:"",
              areaCodeSubdistrict:"",
              entName:"",  
              kssj:"",
              jssj:"",
              pageNum:1,
              pageSize:20
            };
            
            this.setData({
              params,
              top:0,
              isAdd:false,
            })
              this.getList();
        }
    //     let data ="! 0 200 200 320 1 \n" +
    //     "T 8 0 20 80 常熟市坞坵米 \n" +
    //     "B QR 420 80 M 2 U 4 \n" +
    //     "L7A,https://jshgzapp.snzfnm.com/#/model?c=20200801320581000070100002-53&t=241 \n" +
    //     "ENDQR \n" +
    //     "FORM \n" +
    //     "POPRINT "
    // let str=""
    // let packageLength = 40;
    // for (let i = 0; i < Math.ceil(data.length / packageLength); i++) {

    //     str+=ToBase64.encode64gb2312(data.substr(i * packageLength, packageLength))+","
  
    // }
    // console.log(str)

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