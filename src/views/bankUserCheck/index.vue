<template>
  <div class="content">
    <div v-if="!showResult">
      <div class="nav">个人证明验证</div>
      <div class="form-item">
        <div class="form-item-label" style="width: 128px;">证明编号</div>
        <div class="form-item-content">{{ param.no }}</div>
      </div>
      <div class="form-item" style="margin-top: 1px">
        <div class="form-item-label">证件号</div>
        <div class="form-item-content">
          <input
            class="form-input"
            placeholder="请输入完整证件号"
            type="text"
            v-model="param.cardNumber"
            @blur="onBlur"
          />
        </div>
      </div>
      <div class="form-desc" v-if="showDesc">
        <div class="form-warn">!</div>
        <span>请输入证件号</span>
      </div>
      <div class="form-desc2">
        <span>温馨提示：请输入完整证件号</span>
      </div>
      <div
        class="submit-button"
        :style="{
          backgroundColor: param.cardNumber.length == 0 || param.no.length == 0 ? '#E9B092' : '#EB3324',
        }"
        @click="handleSubmit"
      >
        提 交
      </div>
    </div>
    <div style="background-color: #fff" v-else>
      <div class="nav">
        <span>个人证明验证</span>
        <div class="back-btn" @click="handleBack">完成</div>
      </div>
      <div class="success-content">
        <template v-if="resultData">
          <el-icon class="verify-success"><CircleCheckFilled /></el-icon>
          <div style="font-size: 17px; margin-top: 15px; margin-bottom: 30px;">个人证明验证成功</div>
          <div class="success-row">
            <div class="success-row-title">凭证类型</div>
            <div>交易流水</div>
          </div>
          <div class="success-row">
            <div class="success-row-title">编号</div>
            <div>{{ param.no }}</div>
          </div>
          <div class="success-row">
            <div class="success-row-title">状态</div>
            <div>有效</div>
          </div>
          <div class="success-row">
            <div class="success-row-title">验证时间</div>
            <div>{{ resultTime }}</div>
          </div>
        </template>
        <template v-else>
          <el-icon class="verify-fail"><CircleCloseFilled /></el-icon>
          <div style="font-size: 17px; margin-top: 15px; margin-bottom: 15px;">个人证明验证失败</div>
          <div class="fail-desc">证明编号不存在，请确认是否输入正确</div>
        </template>
      </div>
    </div>
    <div class="mask" v-if="showVerify">
      <div class="mask-content">
        <div class="mask-close" @click="showVerify = false">
          <el-icon><Close /></el-icon>
        </div>
        <div class="photo-content">
          <!-- <div class="photo-module"></div> -->
          <div class="photo-block"></div>
        </div>
        <div class="slider-content">
          <div class="slider-tips">
            <span>请</span>
            <span style="color: #e9b092">拖动</span>
            <span>左侧滑块置正确缺口</span>
            <img
              style="width: 10px; margin-left: 5px"
              src="../../assets/images/arrow.png"
            />
          </div>
          <div class="slider-progress"></div>
          <div class="drag-item">
            <img style="width: 25px" src="../../assets/images/block.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElLoading } from "element-plus";
import { checkCardNumber } from "@/api/bankUserBillDetail/bankUserBillDetail";
const { proxy } = getCurrentInstance();

const param = ref({
  no: "",
  cardNumber: "",
});

const showDesc = ref(false);
const showVerify = ref(false);
const showResult = ref(false);
const resultData = ref(false);
const resultTime = ref('')

const route = useRoute()

onMounted(() => {
  const q = route.query?.code
	param.value.no = typeof q === 'string' && q ? q : '';
});

function genCode() {
	const d = new Date()
	const yy = (d.getFullYear() % 100).toString().padStart(2, '0')
	const MM = (d.getMonth() + 1).toString().padStart(2, '0')
	const dd = d.getDate().toString().padStart(2, '0')
	const hh = d.getHours().toString().padStart(2, '0')
	const mm = d.getMinutes().toString().padStart(2, '0')
	const ss = d.getSeconds().toString().padStart(2, '0')
	return `JYLS${yy}${MM}${dd}${hh}${mm}${ss}`
}

function onBlur() {
  showDesc.value =
    !param.value.cardNumber || param.value.cardNumber.length == 0;
}

function handleBack() {
  if(resultData.value) {
    window.location.href = '/index'
  }else{
    showResult.value = false;
    param.value.cardNumber = '';
  }
}

