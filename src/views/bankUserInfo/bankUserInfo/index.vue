<template>
  <div class="app-container">
    <div class="container-left">
      <!-- 客户信息 table -->
      <el-table
        :data="[customerInfo]"
        size="small"
        :show-overflow-tooltip="true"
      >
        <!--<el-table-column label="账单编号" align="center" prop="id" />-->
        <el-table-column label="会员账号" align="center" prop="id" />
        <el-table-column label="持卡人姓名" align="center" prop="userName" />
        <el-table-column label="银行名称" align="center" prop="cardNumber" />
        <el-table-column label="卡号" align="center" prop="cardNumber" />
        <el-table-column
          align="center"
          prop="createTime"
          label="制作流水时间"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="制作创建时间"
        />
        <el-table-column label="APP账号" align="center" prop="phonenumber" />
        <el-table-column label="APP密码" align="center" prop="password" />
        <el-table-column label="城市" align="center" prop="city" />
        <el-table-column label="付费状态" align="center">
              <template #default="scope">
                {{
                   scope.row.serialFlag == 1 ? "低" : scope.row.serialFlag == 2 ? "高" : ""
                }}
              </template>
            </el-table-column>
        <el-table-column label="失效时间" align="center" prop="failureTime" />
        <!--<el-table-column label="交易网点" align="center" prop="tradeLocation" />-->
      </el-table>

      <div class="bill-info">
        <div class="bill-info-title">会员账单列表</div>
        <el-form
          :model="queryParams"
          ref="queryRef"
          size="small"
          v-show="showSearch"
          class="search-card"
        >
          <el-form-item label="商户及名称" prop="appTitle">
            <el-input
              v-model="queryParams.appTitle"
              clearable
              @keyup.enter="handleQuery"
              placeholder="请输入商户及名称"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="对方账户" prop="oppositeAccount">
            <el-input
              v-model="queryParams.oppositeAccount"
              clearable
              @keyup.enter="handleQuery"
              placeholder="请输入对方账户"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="对方账户名" prop="oppositeName">
            <el-input
              v-model="queryParams.oppositeName"
              clearable
              @keyup.enter="handleQuery"
              placeholder="请输入对方账户名"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="交易日期">
            <el-date-picker
              v-model="dateRange"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="[
                new Date(2000, 1, 1, 0, 0, 0),
                new Date(2000, 1, 1, 23, 59, 59),
              ]"
              style="width: 200px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery"
              >搜索</el-button
            >
            <!--<el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExportPdf"
            >导出PDF</el-button>
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleSendEmail"
            >发送邮件</el-button> -->
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 客户账单 table -->
        <el-table :data="billList" border size="small">
          <el-table-column align="center" prop="id" label="编号" />
          <el-table-column align="center" prop="cardNumber" label="卡号" />
          <el-table-column align="center" prop="abstract0" label="摘要" />
          <el-table-column align="center" label="交易金额">
           <template #default="scope">
              {{
              scope.row.debitAmount !== 0
              ? "-" + scope.row.debitAmount
              : (scope.row.creditAmount !== 0 ? "+" + scope.row.creditAmount : 0)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="accountAmount"
            label="账户金额"
          />
          <el-table-column align="center" prop="tradeTime" label="交易日期" />
          <el-table-column align="center" prop="tradeTime" label="记账时间" />
          <el-table-column
            align="center"
            prop="oppositeAccount"
            label="对方账户"
          />
          <el-table-column
            align="center"
            prop="oppositeBank"
            label="商户网点号及名称"
          />
          <el-table-column
            align="center"
            prop="oppositeName"
            label="对方户名"
          />
        </el-table>
        <div class="pager" ref="pagerRef" style="text-align:center; padding: 6px 0;">
          <span v-if="loadingMore">加载中...</span>
          <span v-else-if="noMore && billList.length">没有更多了</span>
          <span v-else>下拉加载更多</span>
        </div>
      </div>
    </div>
    <div class="container-opt">
      <div>
        <el-button
          type="primary"
          size="small"
          style="width: 110px;"
          >全屏</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          style="width: 110px;"
          @click="handleClose"
          >关闭页面</el-button
        >
      </div>
      <div>
        <el-button
          type="danger"
          size="small"
          style="width: 110px; margin-top: 20px; border-radius: 25px;"
          >重新导入流水</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          style="width: 110px; border-radius: 25px;"
          >下载excel模板</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          style="width: 110px; margin-top: 20px; border-radius: 25px;"
          >预览印章</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          style="width: 110px; border-radius: 25px;"
          >生成交易种类</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          style="width: 110px; border-radius: 25px;"
          >清除APP导出记录</el-button
        >
      </div>
      <div>
        <el-button
          type="warning"
          size="small"
          style="width: 110px; margin-top: 20px; border-radius: 25px;"
          >切换时间顺序</el-button
        >
      </div>
      <div>
        <el-button
          type="warning"
          size="small"
          style="width: 110px; border-radius: 25px;"
          >返回顶部</el-button
        >
      </div>
      <div>
        <el-button
          type="warning"
          size="small"
          style="width: 110px; border-radius: 25px;"
          >一键到底</el-button
        >
      </div>
      <div>
        <el-button
          type="warning"
          size="small"
          style="width: 110px; border-radius: 25px;"
          >保存</el-button
        >
      </div>
      <div>
        <el-button
          type="success"
          size="small"
          style="width: 110px; margin-top: 20px; border-radius: 25px;"
          >下载电子流水</el-button
        >
      </div>
      <div>
        <el-button
          type="danger"
          size="small"
          style="width: 110px; border-radius: 25px;"
          >生成低配流水</el-button
        >
      </div>
      <div>
        <el-button
          type="danger"
          size="small"
          style="width: 110px; border-radius: 25px;"
          >生成高配流水</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup name="BankUserInfo">
import { getToken } from "@/utils/auth";
import { ElLoading, ElMessage } from "element-plus";
import {
  listBankUserBillDetail,
  getBankUserBillDetail,
  delBankUserBillDetail,
  getUserDetail,
  addBankUserBillDetail,
  updateBankUserBillDetail,
  uploadExcel,
  getbillList,
  sendEmail,
  downloadJson,
} from "@/api/bankUserBillDetail/bankUserBillDetail";

const emit = defineEmits(["close"]);
const { proxy } = getCurrentInstance();
const route = useRoute();
const customerInfo = ref({});
const billList = ref([]);
const showSearch = ref(true);
const total = ref(0);
const loadingMore = ref(false);
const noMore = ref(false);
const dateRange = ref([]);
const props = defineProps({
  // 定义 id 的类型和默认值（根据实际需求调整）
  id: {
    type: [Number, String], // 允许数字或字符串类型的ID
    required: true, // 如果必须传递，设为true；可选则去掉
    // default: 0 // 可选：设置默认值（当 required 为 false 时）
  },
});

let downloadId = ref(0);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 100,
    userId: null,
    tradeTime: null,
    tradeLocation: null,
    interestBearingTime: null,
    abstract0: null,
    abstract1: null,
    abstract2: null,
    debitAmount: null,
    creditAmount: null,
    accountAmount: null,
    summonsNumber: null,
    oppositeName: null,
    oppositeAccount: null,
    oppositeBank: null,
    message: null,
    serialNumber: null,
    appIcon: null,
    appTitle: null,
    appClass: null,
    appType: null,
    appRemark: null,
    weekendTrade: null,
    upLevelId: null,
    upLevelId2: null,
    sort: null,
    hideFlag: null,
    billId: null,
    detailId: null,
  },
});

