import request from '@/utils/request'

// 提交验证：/PABankUserInfo/checkCardNumber
// 后端约定：@RequestParam("cardNumber") String cardNumber
// 这里使用 POST + query 参数（也兼容 @RequestParam 绑定）。
// 如需改为表单 x-www-form-urlencoded，请告知我切换为 data + transformRequest。
export function checkCardNumber(params) {
  return request({
    url: '/PABankUserInfo/checkCardNumber',
    method: 'get',
    params
  })
}
