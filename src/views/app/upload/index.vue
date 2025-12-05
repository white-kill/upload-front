<template>
  <div style="width: 100%; height: 100%">
    <template v-if="!isUploading">
      <el-upload class="upload-content" drag :before-upload="beforeUpload">
        <!-- <div class="contair"> -->
        <el-button
          class="upload-button"
          size="large"
          type="primary"
          :icon="UploadFilled"
          >立即上传</el-button
        >
        <div class="upload-desc">
          点击按钮选择应用的安装包，或拖拽文件到此区域
        </div>
        <div class="upload-desc">
          （支持.ipa或.apk文件，单个文件最大支持
          <span style="color: red">1000 M</span> ）
        </div>
        <!-- </div> -->
      </el-upload>
    </template>
    <template v-else>
      <div class="contair">
        <el-image
          class="app-image"
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          fit="fill"
        ></el-image>
        <div class="app-name">招商银行</div>
        <div class="app-desc">正在上传中，请不要关闭浏览器</div>
        <div class="app-progress">
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="uploadProgress"
          ></el-progress>
        </div>
        <div>simapleDemo...(245MB)- 70% - 7.6MB/s - 00:00:27</div>
        <el-button type="primary" plain>取消上传</el-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue";

const isUploading = ref(false);
const uploadProgress = ref(0);
const timer = ref(null);

const beforeUpload = (file) => {
  console.log(file, "file");
  isUploading.value = true;
  timer.value = setInterval(() => {
    uploadProgress.value += 10;
    if(uploadProgress.value >= 100) {
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
};
</script>

<style scoped>
.upload-content {
  width: 100%;
  height: 100%;
}
:deep(.el-upload) {
  height: 100%;
}
:deep(.el-upload-dragger) {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: none;
}
.contair {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: rgb(132, 132, 132);
  font-size: 15px;
  gap: 10px;
}
.upload-button {
  width: 240px;
  padding: 0;
  height: 60px;
  font-size: 18px;
  line-height: 58px;
  border-radius: 0;
  margin-bottom: 20px;
}
.upload-desc {
  color: black !important;
}
.app-image {
  width: 60px;
  height: 60px;
}
.app-name {
  margin-top: 20px;
}
.app-progress {
  width: 100%;
}

:deep(.el-icon) {
  font-size: 30px;
}
</style>
