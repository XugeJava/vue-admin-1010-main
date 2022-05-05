<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterListVo" :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
            <el-button
              style=""
              type="text"
              @click="openVideo(chapter.id)"
              >添加小节</el-button
            >
            <el-button
              style=""
              type="text"
              @click="openEditChapterDialog(chapter.id)"
              >编辑</el-button
            >
            <el-button style="" type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideoDialog(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="remoteVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
        >下一步</el-button
      >
    </div>

    <!-- <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form> -->

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
            <el-form-item label="上传视频">
        <el-upload
              :on-success="handleVodUploadSuccess"
              :on-remove="handleVodRemove"
              :before-remove="beforeVodRemove"
              :on-exceed="handleUploadExceed"
              :file-list="fileList"
              :action="BASE_API+'/eduvod/video/uploadAly'"
              :limit="1"
              class="upload-demo">
        <el-button size="small" type="primary">上传视频</el-button>
        <el-tooltip placement="right-end">
            <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
            <i class="el-icon-question"/>
        </el-tooltip>
        </el-upload>
    </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false,

      chapterListVo: [], // 章节小结对象
      courseId: "", //courseId
      dialogChapterFormVisible: false, //章节默认false
      chapter: {
        // 章节对象
        title: "",
        sort: 0,
      },
      dialogVideoFormVisible: false, //小节默认弹框false
      video: {
        // 课时对象
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: "",
        chapterId: "",
        courseId: "",
        videoOriginalName:""
      },
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    };
  },

  created() {
    //获取路由的courseId的值
    //页面渲染之前执行,路径中有id值
    if (this.$route.params && this.$route.params.id) {
      //从路径中获取值
      this.courseId = this.$route.params.id;
      //初始化章节小结列表
      this.getChapterAndVoByCourseId();
    }
  },

  methods: {
    //点击x调用
    beforeVodRemove(file,fileList){
       return this.$confirm(`确定删除${file.name}?`)
    },
    //点击确定调用
    handleVodRemove(){
      //调用接口删除video
      video.deleteVideo(this.video.videoSourceId)
      .then(response=>{
         this.$message({
          type: "success",
          message: "删除视频信息成功",
        });
        //把文件列表清空
        this.fileList=[]

      //上传id
      this.video.videoSourceId =''
      //赋值上传名称
      this.video.videoOriginalName=''
      })
    },


    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      //上传id
      this.video.videoSourceId = response.data.vodId
      //赋值上传名称
      this.video.videoOriginalName=file.name
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    ///=================小结操作==================//
    //开启添加小节弹框
    openVideo(id) {
      //1.将video数据置空
      this.video={},
      //将上传视频列表置空
      this.fileList=[]
      console.log("method is called");
      //2.弹框
      this.dialogVideoFormVisible = true;
      //3.设置课程id
      this.video.courseId = this.courseId;
      //4.设置章节id
      this.video.chapterId = id
    
    },
    //开启编辑小节弹框
    openEditVideoDialog(id) {
      //1.弹框
      this.dialogVideoFormVisible = true;
      //2.数据回显
      video.getVideoById(id).then((response) => {
        this.video = response.data.eduVideo;
        this.fileList=[response.data.eduVideo.videoOriginalName]
      });
      console.log(this.fileList)
    },
    //添加小节操作
    addVideo() {
      video.addVideoInfo(this.video).then((response) => {
        //1.关闭弹框
        this.dialogVideoFormVisible = false;
        //2.提示信息
        this.$message({
          type: "success",
          message: "添加小节信息成功",
        });
        //3.刷新页面--重新调用一次获取所有章节小结
        this.getChapterAndVoByCourseId();
      });
    },
    saveOrUpdateVideo() {
      if (this.video.id) {
        this.updateVideo();
      } else {
        this.addVideo();
      }
    },

    //修改小节操作
    updateVideo() {
      video.updateVideoInfo(this.video).then((response) => {
        //1.关闭弹框
        this.dialogVideoFormVisible = false;
        //2.提示信息
        this.$message({
          type: "success",
          message: "修改小节信息成功",
        });
        //3.刷新页面--重新调用一次获取所有章节小结
        this.getChapterAndVoByCourseId();
      });
    },

    //删除小节操作
    remoteVideo(id) {
      this.$confirm("此操作将永久删除小节记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return video.deleteVideoById(id);
        })
        .then(() => {
          this.getChapterAndVoByCourseId(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "error",
              message: response.message,
            });
          }
        });
    },

    //============章节操作=================//
    removeChapter(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return chapter.deleteChapterById(id);
        })
        .then(() => {
          this.getChapterAndVoByCourseId(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "error",
              message: response.message,
            });
          }
        });
    },
    //开启编辑章节框==数据回显
    openEditChapterDialog(id) {
      //1.弹框
      this.dialogChapterFormVisible = true;
      //2.数据回显
      chapter.getChapterVById(id).then((response) => {
        this.chapter = response.data.eduChapter;
      });
    },
    //弹框方法
    openChapterDialog() {
      //弹框
      this.dialogChapterFormVisible = true;
      this.chapter.title = "";
      this.chapter.sort = 0;
    },
    updateChapter() {
      chapter.updateChapter(this.chapter).then((response) => {
        //1.关闭弹框
        this.dialogChapterFormVisible = false;
        //2.提示信息
        this.$message({
          type: "success",
          message: "修改章节信息成功",
        });
        //3.刷新页面--重新调用一次获取所有章节小结
        this.getChapterAndVoByCourseId();
      });
    },
    addChapter() {
      //设置courseId到chapter中去
      this.chapter.courseId = this.courseId;
      chapter.addChapter(this.chapter).then((response) => {
        //1.关闭弹框
        this.dialogChapterFormVisible = false;
        //2.提示信息
        this.$message({
          type: "success",
          message: "添加章节信息成功",
        });
        //3.刷新页面--重新调用一次获取所有章节小结
        this.getChapterAndVoByCourseId();
      });
    },
    //绑定的函数
    saveOrUpdate() {
      if (this.chapter.id) {
        this.updateChapter();
      } else {
        this.addChapter();
      }
    },
    //1.根据courseId查询章节和小结
    getChapterAndVoByCourseId() {
      chapter.getAllChapterVo(this.courseId).then((response) => {
        this.chapterListVo = response.data.allChapterVo;
      });
    },
    previous() {
      //跳转到第一步
      this.$router.push({ path: "/course/edit/" + this.courseId });
    },

    next() {
      //跳转到第三步
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },
  },
};
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>