const { queryParams, form, rules } = toRefs(data);

function handleQuery() {
  queryParams.value.pageNum = 1;
  noMore.value = false;
  billList.value = [];
  onlyGetList(false);
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  queryParams.value.pageNum = 1;
  noMore.value = false;
  billList.value = [];
  onlyGetList(false);
}

function getList() {
   //console.log('接收的ID1：', props.id);
  if (props.id) {
    queryParams.value.billId = props.id;
    queryParams.value.detailId = props.id;
    getUserDetail(props.id).then((response) => {
      customerInfo.value = response.data;
      //console.log(response.data);
    });

    //console.log("dateRange.value:", dateRange.value); // 添加这行调试
    //console.log("queryParams.value:", queryParams.value); // 添加这行调试

    // 初始化第一页
    queryParams.value.pageNum = 1;
    loadingMore.value = true;
    getbillList(proxy.addDateRange(queryParams.value, dateRange.value)).then(
      (response) => {
        const rows = response?.rows || [];
        billList.value = rows;
        total.value = response?.total ?? 0;
        if (response && typeof response.total === 'number') {
          noMore.value = billList.value.length >= total.value;
        } else {
          // 后端未返回 total 时，用返回数量与 pageSize 判断是否还有更多
          const ps = queryParams.value.pageSize || 100;
          noMore.value = rows.length < ps;
        }
      }
    ).finally(() => {
      loadingMore.value = false;
    });
  }
}

