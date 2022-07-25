import request from '@/utils/request'
export default{
  // 查询课程分类嵌套集合
  getNestedSubjects() {
    return request({
      url: '/admin/edu/subject/getNestedSubjects',
      method: 'GET'
    })
  }

}
