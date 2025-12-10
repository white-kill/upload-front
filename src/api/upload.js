import request from '@/utils/request'

// 登录方法
export function appList(params) {
  return request({
    url: '/list',
    method: 'get',
    params: params
  })
}