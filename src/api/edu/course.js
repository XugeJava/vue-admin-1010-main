import request from '@/utils/request'

export default{
  //1.添加课程信息
  addCourseInfo(courseInfo){
     return request({
       //1.第一中url 拼接
      // url:'/table/list/'+current+'/'+limit,
      //2.第二中 url ` `
      url:`/eduservice/course/addCourse`,
      method:'post',
      data:courseInfo

     })
  },
  //2.查询所有讲师用于显示
  getAllTeacher(){
     return request({
      url:`/eduservice/teacher/findAll`,
      method:'get'

     })
  },
  //3.根据课程id查询课程基本信息
  getCourseInfo(courseId){
     return request({
      url:`/eduservice/course/getCourseInfo/${courseId}`,
      method:'get'

     })
  },
  //4.修改课程信息
  updateCourseInfo(courseInfo){
     return request({
      url:`/eduservice/course/updateCourseInfo`,
      method:'post',
      data: courseInfo
     })
  },
  //5根据课程id获取全部发布信息
  getPublishVo(courseId){
     return request({
      url:`/eduservice/course/getCoursePublish/${courseId}`,
      method:'get'
     })
  },
  //6.课程最终发布
  publishCourse(courseId){
     return request({
      url:`/eduservice/course/publishCourse/${courseId}`,
      method:'post'
     })
  },
  //7.查询所有的课程
  getAllCourse(current,limit,courseQuery){
     return request({
      url:`/eduservice/course/getCoursePageVo/${current}/${limit}`,
      method:'post',
      data:courseQuery
     })
  },
  //8.删除课程信息
  deleteCourse(id){
     return request({
        url:`eduservice/course/deleteCourse/${id}`,
        method:'delete'
     })
  }




}