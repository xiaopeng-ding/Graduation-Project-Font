import request from '@/utils/request.js'


//登录功能
export function login(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/public/login',
    method: 'post',
    data:'username='+username+'&password='+password
  })
}
// 登录 退出 功能
export function logout() {
  return request({
    url: '/sys/user/logout',
    method: 'get',
  })
}
