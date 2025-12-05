import request from '@/utils/request'

// 查询业务客户管理列表
export function listBankUserInfo(query) {
  return request({
    url: '/bankUserInfo/bankUserInfo/list',
    method: 'get',
    params: query
  })
}

// 查询业务客户管理详细
export function getBankUserInfo(id) {
  return request({
    url: '/bankUserInfo/bankUserInfo/' + id,
    method: 'get'
  })
}

// 新增业务客户管理
export function addBankUserInfo(data) {
  return request({
    url: '/bankUserInfo/bankUserInfo',
    method: 'post',
    data: data
  })
}

// 修改业务客户管理
export function updateBankUserInfo(data) {
  return request({
    url: '/bankUserInfo/bankUserInfo',
    method: 'put',
    data: data
  })
}

// 删除业务客户管理
export function delBankUserInfo(id) {
  return request({
    url: '/bankUserInfo/bankUserInfo/' + id,
    method: 'delete'
  })
}
