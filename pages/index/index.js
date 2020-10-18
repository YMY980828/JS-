Page({ 
  data: {
                                                                
  },
  onLoad: function (options) {
    setTimeout(()=>{
   wx.reLaunch({
        url: '/pages/home/home', 
      })
    },60/1000)
    // let value = wx.getStorageSync('valite') || {};
    // if(!value.token) {
      
    //     wx.reLaunch({
    //       url: '/pages/login/login',
    //     })
    //  }
    //  else{
    //   wx.reLaunch({
    //     url: '/pages/home/home',
    //   })
    //  }
  },
 })