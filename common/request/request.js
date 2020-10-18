const baseUrl = 'https://jshgz.snzfnm.com/jscertificate/webapp/'
function request(config){
  config.header= config.header? config.header:{}
  // if(!config.login)
  // {
  //     let value = wx.getStorageSync('valite')
  //    if(value.token)
  //    {
  //    config.header['X-Token'] = value.token;
  //    }
  // }
  let value = wx.getStorageSync('valite')
  if(value.token)
  {
    if(!config.header['X-Token']){
      config.header['X-Token'] = value.token;
    }
  
  }
  config.url=baseUrl+ config.url
  return new Promise((resolve,reject)=>{
    wx.request({
      timeout:8000,
      ...config,
      success:res=>{  
        resolve(res)
      },
      fail:err=>{
        reject(err)
      }
    })
  })
}
export {request}
  