<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 课程分类 -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>
      <!-- 课程封面 TODO -->

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'//引入组件

export default {
  //声明组件
   components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        subjectParentId:'',//一级分类
        subjectId:'',//二级分类id
        title: '',
        subjectId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://edu-xuge-1001.oss-cn-beijing.aliyuncs.com/2022/04/16f02d48d26e0548319ca5570caeddfd5afile.png',
        teacherList:[],
        price: 0
      },
      teacherList:[],
      subjectOneList:[],//接收一级分类
      subjectTwoList:[],//接收二级分类
      BASE_API: process.env.BASE_API ,// 接口API地址
      courseId:''//课程id

    }
  },
   watch: {
    $route(to, from) {
      //路由变化方式,每次变化，方法就会执行
      console.log("watch $route");
      // this.init();
    },
  },
  
   

  created() {
    //调用公共
   this.init()
   
  },

  methods: {

     //抽取公共
    init() {
        //获取路由中客课程id值
        if (this.$route.params && this.$route.params.id) {
            //从路径中获取值
            this.courseId = this.$route.params.id;
            //调用根据课程id查询信息
            this.getCourseInfoVo()
        }else{ //添加
          //路径中没有id值，将表单的数据清空
        
          this.getAllTeacherList()//初始化所有讲师
          this.getOneSubjectList()//初始化一级分类
        
          
        }
    },
    //根据课程id获取课程基本信息
    getCourseInfoVo(){
      course.getCourseInfo(this.courseId)
      .then(response=>{
        //获取课程的基本信息，包括一级分类和二级分类
        this.courseInfo=response.data.courseInfo
        //1.查询所有一级分类和二级分类
        subject.getSubjectList()
        .then(response=>{
          //1.为一级分类赋值
          this.subjectOneList=response.data.list
          //2.遍历一级分类，取出其一级分类id和courseInfo的subject_id进行比较
         for(var i=0;i<this.subjectOneList.length;i++){
            //1.获取每一个一级分类
            var subjectOne=this.subjectOneList[i]
            //比较取出的每一个一级分类与当前的couseInfo的subjectParentId是否相等
            if(this.courseInfo.subjectParentId==subjectOne.id){
              //2.获取一级分类中的所有二级分类
              this.subjectTwoList=subjectOne.children
            }

         }

        })
        //初始化讲师下拉列表
         this.getAllTeacherList()//初始化所有讲师
      })
    },
   


    //上传之前
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg'
      const isLt4M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isJPG && isLt4M
    },

    //上传封面成功
    handleAvatarSuccess(res,file){
      // console.log(res)// 上传响应
      // console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.url
    },
    //定义onChange改变的绑定方法
      subjectLevelOneChanged(value) {//value就是一级分类id值
      console.log(value)
      //遍历所有分类，包含一级和二级
      for (let i = 0; i < this.subjectOneList.length; i++) {
          if (this.subjectOneList[i].id === value) {//依次比较所有一级分类id和点击的一级分类id一致
              //从一级分类取出二级分类的值赋给二级分类
              this.subjectTwoList = this.subjectOneList[i].children
              //把所有的二级分类id置空
              this.courseInfo.subjectId = ''
          }
      }
    },
    //查询所有的一级分类
    getOneSubjectList(){
      subject.getSubjectList()
      .then(response=>{
        this.subjectOneList=response.data.list
      })
    },

    //查询所有的讲师
    getAllTeacherList(){
      course.getAllTeacher()
      .then(response=>{
         this.teacherList=response.data.list
      })
    },
    //添加课程
    addCourseInfo(){
     //1.添加course
      course.addCourseInfo(this.courseInfo)
      .then((response) => {
        //1.提示信息
        this.$message({
          type: "success",
          message: "添加课程信息成功",
        });
         //2.跳转到第二步
      this.$router.push({ path: '/course/chapter/'+ response.data.courseId})
      })
    },

     //修改课程基本信息
    updateCourseInfoVo(){
       course.updateCourseInfo(this.courseInfo)
       .then(response=>{
          //1.提示信息
          this.$message({
          type: "success",
          message: "修改课程信息成功",
        });
          //2.跳转到第二步
          this.$router.push({ path: '/course/chapter/'+ this.courseId})
       })
    },
    //添加课程信息或者修改课程信息
    saveOrUpdate() {
      //判断是否id值
       if(this.courseInfo.id){
          this.updateCourseInfoVo()
       }else{//修改
         this.addCourseInfo()
       }
    },
  },
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>