import request from '@/utils/request'

export default{

 
  //1.添加章节
  addVideoInfo(video){
    return request({
      url:`/eduservice/video/addVideo`,
      method:'post',
      data: video
    })
  },
  //2.修改章节
  updateVideoInfo(video){
    return request({
      url:`/eduservice/video/updateVideo`,
      method:'post',
      data:video
   
    })
  },
  //3.根据id查询章节
  getVideoById(id){
    return request({
      url:`/eduservice/video/getVideo/${id}`,
      method:'get'
    })
  },
  //4.根据id删除章节诶
  deleteVideoById(id){
    return request({
      url:`/eduservice/video/deleteVideo/${id}`,
      method:'delete'
    })
  },
  deleteVideo(id){
    return request({
      url:`/eduvod/video/deleteVideo/${id}`,
      method:'delete'
    })
  }




}