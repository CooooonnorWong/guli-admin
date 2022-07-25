<template>
  <div>
    <div style="margin-left:20px;margin-top:20px;margin-bottom:-10px">
      <el-form :inline="true" :model="teacher" label-position="left" class="demo-form-inline">
        <el-form-item label="讲师姓名">
          <el-input v-model="teacher.name" placeholder="讲师姓名"/>
        </el-form-item><br>
        <el-form-item label="讲师简介">
          <el-input
            v-model="teacher.intro"
            autosize
            type="textarea"
            placeholder="请输入简介"
            style="width:700px"/>
        </el-form-item><br>
        <el-form-item label="讲师资历">
          <el-input
            v-model="teacher.career"
            autosize
            type="textarea"
            placeholder="请输入资历"
            style="width:700px"/>
        </el-form-item><br>
        <el-form-item label="讲师头衔">
          <el-select v-model="teacher.level" placeholder="请选择">
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
          </el-select>
        </el-form-item><br>
        <el-form-item label="讲师排序">
          <el-input-number
            v-model="teacher.sort"
            :min="1"
            :max="10"
            controls-position="right"
            label="排序"
            @change="handleChange"/>
        </el-form-item><br>
        <el-form-item label="入职时间">
          <el-date-picker
            v-model="teacher.joinDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"/>
        </el-form-item><br>
        <el-form-item label="讲师头像">
          <el-upload
            :action="uploadPath"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError"
            class="upload-demo"
            drag>
            <i class="el-icon-upload"/>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item><br>
        <el-form-item>
          <el-button type="primary" @click="saveOrUpdate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
export default{
  data() {
    return {
      num: 1,
      teacher: {},
      uploadPath: 'http://localhost:8120/admin/oss/upload?module=avatar',
      squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    }
  },
  created() {
    if (this.$route.params.id) {
      teacherApi.getById(this.$route.params.id).then(r => {
        console.log(r)
        this.teacher = r.data.item
      })
    }
  },
  methods: {
    examine() {
      return this.teacher.name === null || this.teacher.intro === null || this.teacher.career == null || this.teacher.level == null || this.teacher.sort == null || this.teacher.joinDate === null
    },
    saveOrUpdate() {
      if (this.teacher.id) {
        this.updateTeacher()
      } else {
        this.saveTeacher()
      }
    },
    updateTeacher() {
      if (this.examine()) {
        event.preventDefault()
        this.$message.warning('请输入讲师信息!')
      } else {
        teacherApi.updateTeacher(this.teacher).then(r => {
          this.$message.success('添加成功!')
          this.$router.push('/teacher/list')
        }).catch(() => {
          this.$message.error('添加失败!')
        })
      }
    },
    saveTeacher() {
      if (this.examine()) {
        event.preventDefault()
        this.$message.warning('请输入讲师信息!')
      } else {
        teacherApi.saveTeacher(this.teacher).then(r => {
          this.teacher = {}
          this.$message.success('添加成功!')
          this.$router.push('/teacher/list')
        }).catch(() => {
          this.$message.error('添加失败!')
        })
      }
    },
    handleChange(value) {
      console.log(value)
    },
    // 上传组件的回调函数
    handleAvatarError(err) { // 响应报文状态码不是200
      console.log(err)
      this.$message.error('网络连接失败')
    },
    handleAvatarSuccess(res, file) { // 响应报文状态码为200
      if (res.code === 20000) {
        this.$message.success('上传成功')
        // console.log(res)
        // 获取上传成功的图片地址 回显
        this.teacher.avatar = res.data.path
        // 强制渲染：修改的是对象的属性  vue可能观察不到
        this.$forceUpdate()
      } else {
        this.$message.error(res.message)
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
