<template>
  <div>
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"/>
    <el-tree
      ref="tree"
      :data="data"
      :filter-node-method="filterNode"
      :default-expand-all="true"
      :props="defaultProps"
    />

  </div>
</template>
<script>
import subjectApi from '@/api/subject'
export default {
  data() {
    return {
      filterText: '', // 收集用户输入过滤字符串的属性
      data: [
        {
          title: '后端开发',
          id: '1551460654199439361',
          parentId: '0',
          children: [
            {
              title: 'Java',
              id: '1551460654220410881',
              parentId: '1551460654199439361'
            },
            {
              title: 'Python',
              id: '1551460654266548226',
              parentId: '1551460654199439361'
            }
          ]
        },
        {
          title: '前端开发',
          id: '1551460654291714049',
          parentId: '0',
          children: [
            {
              title: 'HTML/CSS',
              id: '1551460654308491265',
              parentId: '1551460654291714049'
            },
            {
              title: 'JavaScript',
              id: '1551460654337851394',
              parentId: '1551460654291714049'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children', // 表示节点的子节点属性
        label: 'title' // 表示节点的标题属性
      }
    }
  },
  watch: {
    filterText(val) { // 监听filterText属性值的改变，改变时此函数会被回调
      this.$refs.tree.filter(val)// 调用el-tree的filter过滤节点的方法(filter-node-method) 同时传入最新的filterText的值
    }
  },
  created() {
    this.getNestedSubjects()
  },
  methods: {
    // 参数1：表示用户输入的文本  参数2：每个el-tree的节点数据对象
    filterNode(value, data) { // el-tree过滤节点的方法
      if (!value) return true // 如果value值为空 返回true  表示节点保留
      // 如果title中包含查找的value字符串  保留当前节点
      return data.title.toUpperCase().indexOf(value.toUpperCase()) !== -1 // 获取数据的title属性  从title中查找value值的索引，查找到返回>=0的值，找不到返回-1
    },
    getNestedSubjects() {
      subjectApi.getNestedSubjects().then(r => {
        this.data = r.data.items
      })
    }
  }
}
</script>
