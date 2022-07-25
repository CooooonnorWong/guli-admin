<template>
  <div>
    <div style="margin-left:20px;margin-top:20px;margin-bottom:-10px">
      <el-form :inline="true" :model="searchObj" class="demo-form-inline">
        <el-form-item label="讲师">
          <el-input v-model="searchObj.name" placeholder="讲师姓名"/>
        </el-form-item>
        <el-form-item label="头衔">
          <el-select v-model="searchObj.level" placeholder="请选择">
            <el-option label="高级讲师" value="1"/>
            <el-option label="首席讲师" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            v-model="searchObj.joinDateBegin"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"/>
          -
          <el-date-picker
            v-model="searchObj.joinDateEnd"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">查询</el-button>
          <el-button type="info" @click="handlerClear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="teachers"
      :border="true"
      style="width: 100%;padding-left: 30px;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"/>
      <el-table-column
        type="index"
        label="序号"
        width="50"/>
      <el-table-column
        prop="avatar"
        label="头像"
        width="100">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar?scope.row.avatar:'https://xa-java-220310-guli-connor.oss-cn-shanghai.aliyuncs.com/avatar/2022/07/22/329ae2d2b483412cb88c219e56f2da1b.jpg'"
            alt=""
            style="width:60px;height:60px;">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="100"/>
      <el-table-column
        prop="level"
        label="头衔"
        width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.level===1?'success':'warning'">
            {{ scope.row.level===1?'高级讲师':'首席讲师' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="intro"
        label="资历"/>
      <el-table-column
        prop="sort"
        label="排序"
        width="80"/>
      <el-table-column
        prop="joinDate"
        label="入职时间"
        width="200"/>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
            <!-- <template slot-scope="scope">
              <el-drawer
                ref="drawer"
                :before-close="handleClose"
                :visible.sync="dialog"
                title="我嵌套了 Form !"
                direction="ltr"
                custom-class="demo-drawer"
              >
                <div class="demo-drawer__content">
                  <el-form :model="form"/>
                  <div class="demo-drawer__footer">
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button :loading="loading" type="primary" @click="$refs.drawer.closeDrawer()">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                  </div>
                </div>
              </el-drawer>
            </template> -->
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 工具按钮 -->
    <div style="margin-top: 20px;margin-left: 20px;">
      <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>
    <div style="text-align:center;margin-top:30px">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[5,10,15,20]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
export default{
  data() {
    return {
      teachers: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      searchObj: {},
      multipleSelection: []
    }
  },
  created() {
    // this.getTeachers()
    this.getPage()
  },
  methods: {
    handlerQuery() {
      this.getPage()
    },
    handlerClear() {
      this.searchObj = {}
      this.getPage()
    },
    // getTeachers() {
    //   teacherApi.getTeachers().then(r => {
    //     console.log(r)
    //     this.teachers = r.data.items
    //   })
    // },
    getPage() {
      teacherApi.getPage(this.pageNum, this.pageSize, this.searchObj).then(r => {
        console.log(r)
        this.teachers = r.data.page.records
        this.total = r.data.page.total
      })
    },

    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.pageSize = size
      this.getPage()
    },
    handleCurrentChange(num) {
      console.log(`当前页: ${num}`)
      this.pageNum = num
      this.getPage()
    },
    handleEdit(index, row) {
      console.log(row)
      this.$router.push(`/teacher/edit/${row.id}`)
    //   teacherApi.updateTeacher(row).then(r => {
    //     this.getPage()
    //   })
    },
    handleDelete(index, row) {
      this.$confirm(`此操作将永久删除讲师 ${row.name}, 是否继续?`, '提示', {// 弹出确认框
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认按钮点击后的回调事件
        teacherApi.deleteTeacher(row.id).then(r => {
          this.$message.success(`删除讲师 ${row.name} 成功`)
          // 删除成功后刷新页面的数据
          this.getPage()
        })
      }).catch(() => { // 取消按钮点击后的回调
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(selection) {
      console.log(selection)
      this.multipleSelection = selection
    },
    batchRemove() {
      console.log(this.multipleSelection)
      const idList = []
      // 批量删除
      if (!this.multipleSelection || this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历multipleSelection，将id取出放入id列表
        this.multipleSelection.forEach(element => {
          idList.push(element.id)
        })
        console.log(idList)
        teacherApi.batchRemove(idList).then(r => {
          this.getPage()
        }).catch(error => {
          if (error === 'cancel') {
            this.$message.info('取消删除')
          }
        })
      }
      )
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch(_ => {})
    },
    cancelForm() {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    }
  }
}

</script>
