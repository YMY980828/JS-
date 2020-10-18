module.exports=data=>{
  let startX = 20;  
  let startY = 120;    
  let step = 30;
  let random = Date.now().toString().substr(-4,3)
  // let QRCodeUrl = `https://hgzapp.jsncpaq.com/#/model?c=${data.printCode}&t=${random}`;
  let QRCodeUrl = `https://jshgzapp.snzfnm.com/#/model?c=${data.printCode}&t=${random}`;
  let productName=data.productName
  let unitName=data.unitName
  let num=data.num
  let address=data.address
  let contactPhone=data.contactPhone
  let issueTime=data.issueTime
  let entName=data.entName
  let certificateCode=data.certificateCode
  let count = data.count
  let des = data.des
   return `! 0 200 200 320 1 \r\n` +
   "AUTOPACE\r\n"+
   "T 8 0 " + startX + " " + startY + ` 食用农产品名称：${productName} \r\n` +
   "T 8 0 " + startX + " " + (startY += step) + ` 数量(重量)：${num}${unitName} \r\n` +
   "T 8 0 " + startX + " " + (startY += step) + ` 产地：${address} \r\n` +
   "T 8 0 " + startX + " " + (startY += step) + ` 联系方式：${contactPhone} \r\n` +
   "T 8 0 " + startX + " " + (startY += step) + ` 开具日期：${issueTime} \r\n` +
   "T 8 0 " + startX + " " + (startY += step) + ` 生产者：${entName} \r\n` +
   "T 8 0 " + startX + " " + (startY += step) + ` 合格证编号：${certificateCode} \r\n` +
   "B QR 420 150 M 2 U 4 \r\n" +
   "L7A," + QRCodeUrl + " \r\n" +
   "ENDQR \r\n" +
  //  "GAP-SENSE \r\n"+
  // "FORM \r\n"+
   `POPRINT \r\n`;
 
}

