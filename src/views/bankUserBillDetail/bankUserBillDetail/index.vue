<template>
  <div class="app-container">
    <div class="split-layout">
      <section class="search-area">
        <el-form
          :model="queryParams"
          ref="queryRef"
          v-show="showSearch"
          class="search-card"
          size="small"
        >
          <el-form-item label="姓名" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入姓名"
              clearable
              @keyup.enter="handleQuery"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="卡号" prop="userAccount">
            <el-input
              v-model="queryParams.userAccount"
              placeholder="请输入卡号"
              clearable
              @keyup.enter="handleQuery"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="APP账号" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入APP账号"
              clearable
              @keyup.enter="handleQuery"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="制作流水时间">
            <el-date-picker
              clearable
              v-model="queryParams.createTime"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 200px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="流水创建时间">
            <el-date-picker
              clearable
              v-model="queryParams.createTime"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 200px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="opt-box">
          <div class="opt-left">
            <div class="opt-item">
              <el-button
                type="danger"
                plain
                icon="Upload"
                @click="handleImport"
                size="small"
                >导入excel流水</el-button
              >
              <el-button
                type="success"
                size="small"
                plain
                icon="Download"
                @click="handleExcelExport"
                >下载excel模板</el-button
              >
            </div>
            <div class="opt-item">
              <el-button
                type="success"
                plain
                icon="Download"
                size="small"
                :disabled="!selectedRow"
                @click="openDownloadDialog"
                >下载电子流水</el-button
              >
              <el-button
                type="success"
                plain
                icon="Delete"
                size="small"
                :disabled="!selectedRow"
                @click="handleDeleteRecord"
                >清除APP导出记录</el-button
              >
            </div>
            <div class="opt-item">
              <el-button
                type="danger"
                plain
                icon="Plus"
                :disabled="!selectedRow"
                @click="handleSerialFlagBoth('1')"
                size="small"
                >生成低配流水</el-button
              >
              <el-button
                type="danger"
                plain
                icon="Plus"
                :disabled="!selectedRow"
                @click="handleSerialFlagBoth('2')"
                size="small"
                >生成高配流水</el-button
              >
            </div>
            <el-button
              type="primary"
              icon="EditPen"
              size="small"
              plain
              :disabled="!selectedRow"
              @click="openDetailPage"
            >
              编辑流水
            </el-button>
          </div>
          <div class="opt-rignt">
            <right-toolbar
              :showSearch="showSearch"
              @queryTable="getList"
            ></right-toolbar>
          </div>
        </div>

        <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Upload" @click="handleImport"
              >导入excel流水</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="Edit"
              plain
              :disabled="!selectedRow"
              @click="openDetailPage"
            >
              编辑流水
            </el-button>
          </el-col>
          <right-toolbar
            :showSearch="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row> -->
      </section>
      <section class="list-area">
        <div class="">
          <el-table
            v-loading="loading"
            class="table-card"
            :data="bankUserBillDetailList"
            :show-overflow-tooltip="true"
            highlight-current-row
            @row-click="handleRowClick"
            size="small"
          >
            <el-table-column label="会员账号" align="center" prop="id" />
            <el-table-column
              label="持卡人姓名"
              align="center"
              prop="userName"
            />
            <el-table-column label="卡号" align="center" prop="cardNumber" />
            <el-table-column
              label="制作流水时间"
              align="center"
              prop="createTime"
            >
              <template #default="scope">
                <span class="time-cell">{{
                  parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="制作创建时间"
              align="center"
              prop="createTime"
            >
              <template #default="scope">
                <span class="time-cell">{{
                  parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="APP账号"
              align="center"
              prop="phonenumber"
            />
            <el-table-column label="APP密码" align="center" prop="password" />
            <el-table-column
              label="APP最后登录时间"
              align="center"
              prop="loginDate"
            >
              <template #default="scope">
                <span class="time-cell">{{
                  parseTime(scope.row.loginDate, "{y}-{m}-{d} {h}:{i}:{s}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="城市" align="center" prop="city" />
            <el-table-column label="付费状态" align="center">
              <template #default="scope">
                <span 
                  v-if="scope.row.serialFlag == 1" 
                  class="status-tag status-low"
                >
                  低
                </span>
                <span 
                  v-else-if="scope.row.serialFlag == 2" 
                  class="status-tag status-high"
                >
                  高
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="失效时间"
              align="center"
              prop="failureTime"
            />
            <!--<el-table-column label="交易网点" align="center" prop="tradeLocation" />-->

            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
              width="200"
            >
              <template #default="scope">
                <!--<el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bankUserBillDetail:bankUserBillDetail:edit']">修改</el-button>-->
                <el-button
                  link
                  type="danger"
                  icon="Delete"
                  size="small"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
                <el-button
                  link
                  type="primary"
                  icon="Refresh"
                  size="small"
                  @click="handleFailureTime(scope.row)"
                  >重置失效时间</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="">
          <pagination
            v-show="total > 0"
            :total="total"
            size="small"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </section>

      <!-- 右侧区域 - 占比30% -->
      <div class="detail-area">
        <template v-if="selectedUser">
          <!--<h3>详情信息</h3>-->
          <el-form label-width="100px" size="small" :model="selectedUser" ref="detailForm">
            <el-row style="padding-right: 10px">
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="持卡人姓名" prop="userName">
                  <el-input
                    v-model="selectedUser.userName"
                    placeholder="请输入持卡人姓名"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="银行卡号" prop="cardNumber">
                  <el-input
                    v-model="selectedUser.cardNumber"
                    placeholder="请输入银行卡号"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="APP账户" prop="phonenumber">
                  <el-input
                    v-model="selectedUser.phonenumber"
                    placeholder="请输入APP账户"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="APP密码" prop="password">
                  <el-input
                    v-model="selectedUser.password"
                    placeholder="请输入APP密码"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="身份证号码" prop="identityNumber">
                  <el-input
                    v-model="selectedUser.identityNumber"
                    placeholder="请输入身份证号码"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="开户网点" prop="createLocation">
                  <el-input
                    v-model="selectedUser.createLocation"
                    placeholder="请输入开户网点"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="开户日期" prop="startTime">
                  <el-date-picker
                    clearable
                    v-model="selectedUser.startTime"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择开户日期"
                    style="width: 100%"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="性别" prop="sex">
                  <el-select
                    v-model="selectedUser.sex"
                    placeholder="请选择性别"
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="dict in sys_user_sex"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="积分" prop="points">
                  <el-input
                    v-model="selectedUser.points"
                    placeholder="请输入积分"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="章内编码" prop="sealNumber">
                  <el-input
                    v-model="selectedUser.sealNumber"
                    placeholder="请输入章内编码"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="星级" prop="starLevel">
                  <el-input
                    v-model="selectedUser.starLevel"
                    placeholder="请输入星级"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="章内支行" prop="acceptBank1">
                  <el-input
                    v-model="selectedUser.acceptBank1"
                    placeholder="请输入章内支行"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col> -->
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="所属分行" prop="acceptBank">
                  <el-input
                    v-model="selectedUser.acceptBank"
                    placeholder="请输入所属分行"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="定位城市" prop="city">
                  <el-input
                    v-model="selectedUser.city"
                    placeholder="请输入定位城市"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="预留手机号" prop="phonenumber">
                  <el-input
                    v-model="selectedUser.phonenumber"
                    placeholder="请输入预留手机号"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="卡类型" prop="cardType">
                  <el-input
                    v-model="selectedUser.cardType"
                    placeholder="请输入卡类型"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="账号/子账号" prop="subUserAccount">
                  <el-input
                    v-model="selectedUser.subUserAccount"
                    placeholder="请输入账号/子账号"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="流水号" prop="serialNumber">
                  <el-input
                    v-model="selectedUser.serialNumber"
                    placeholder="请输入流水号"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="网点号" prop="serialNumber1">
                  <el-input
                    v-model="selectedUser.serialNumber1"
                    placeholder="请输入网点号"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="银行代号" prop="serialNumber1">
                  <el-input
                    v-model="selectedUser.serialNumber1"
                    placeholder="请输入银行代号"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="网点地址" prop="serialNumber1">
                  <el-input
                    v-model="selectedUser.serialNumber1"
                    placeholder="请输入网点地址"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24" :xl="12">
                <el-form-item label="联系电话" prop="serialNumber1">
                  <el-input
                    v-model="selectedUser.serialNumber1"
                    placeholder="请输入联系电话"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col> -->
              <el-col :md="24" :lg="24" :xl="20">
                <el-form-item label="证件起止时间" prop="tradeLocation">
                  <div style="display: flex">
                    <el-date-picker
                      clearable
                      v-model="selectedUser.identityStart"
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="请选择开始日期"
                      style="width: 100%"
                    >
                    </el-date-picker>
                    <el-date-picker
                      clearable
                      v-model="selectedUser.identityEnd"
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="请选择结束日期"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </div>
                  <el-checkbox label="长期" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-button type="primary" @click="handleDetailEdit"
                  >确定</el-button
                >
                <el-button @click="reseDetailEdit">取消</el-button>
              </el-col>
            </el-row>
          </el-form>
        </template>
        <template v-else>
          <div class="text-center py-10 text-gray-500">
            请选择一条用户数据查看详情
          </div>
        </template>
      </div>
    </div>

    <!-- 添加或修改客户账单详情对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form
        ref="bankUserBillDetailRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户编号" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户编号" />
        </el-form-item>
        <el-form-item label="交易日期" prop="tradeTime">
          <el-date-picker
            clearable
            v-model="form.tradeTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择交易日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易网点" prop="tradeLocation">
          <el-input v-model="form.tradeLocation" placeholder="请输入交易网点" />
        </el-form-item>
        <el-form-item label="起息日" prop="interestBearingTime">
          <el-date-picker
            clearable
            v-model="form.interestBearingTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择起息日"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="摘要" prop="abstract0">
          <el-input v-model="form.abstract0" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="摘要2" prop="abstract1">
          <el-input v-model="form.abstract1" placeholder="请输入摘要2" />
        </el-form-item>
        <el-form-item label="摘要3" prop="abstract2">
          <el-input v-model="form.abstract2" placeholder="请输入摘要3" />
        </el-form-item>
        <el-form-item label="借方发生额" prop="debitAmount">
          <el-input v-model="form.debitAmount" placeholder="请输入借方发生额" />
        </el-form-item>
        <el-form-item label="贷方发生额" prop="creditAmount">
          <el-input
            v-model="form.creditAmount"
            placeholder="请输入贷方发生额"
          />
        </el-form-item>
        <el-form-item label="账户余额" prop="accountAmount">
          <el-input v-model="form.accountAmount" placeholder="请输入账户余额" />
        </el-form-item>
        <el-form-item label="传票号码" prop="summonsNumber">
          <el-input v-model="form.summonsNumber" placeholder="请输入传票号码" />
        </el-form-item>
        <el-form-item label="对方户名" prop="oppositeName">
          <el-input v-model="form.oppositeName" placeholder="请输入对方户名" />
        </el-form-item>
        <el-form-item label="对方账户" prop="oppositeAccount">
          <el-input
            v-model="form.oppositeAccount"
            placeholder="请输入对方账户"
          />
        </el-form-item>
        <el-form-item label="对方开户行" prop="oppositeBank">
          <el-input
            v-model="form.oppositeBank"
            placeholder="请输入对方开户行"
          />
        </el-form-item>
        <el-form-item label="留言" prop="message">
          <el-input v-model="form.message" placeholder="请输入留言" />
        </el-form-item>
        <el-form-item label="流水号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="请输入流水号" />
        </el-form-item>
        <el-form-item label="APP交易图标" prop="appIcon">
          <el-input v-model="form.appIcon" placeholder="请输入APP交易图标" />
        </el-form-item>
        <el-form-item label="APP交易标题" prop="appTitle">
          <el-input v-model="form.appTitle" placeholder="请输入APP交易标题" />
        </el-form-item>
        <el-form-item label="APP交易分类" prop="appClass">
          <el-input v-model="form.appClass" placeholder="请输入APP交易分类" />
        </el-form-item>
        <el-form-item label="APP备注" prop="appRemark">
          <el-input v-model="form.appRemark" placeholder="请输入APP备注" />
        </el-form-item>
        <el-form-item label="周六日交易" prop="weekendTrade">
          <el-input
            v-model="form.weekendTrade"
            placeholder="请输入周六日交易"
          />
        </el-form-item>
        <el-form-item label="上级ID" prop="upLevelId">
          <el-input v-model="form.upLevelId" placeholder="请输入上级ID" />
        </el-form-item>
        <el-form-item label="ID2" prop="upLevelId2">
          <el-input v-model="form.upLevelId2" placeholder="请输入ID2" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hideFlag">
          <el-input v-model="form.hideFlag" placeholder="请输入是否隐藏" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">仅支持 .xls / .xlsx 文件</div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="客户详情"
      fullscreen
      top="5vh"
      class="hide-header"
    >
      <!-- 引入详情页组件 -->
      <DetailPage v-if="detailDialogVisible" :id="selectedRow?.id" @close="detailDialogVisible = false" />
    </el-dialog>

    <!-- 下载电子流水弹窗 -->
    <el-dialog
      v-model="downloadDialogVisible"
      title="下载电子流水"
      width="500px"
      align-center
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="downloadFormRef"
        :model="downloadForm"
        label-width="120px"
      >
        <el-form-item label="流水开始日期" prop="startDate">
          <el-date-picker
            v-model="downloadForm.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择流水开始日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="流水结束日期" prop="endDate">
          <el-date-picker
            v-model="downloadForm.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择流水结束日期"
            :disabled-date="disabledEndDate"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSerialDownload">下载流水</el-button>
          <el-button @click="downloadDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="BankUserBillDetail">
import {
  listBankUserBillDetail,
  getBankUserBillDetail,
  delBankUserBillDetail,
  getUserDetail,
  handleFailueTime,
  addBankUserBillDetail,
  updateBankUserBillDetail,
  uploadExcel,
  handleSerialFlag,
  handleDeleteAppRecord,
  downloadJson,
  downloadExcelTemplate
} from "@/api/bankUserBillDetail/bankUserBillDetail";
import {
  getBankUserInfo,
  listBankUserInfo,
} from "@/api/bankUserInfo/bankUserInfo";
import { ElLoading, ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";
import DetailPage from "@/views/bankUserInfo/bankUserInfo/index.vue";

const { proxy } = getCurrentInstance();
const { sys_user_sex } = proxy.useDict("sys_user_sex");
const bankUserBillDetailList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dialogVisible = ref(false);
const uploadRef = ref(null);
const selectedFile = ref(null);
const selectedUser = ref({});
const detailForm = ref(null);
const selectedRow = ref(null);
const detailDialogVisible = ref(false);
const downloadDialogVisible = ref(false);
const downloadFormRef = ref(null);
const downloadForm = reactive({
  startDate: null,
  endDate: null,
});

/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "Excel导入",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/PABankUserInfo/importExcel",
});
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
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
  },
  rules: {
    userId: [{ required: true, message: "用户编号不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户账单详情列表 */
function getList() {
  loading.value = true;
  listBankUserBillDetail(queryParams.value).then((response) => {
    bankUserBillDetailList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

//跳转详情页面
const openDetailPage = () => {
  if (!selectedRow.value) return;
  //console.log(selectedRow.value.id);
  detailDialogVisible.value = true;
  // 跳转并传参
};

// 表单重置
function reset() {
  form.value = {
    id: null,
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
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
  };
  proxy.resetForm("bankUserBillDetailRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 确定按钮操作 */
function handleDetailEdit() {
  loading.value = true;
  updateBankUserBillDetail(selectedUser.value).then((response) => {
    proxy.$modal.msgSuccess("修改成功");
    open.value = false;
    getList();
  });
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function reseDetailEdit() {
  selectedUser.value = null;
  proxy.resetForm("detailForm");
}

const handleRowClick = async (row) => {
  //console.log(row);
  selectedUser.value = null; // 清空旧数据，右边详情显示“加载中”或者空
  selectedRow.value = row || null;
  try {
    const res = await getUserDetail(row.id); // 根据行里的id请求详情
    selectedUser.value = res.data; // 接口返回的详情数据
  } catch (error) {
    ElMessage.error("加载详情失败");
  }
};

const resetDialog = () => {
  selectedFile.value = null;
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
};

// 正常选择文件
const handleFileChange = (file) => {
  selectedFile.value = file.raw;
};

// 超过限制时：清空并替换成新文件
const handleExceed = (files) => {
  uploadRef.value.clearFiles();
  const file = files[0];
  // 用 add 方法加入新文件 (Element Plus 官方写法)
  uploadRef.value.handleStart(file);
  selectedFile.value = file;
};

const beforeUpload = (file) => {
  const isExcel =
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel";
  if (!isExcel) {
    ElMessage.error("只能上传 Excel 文件！");
  }
  return isExcel;
};

const submitExcel = async () => {
  if (!selectedFile.value) {
    ElMessage.warning("请先选择一个 Excel 文件！");
    return;
  }

  try {
    await uploadExcel(selectedFile.value);
    ElMessage.success("上传成功！");
    dialogVisible.value = false;
    resetDialog();
  } catch (error) {
    ElMessage.error("上传失败，请重试！");
  }
};

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加客户账单详情";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;
  getBankUserBillDetail(_id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改客户账单详情";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bankUserBillDetailRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateBankUserBillDetail(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBankUserBillDetail(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal
    .confirm('是否确认删除客户账单详情编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delBankUserBillDetail(_ids);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 重置失效时间按钮操作 */
function handleFailureTime(row) {
  const _ids = row.id || ids.value;
  proxy.$modal
    .confirm('是否确定重置ID为"' + _ids + '"的数据项？')
    .then(function () {
      return handleFailueTime(_ids);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("重置成功");
    })
    .catch(() => {});
}

/** 流水配置 */
const handleSerialFlagBoth = (type) => {
  if (!selectedRow.value) return;
  handleSerialFlag(selectedRow.value.userId, type).then((response) => {
    proxy.$modal.msgSuccess("配置成功");
  });
  getList();
}

/** 打开下载电子流水弹窗 */
const openDownloadDialog = () => {
  if (!selectedRow.value) return;
  // 清空表单数据
  downloadForm.startDate = null;
  downloadForm.endDate = null;
  // 打开弹窗
  downloadDialogVisible.value = true;
}

/** 禁用结束日期（不能早于开始日期） */
const disabledEndDate = (time) => {
  if (!downloadForm.startDate) {
    return false; // 如果没有选择开始日期，不禁用任何日期
  }
  // 禁用早于开始日期的所有日期
  return time.getTime() < new Date(downloadForm.startDate).getTime();
}

/** 下载流水 */
function handleSerialDownload() {
  if (!selectedRow.value) return;
  
  // 使用 downloadJson 方法下载 PDF 文件
  downloadJson(
    "PABankUserInfo/exportBillDetailPDF",
    {
      userId: selectedRow.value.userId,
      startDate: downloadForm.startDate,
      endDate: downloadForm.endDate
    },
    `电子流水_${selectedRow.value.userName || selectedRow.value.userId}_${new Date().getTime()}.pdf`
  ).then(() => {
    proxy.$modal.msgSuccess("下载成功");
    // 关闭弹窗
    downloadDialogVisible.value = false;
  }).catch(() => {
    proxy.$modal.msgError("下载失败，请重试");
  });
}

/** 删除app导出记录 */
const handleDeleteRecord = (type) => {
    if (!selectedRow.value) return;
    handleDeleteAppRecord(selectedRow.value.userId, type).then((response) => {
    proxy.$modal.msgSuccess("删除成功");
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "bankUserBillDetail/bankUserBillDetail/export",
    {
      ...queryParams.value,
    },
    `bankUserBillDetail_${new Date().getTime()}.xlsx`
  );
}

/** 下载Excel模板 */
function handleExcelExport() {
  downloadExcelTemplate().then(() => {
    proxy.$modal.msgSuccess("模板下载成功");
  }).catch(() => {
    proxy.$modal.msgError("模板下载失败，请重试");
  });
}

/** 导入按钮操作 */
// function handleInport() {
//   proxy.download('bankUserBillDetail/bankUserBillDetail/inport', {
//     ...queryParams.value
//   }, `bankUserBillDetail_${new Date().getTime()}.xlsx`)
// }

/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "system/user/importTemplate",
    {},
    `user_template_${new Date().getTime()}.xlsx`
  );
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}
getList();
</script>

<style scoped>
/* 两列：左 70% 右 30%；两行：上(查询) + 下(列表)；右侧跨两行 */
.split-layout {
  display: grid;
  grid-template-columns: 7fr 3fr;
  grid-template-rows: auto 1fr;
  gap: 12px;
  height: calc(100vh - 100px); /* 视你项目头部高度调整 */
  min-height: 0; /* 关键：允许子项在容器内收缩 */
  overflow: hidden;
}

/* 左上：查询 */
.search-area {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  min-height: 0;
}

.search-card {
  display: flex;
  flex-wrap: wrap;
  column-gap: 10px;
}

/* 左下：列表区域，占满剩余高度 */
.list-area {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 关键：让内部滚动生效 */
  overflow: hidden; /* 防止把右侧挤下去 */
}

/* 表格可滚动，分页固定在底部 */
.table-scroll {
  flex: 1;
  min-height: 0; /* 关键：避免内容把容器撑高 */
  overflow: auto; /* 在这里滚动表格 */
}

.pager {
  flex-shrink: 0; /* 分页不被压缩，始终贴底 */
  padding-top: 8px;
  text-align: right;
}

/* 右侧详情跨两行，与左侧同高 */
.detail-area {
  grid-column: 2 / 3;
  grid-row: 1 / 3; /* 跨两行 */
  min-height: 0;
  overflow: auto; /* 右侧自身滚动 */
  border: 0px;
}

/* 移除卡片边框 */
::v-deep .no-border-card {
  border: none;
  box-shadow: none; /* 移除卡片阴影 */
  padding: 0;
}

.el-table .el-table__cell {
  white-space: nowrap; /* 强制不换行 */
  overflow: hidden; /* 溢出隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
}

/* 可选：给表格设置默认最大宽度，避免过宽 */
.el-table {
  width: 100%;
  min-width: 800px; /* 根据实际需求调整 */
}

.time-cell {
  /* 保证能使用 text-overflow */
  width: 100%; /* 宽度自适应列的宽度 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示为省略号 */
}

:deep(.el-card .el-form-item .el-input),
:deep(.el-card .el-form-item .el-date-editor) {
  width: 180px;
}

.opt-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.opt-left {
  display: flex;
  flex-wrap: wrap;
  column-gap: 30px;
  row-gap: 10px;
}
.opt-rignt {
  flex-shrink: 0;
}
.opt-item {
  display: flex;
}

/* 付费状态标签样式 */
.status-tag {
  display: inline-block;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid;
  cursor: default;
  line-height: 1.5;
  height: auto;
}

/* 低配样式 - 参考导入excel流水按钮(danger plain) */
.status-low {
  color: #f56c6c;
  background-color: #fef0f0;
  border-color: #f56c6c;
}

/* 高配样式 - 参考下载excel模板按钮(success plain) */
.status-high {
  color: #67c23a;
  background-color: #f0f9eb;
  border-color: #67c23a;
}
</style>
