import request from '@/utils/request'

export default{
  //1.条件查询带分页
  //1.current:当前页 //2.limit 每页条数  //3.带条件对象
  getTeacherListPage(current,limit,teacherQuery){
     return request({
       //1.第一中url 拼接
      // url:'/table/list/'+current+'/'+limit,
      //2.第二中 url ` `
      url:`/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
      method:'post',
      
      //teacherQuery条件对象 ，后端使用requestBody获取数据
      //data表示把对象转为json数据传递到接口
      data: teacherQuery

     })
  },
  //2.删除方法定义
  delTeacherById(id){
    return request({
       url:`/eduservice/teacher/${id}`,
       method:'delete'

    })
  },
  //3.添加讲师方法定义
  addTeacher(teacher){
    return request({
       url:`/eduservice/teacher/save`,
       method:'post',
       data:teacher

    })
  },
  //4.根据id查询teacher
  getTeacherById(id){
    return request({
       url:`/eduservice/teacher/getTeacher/${id}`,
       method:'get'

    })
  },
  //5.修改讲师
  updateTeacher(teacher){
    return request({
        url:`/eduservice/teacher/updateTeacher`,
        method:'post',
        data:teacher
 
    })
  },
  //6.查询所有讲师列表
  getTeacherlist(){
    return request({
      url:`/eduservice/teacher/findAll`,
      method:'get'
    })
  }
  

}