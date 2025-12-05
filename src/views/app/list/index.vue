<template>
  <div class="page-contair">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="size" label="大小"> </el-table-column>
      <el-table-column prop="number" label="下载次数"> </el-table-column>
      <el-table-column prop="url" label="下载链接/二维码">
        <template #default="scope">
          <el-popover
            placement="bottom"
            :width="200"
            trigger="click"
            @show="popoverShow"
          >
            <template #reference>
              <el-link type="primary">{{ scope.row.url }}</el-link>
            </template>
            <canvas ref="canvasRef" :width="200" :height="200"></canvas>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="op" label="操作"> </el-table-column>
    </el-table>
    <!-- <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div> -->
  </div>
</template>

<script setup>
import { nextTick } from 'vue';
import qrcode from 'qrcode';

const canvasRef = ref();
const currentPage = ref(1);
const total = ref(1);
const tableData = ref([
  { name: "招商银行", size: "245MB", number: 1000, url: "www.baidu.com" },
  { name: "招商银行", size: "245MB", number: 1000, url: "www.baidu.com" },
]);

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
};

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
};

const popoverShow = () => {
  nextTick(() => {
    const url = 'www.baidu.com';
    qrcode.toCanvas(canvasRef.value, url, { margin: 1, width: 175 });
  })
}
</script>

<style scoped>
.page-contair {
  width: 100%;
  height: 100%;
  padding: 10px;
}
:deep(.el-table) {
  border: 1px solid rgb(229, 229, 229);
  border-bottom: none;
  box-sizing: content-box;
}
.pagination {
  display: flex;
  justify-content: end;
  margin-top: 15px;
  /* text-align: end; */
}
</style>
