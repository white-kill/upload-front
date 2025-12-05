import request from '@/utils/request'

// 查询客户账单详情列表
export function listBankUserBillDetail(query) {
    return request({
      url: '/bankUserBillDetail/bankUserBillDetail/list',
      method: 'get',
      params: query
    })
  }