import request from '@/utils/request'

export default{

  //1.根据课程id获取章节和小结
  getAllChapterVo(courseId){
     return request({
      url:`/eduservice/chapter/getChapterVo/${courseId}`,
      method:'get'

     })
  },
  //2.添加章节
  addChapter(chapter){
    return request({
      url:`/eduservice/chapter/addChapter`,
      method:'post',
      data:chapter
    })
  },
  //3.修改章节
  updateChapter(chapter){
    return request({
      url:`/eduservice/chapter/updateChapter`,
      method:'post',
      data:chapter
    })
  },
  //4.根据id查询章节
  getChapterVById(id){
    return request({
      url:`/eduservice/chapter/getChapter/${id}`,
      method:'get'
    })
  },
  //5.根据id删除章节诶
  deleteChapterById(id){
    return request({
      url:`/eduservice/chapter/deleteChapter/${id}`,
      method:'delete'
    })
  }




}