import request from '@/utils/request'

export default {
   //1.生成统计数据
   createStatis(day){
      return request({
         url:`/staservice/stadaily/createStatis/${day}`,
         method:'post'
      })
   },
   //2.获取统计数据显示
   getStaData(searchObj){
      return request({
         url:`/staservice/stadaily/showData/${searchObj.type}/${searchObj.start}/${searchObj.end}`,
         method:'get'
      })
   }
  
}