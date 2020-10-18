// components/certificateCard/certificateCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
 
  
  methods: {
    watchCard(e){
     
        let code= e.currentTarget.dataset.info.printCode;
        wx.navigateTo({
          url: '/pages/watchCard/watchCard?code='+code,
        })
    }
  }
})