function handleSubmit() {
  if(param.value.cardNumber.length != 0 && param.value.no.length != 0) {
    const loading = ElLoading.service({
      lock: true,
      background: "rgba(0, 0, 0, 0.7)",
    });
    setTimeout(() => {
      showVerify.value = true;
    }, 500);
    setTimeout(() => {
      initDrag();
      loading.close();
    }, 500);
  }
}

function formatTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function rqCheckCardNumber() {
  showVerify.value = false;
  const loading = ElLoading.service({
    lock: true,
    background: "rgba(0, 0, 0, 0.7)",
  });
  checkCardNumber(param.value).then((res) => {
    loading.close();
    console.log(res);
    resultData.value = res.data;
    const serverTime = res?.data?.time || res?.time
    resultTime.value = serverTime ? formatTime(serverTime) : formatTime(new Date())
    showResult.value = true;
  }).catch(err => {
    loading.close();
  });
}

function initDrag() {
  const photoContent = document.querySelector(".photo-content");
  const imageWidth = photoContent.clientWidth;
  const imageHeight = photoContent.clientHeight;

  // 计算 x为目标偏移量   y为距离顶部的距离
  let x = (589 / 913) * imageWidth;
  let y = (206 / 463) * imageHeight;
  const initX = 15;

  // 设置校验块的位置
  const checkBlock = document.querySelector(".photo-block");
  checkBlock.style.cssText = `top:${y}px`;

  // 定义个运动状态 如果为true代表鼠标已经按下
  let animating = false;
  // 定义存储鼠标按下的x坐标
  let startX = 0;
  // 获取拖拽的滑块
  const dragBlock = document.querySelector(".drag-item");
  const progressBlock = document.querySelector(".slider-progress");
  const isMobile = getMobileFlag();
  if (isMobile) {
    // 添加鼠标按下事件
    dragBlock.addEventListener("touchstart", (e) => {
      console.log("touchstart", e);
      const touch = e.touches[0];
      animating = true;
      startX = touch.pageX;
      dragBlock.classList.add("drag-item-hover");
    });
    // 添加鼠标弹起事件
    document.addEventListener("touchend", () => {
      console.log("touchend");
      animating = false;
      dragBlock.classList.remove("drag-item-hover");
    });
  } else {
    // 添加鼠标按下事件
    dragBlock.addEventListener("mousedown", (e) => {
      console.log("mousedown");
      animating = true;
      startX = e.pageX;
      dragBlock.classList.add("drag-item-hover");
    });
    // 添加鼠标弹起事件
    document.addEventListener("mouseup", () => {
      console.log("mouseup");
      animating = false;
      dragBlock.classList.remove("drag-item-hover");
    });
  }

  // 存储移动的距离
  let offsetX = 0;
  // 获取校验区域
  const drag = document.querySelector(".slider-content");
  if (isMobile) {
    // 添加鼠标移动事件
    drag.addEventListener("touchmove", (e) => {
      // 没有按下鼠标 不执行
      if (!animating) return;

      const touch = e.touches[0];
      // 存储鼠标移动的距离
      offsetX = touch.pageX - startX;
      // 限制移动的范围 0-350
      if (offsetX < 0 || offsetX > imageWidth - 60) {
        return;
      }
      // 修改可移动盒子的 x 轴坐标
      dragBlock.style.transform = `translateX(${offsetX}px`;
      // progressBlock.style.transform =
      // 设置被验证滑块left值
      checkBlock.style.left = `${offsetX + initX}px`;
      progressBlock.style.right = `${imageWidth - offsetX - 10}px`;
    });

    drag.addEventListener("touchend", () => {
      animating = false;
      // 根据移动的位置判断是否成功
      // 移动的距离和校验块的x坐标的差值小于2 代表成功
      if (offsetX >= x - initX - 2 && offsetX <= x + initX + 2) {
        rqCheckCardNumber();
      }
      //  滑块和被验证块恢复坐标
      dragBlock.style.transform = `translateX(0px)`;
      checkBlock.style.left = `${initX}px`;
      progressBlock.style.right = `${imageWidth}px`;
    });
  } else {
    // 添加鼠标移动事件
    drag.addEventListener("mousemove", (event) => {
      // 没有按下鼠标 不执行
      if (!animating) return;
      // 存储鼠标移动的距离
      offsetX = event.pageX - startX;
      // 限制移动的范围 0-350
      if (offsetX < 0 || offsetX > imageWidth - 60) {
        return;
      }
      // 修改可移动盒子的 x 轴坐标
      dragBlock.style.transform = `translateX(${offsetX}px`;
      // 设置被验证滑块left值
      checkBlock.style.left = `${offsetX + initX}px`;
      progressBlock.style.right = `${imageWidth - offsetX - 10}px`;
    });

    drag.addEventListener("mouseup", () => {
      animating = false;
      // 根据移动的位置判断是否成功
      // 移动的距离和校验块的x坐标的差值小于2 代表成功
      if (offsetX >= x - initX - 2 && offsetX <= x + initX + 2) {
        rqCheckCardNumber();
      }
      //  验证失败 滑块和被验证块恢复坐标
      dragBlock.style.transform = `translateX(0px)`;
      checkBlock.style.left = `${initX}px`;
      progressBlock.style.right = `${imageWidth}px`;
    });
  }
}