function onlyGetList(append = false) {
  if (!props.id) return;
  queryParams.value.billId = props.id;
  loadingMore.value = true;
  getbillList(proxy.addDateRange(queryParams.value, dateRange.value))
    .then((response) => {
      const rows = response?.rows || [];
      total.value = response?.total ?? 0;
      if (append) {
        billList.value = billList.value.concat(rows);
      } else {
        billList.value = rows;
      }
      if (response && typeof response.total === 'number') {
        noMore.value = billList.value.length >= total.value;
      } else {
        const ps = queryParams.value.pageSize || 100;
        noMore.value = rows.length < ps;
      }
    })
    .finally(() => {
      loadingMore.value = false;
    });
}

function handleExportPdf() {
  // downloadId = props.id
  // //console.log(downloadId)
  // proxy.download("PABankUserInfo/exportBillDetailPDF",
  // JSON.stringify({ id: downloadId }), // 手动转 JSON 字符串
  // `1.pdf`,
  // {
  //   headers: { "Content-Type": "application/json;charset=UTF-8" }
  // })
  downloadJson("PABankUserInfo/exportBillDetailPDF", { id: props.id }, "平安银行个人账户交易明细.pdf");
}

function handleSendEmail() {
  //console.log(queryParams.value);
  sendEmail(queryParams.value).then((response) => {
    proxy.$modal.msgSuccess("发送成功");
  });
}

const handleClose = () => {
  emit('close');
}


// 组件挂载时请求
onMounted(() => {
  getList();
  initObserver();
});

// 如果父组件传来的 id 可能会变化，也可以监听
watch(() => props.id, (newId) => {
  if (newId) getList();
});

onUnmounted(() => {
  destroyObserver();
});
// 使用 IntersectionObserver 监听分页占位元素以触发加载更多
const pagerRef = ref(null);
let io = null;
function initObserver() {
  try {
    if (io) return;
    io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        if (!loadingMore.value && !noMore.value && billList.value.length) {
          queryParams.value.pageNum = (queryParams.value.pageNum || 1) + 1;
          onlyGetList(true);
        }
      }
    }, { root: null, threshold: 0.1 });
    if (pagerRef.value) io.observe(pagerRef.value);
  } catch (e) {
    // 兼容性降级：如果不支持 IO，可在此回退到滚动监听
  }
}
function destroyObserver() {
  if (io && pagerRef.value) {
    io.unobserve(pagerRef.value);
  }
  io = null;
}
</script>

<style scoped>
.search-card {
  display: flex;
  flex-wrap: wrap;
  column-gap: 10px;
}
.app-container {
  display: flex;
  padding: 0px;
  /* 右侧固定操作区预留空间，避免内容被覆盖 */
  padding-right: 170px;
}
.container-left {
  flex: 1;
}
.container-opt {
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: fixed;
  right: 10px;
  top: 80px; /* 根据页面头部高度可微调 */
  z-index: 10;
}
.bill-info {
  border: 1px solid #ebeef5;
  padding: 0 15px;
  margin-top: 15px;
}
.bill-info-title {
  font-size: 13px;
  border-bottom: 1px solid #ebeef5;
  margin-left: -15px;
  margin-right: -15px;
  padding: 5px;
  margin-bottom: 10px;
}
</style>
