import request from '@/utils/request'

export default{
  //1.课程分类列表
  getSubjectList(){
     return request({
       //1.第一中url 拼接
      // url:'/table/list/'+current+'/'+limit,
      //2.第二中 url ` `
      url:`/eduservice/subject/getAllSubject`,
      method:'get'

     })
  }



}