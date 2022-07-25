import request from '@/utils/request'

export default{
  getTeachers() {
    return request({
      url: '/admin/edu/teacher/queryAll',
      method: 'GET'
    })
  },
  getPage(pageNum, pageSize, searchObj) {
    return request({
      url: `/admin/edu/teacher/queryPage/${pageNum}/${pageSize}`,
      method: 'GET',
      params: searchObj
    })
  },
  deleteTeacher(id) {
    return request({
      url: `/admin/edu/teacher/remove/${id}`,
      method: 'DELETE'
    })
  },
  batchRemove(idList) {
    return request({
      url: '/admin/edu/teacher/removeBatch',
      method: 'delete',
      data: idList
    })
  },
  getById(id) {
    return request({
      url: `admin/edu/teacher/getById/${id}`,
      method: 'GET'
    })
  },
  updateTeacher(teacher) {
    return request({
      url: '/admin/edu/teacher/update',
      method: 'PUT',
      data: teacher
    })
  },
  saveTeacher(teacher) {
    return request({
      url: '/admin/edu/teacher/save',
      method: 'POST',
      data: teacher
    })
  }
}
