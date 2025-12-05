<template>
  <div class="app-container">
    <!-- 客户信息 table -->
    <el-table 
    :data="customerInfo" 
    border
    >
     <el-table-column label="会员账号" align="center" prop="id" width="80"/>
        <el-table-column label="持卡人姓名" align="center" prop="userName" width="120"/>
        <el-table-column label="卡号" align="center" prop="cardNumber" width="120"/>
        <el-table-column label="城市" align="center" prop="city" width="80"/>
        <el-table-column label="付费状态" align="center" prop="payType" width="120"/>
        <el-table-column label="失效时间" align="center" prop="failureTime" width="80"/>
        <!--<el-table-column label="交易网点" align="center" prop="tradeLocation" />-->
    </el-table>

    <div style="height: 10px;"></div>

    <!-- 客户账单 table -->
    <el-table :data="billList" border>
      <el-table-column prop="billId" label="账单ID" width="120" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="date" label="日期" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted,defineProps } from "vue";
import { listBankUserBillDetail, getBankUserBillDetail, delBankUserBillDetail, getUserDetail,
addBankUserBillDetail, updateBankUserBillDetail, uploadExcel  
} from "@/api/bankUserBillDetail/bankUserBillDetail"

const props = defineProps({
  // 定义 id 的类型和默认值（根据实际需求调整）
  id: {
    type: [Number, String], // 允许数字或字符串类型的ID
    required: true, // 如果必须传递，设为true；可选则去掉
    // default: 0 // 可选：设置默认值（当 required 为 false 时）
  }
});

// 在脚本中使用时，通过 props.props.id 获取
console.log('接收的ID：', props.id);

const customerInfo = ref({});
const billList = ref([]);

if (props.id) {
  getBankUserBillDetail(props.id).then(response => {
    customerInfo.value = response.rows
  })
  getUserDetail(props.id).then(response => {
    billList.value = response.rows
  })
}

</script>