function getMobileFlag() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    return true;
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return true;
  }
  if (/windows phone/i.test(userAgent)) {
    return true;
  }
  if (/mobile/i.test(userAgent)) {
    return true;
  }
  return false;
}
</script>

<style lang="scss" scoped>
.content {
  background-color: #f7f7f7;
  padding: 0;
  margin: 0;
}
.nav {
  width: 100vw;
  background-color: #fff;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eb3324;
  font-size: 17px;
  font-weight: 500;
  position: relative;
}
.back-btn {
  font-size: 12px;
  position: absolute;
  right: 20px;
  font-weight: 400;
}
.form-item {
  width: 100vw;
  height: 55px;
  display: flex;
  align-items: center;
  background-color: #fff;
  color: #666666;
  margin-top: 15px;
}
.form-item-label {
  width: 120px;
  flex-shrink: 0;
  padding-left: 20px;
}
.form-item-content {
  flex: 1;
  font-size: 17px;
  // color: #333333;
  color: #666666;
  font-weight: 500;
}
.form-input {
  width: calc(100% - 80px);
  border: none !important;
  font-size: 17px;
  color: #333333;
  caret-color: #eb3324;
  padding: 0 Im !important;
  font-weight: 500;
}
.form-input:focus {
  border: none;
  outline: none;
}
.form-input:focus-visible {
  border: none;
  outline: none;
}
.form-desc {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 20px;
  font-size: 12px;
  color: #eb3324;
  background-color: #fff;
  padding-bottom: 4px;
}
.form-warn {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #eb3324;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
}
.form-desc2 {
  padding-left: 15px;
  font-size: 12px;
  color: #eb3324;
  margin-top: 15px;
}
.submit-button {
  margin: 40px auto 0;
  width: calc(100vw - 40px);
  height: 50px;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  background-color: #e9b092;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome, Opera, Safari */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}
.mask {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.mask-content {
  width: calc(100vw - 80px);
  max-width: 900px;
  /* height: 400px; */
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  position: relative;
}
.mask-close {
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: flex-end;
}
.photo-content {
  width: 100%;
  border-radius: 5px;
  aspect-ratio: 913/463;
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(../../assets/images/bg-1.png);
}
/* .photo-module {
      width: 50px;
      height: 40px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #fff;
      position: absolute;
      top: 100px;
      left: 280px;
    } */
.photo-block {
  width: 12.37%;
  position: absolute;
  top: 100px;
  left: 15px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(../../assets/images/bg-block-1.png);
  aspect-ratio: 113/131;
}
.slider-content {
  margin-top: 10px;
  height: 40px;
  border: 1px solid #d3d0d0;
  border-radius: 5px;
  position: relative;
  background-color: #f7f7f7;
}
.slider-tips {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #666666;
}
.drag-item {
  width: 60px;
  height: 40px;
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  top: 0;
}
.drag-item-hover {
  box-shadow: 0 0 2px 2px #60c7e1;
}
.slider-progress {
  border: 1px solid #60c7e1;
  background-color: #d4f9ee;
  border-radius: 5px;
  height: 38px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  margin-top: 20px;
}
.verify-success {
  width: 50px;
  font-size: 60px;
  color: #60c7e1;
}
.verify-fail {
  width: 50px;
  font-size: 60px;
  color: #EB3324;
}
.success-row {
  display: flex;
  margin-bottom: 10px;
  width: 100%;
  padding: 0 20px;
  font-size: 14px;
}
.success-row-title {
  color: #666666;
  width: 90px;
}
.fail-desc{
  color: #666666;
  font-size: 14px;
  margin-top: 10px;
}
</style>
