<template>
  <div>
    <el-form label-width="80px" style="margin:30px;">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模板说明</el-tag>
        <el-tag type="primary">
          <i class="el-icon-download"/>
          <a :href="defaultExcelTemplate">点击下载模版</a>

        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :on-change="handleFilesChange"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-exceed="handleFilesExceed"
          :auto-upload="false"
          :action="uploadPath"
          :limit="1"
          name="file"
          class="upload-demo">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button :disabled="flag" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传基于模板文件编写的excel文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: true,
      uploadPath: 'http://localhost:8110/admin/edu/subject/import',
      defaultExcelTemplate: 'https://xa-java-220310-guli-connor.oss-cn-shanghai.aliyuncs.com/excel/2022/07/25/a1a4c92c949948ffbf7f7cf641c1e363.xls'
    }
  },
  methods: {
    // 文件选中的数量超过limit值的回调
    handleFilesExceed() {
      this.$message.warning('一次只能上传一个文件')
    },
    // 选取文件改变时回调
    handleFilesChange(file, fileList) {
      if (fileList.length !== 0) { this.flag = false }
    },
    // 上传失败时的回调
    handleUploadError(err) {
      console.log(err)
      this.$message.error('网络连接失败')
    },
    // 上传成功的回调：响应报文状态码为200时回调，R对象的code不一定为20000
    handleUploadSuccess(response, file) {
      if (response.code === 20000) {
        this.$message.success('恭喜你，导入成功')
        // 清空文件列表缓存
        this.$refs.upload.clearFiles()
      } else {
        this.$message.error(response.message)
      }
    },
    // 手动上传组件 提交按钮单击事件，点击后此函数触发文件上传
    submitUpload() {
      this.flag = true // 禁用按钮防止表单重复提交
      // 在vue中 初始化时会自动将页面中有ref属性值的标签 存到 vue的$refs集合中，可以通过this.$refs.ref属性值获取该标签对象
      this.$refs.upload.submit()
    }
  }
}
</script>
