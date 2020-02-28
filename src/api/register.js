import request from '@/utils/request.js'


//注册
export function regist(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/user/register',
    method: 'post',
    data:'username='+username+'&password='+password
  })
}