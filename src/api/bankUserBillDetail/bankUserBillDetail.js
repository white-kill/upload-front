import request from '@/utils/request'

// 查询客户账单详情列表
export function listBankUserBillDetail(query) {
  return request({
    url: '/PABankUserInfo/list',
    method: 'get',
    params: query
  })
}

// 查询客户账单详情详细
export function getBankUserBillDetail(id) {
  return request({
    url: '/bankUserBillDetail/bankUserBillDetail/' + id,
    method: 'get'
  })
}

// 查询客户账单详情详细
export function getUserDetail(id) {
  return request({
    url: '/PABankUserInfo/' + id,
    method: 'get'
  })
}

// 查询客户账单详情详细
export function getbillList(query) {
  return request({
    url: '/PABankUserInfo/billList/',
    method: 'get',
    params: query
  })
}

// 新增客户账单详情
export function addBankUserBillDetail(data) {
  return request({
    url: '/bankUserBillDetail/bankUserBillDetail',
    method: 'post',
    data: data
  })
}

// 修改客户账单详情
export function updateBankUserBillDetail(data) {
  return request({
    url: '/PABankUserInfo/edit',
    method: 'put',
    data: data
  })
}

// 二维码用户扫描验证
export function checkCardNumber(data) {
  return request({
    url: '/PABankUserInfo/checkCardNumber',
    method: 'get',
    params: data
  })
}

// 删除客户账单详情
export function delBankUserBillDetail(id) {
  return request({
    url: '/bankUserBillDetail/bankUserBillDetail/' + id,
    method: 'delete'
  })
}

// 重置失效时间
export function handleFailueTime(id) {
  return request({
    url: '/PABankUserInfo/handleFailueTime',
    method: 'post',
    data: id
  })
}

// 配置流水
export function handleSerialFlag(id, type) {
  return request({
    url: '/PABankUserInfo/handleSerialFlag',
    method: 'post',
    data: {
      userId: id,
      type: type
    }
  })
}

// 删除APP导出记录
export function handleDeleteAppRecord(id, type) {
  return request({
    url: '/PABankUserInfo/handleDeleteAppRecord',
    method: 'post',
    data: {
      userId: id,
      type: type
    }
  })
}

// 上传Excel文件
export function uploadExcel(file) {
  const formData = new FormData()
  formData.append('file', file) 

  return request({
    //url: '/bankUserBillDetail/importExcel',
    method: 'post',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    headers: { Authorization: "Bearer " + getToken() },
    data: formData
  })
}

//发送邮件
export function sendEmail(data) {
  return request({
    url: '/PABankUserInfo/sendEmail',
    method: 'post',
    data: data
  })
}

export function downloadJson(url, data, filename) {
  return request({
    url: url,
    method: 'post',
    data: data, // 用 data 而不是 params
    responseType: 'blob'
  }).then((res) => {
    const blob = new Blob([res], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(link.href)
  })
}

// 下载Excel模板
export function downloadExcelTemplate() {
  return request({
    url: '/PABankUserInfo/downloadTemplate',
    method: 'get',
    responseType: 'blob'
  }).then((res) => {
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `导入模板.xlsx`
    link.click()
    window.URL.revokeObjectURL(link.href)
  })
}
