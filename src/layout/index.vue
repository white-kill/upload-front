<template>
  <div
    :class="classObj"
    class="app-wrapper"
    :style="{ '--current-color': theme }"
  >
    <div class="nav">
      <div class="content">
        <div class="nav-tab">
          <div class="nav-tab-item active">安卓应用</div>
          <div class="nav-tab-item">超级签名</div>
        </div>
        <div>
          <el-dropdown
            @command="handleCommand"
            class="avatar-container right-menu-item hover-effect"
            trigger="hover"
          >
            <div class="avatar-wrapper">
              <img :src="userStore.avatar" class="user-avatar" />
              <span class="user-nickname"> {{ userStore.nickName }} </span>
              <el-icon class="user-nickname"><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <router-link to="/user/profile">
                  <el-dropdown-item>个人中心</el-dropdown-item>
                </router-link>
                <el-dropdown-item divided command="logout">
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="contair">
      <div class="content">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <div class="main">
          <div class="silder">
            <sidebar class="sidebar-container" />
          </div>
          <div class="page">
            <router-view v-slot="{ Component, route }">
              <transition name="fade-transform" mode="out-in">
                <keep-alive :include="tagsViewStore.cachedViews">
                  <component
                    v-if="!route.meta.link"
                    :is="Component"
                    :key="route.path"
                  />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </div>
        <div class="upload-desc">
          <div>
            提示：
            请您确认上传的APP，符合《laotai应用审核规范》，如违反规范，APP将做删除处理，屡次上传将被封禁账号。
          </div>
          <div style="padding-left: 40px">
            根据最新审核规范，不接受如下APP上传本平台：色情类、直播类、金融类、区块链虚拟币等。如已上传，将做删除处理。
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="content">
        <div class="footer-column">
          <div class="footer-column-title">产品服务</div>
          <div class="footer-column-line"></div>
          <div>托管分发</div>
          <div>价格服务</div>
          <div>建议和反馈</div>
        </div>
        <div class="footer-column">
          <div class="footer-column-title">关于我们</div>
          <div class="footer-column-line"></div>
          <div>公司简介</div>
          <div>隐私政策</div>
          <div>更新日志</div>
        </div>
        <div class="footer-column">
          <div class="footer-column-title">联系我们</div>
          <div class="footer-column-line"></div>
          <div>联系扣扣：超级签名</div>
          <div>联系邮箱：a@a.com</div>
          <div>合作邮箱：超级签名</div>
        </div>
      </div>
      <div class="copy-right">Copyright © 2018-2024 超级签名 版权所有</div>
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import Sidebar from "./components/Sidebar/index.vue";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";
import Breadcrumb from "@/components/Breadcrumb";
import useTagsViewStore from "@/store/modules/tagsView";

const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const theme = computed(() => settingsStore.theme);
const sideTheme = computed(() => settingsStore.sideTheme);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);

const classObj = computed(() => ({
  openSidebar: true,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === "mobile",
}));

const { width, height } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

watch(
  () => device.value,
  () => {
    if (device.value === "mobile" && sidebar.value.opened) {
      useAppStore().closeSideBar({ withoutAnimation: false });
    }
  }
);

watchEffect(() => {
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice("mobile");
    useAppStore().closeSideBar({ withoutAnimation: true });
  } else {
    useAppStore().toggleDevice("desktop");
  }
});

function handleClickOutside() {
  useAppStore().closeSideBar({ withoutAnimation: false });
}

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixin.scss" as mix;
@use "@/assets/styles/variables.module.scss" as vars;

.app-wrapper {
  @include mix.clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{vars.$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}

* {
  font-size: 14px;
}
.app-wrapper {
  background-color: #f7f7f7;
}
.nav {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  background-color: #fff;

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1000px;
    margin: 0 auto;
    height: 60px;
    padding-left: 150px;

    .nav-tab {
      display: flex;
      margin-top: 2px;

      .nav-tab-item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 10px;
        margin-right: 15px;
        box-sizing: content-box;
        border-bottom: 2px solid rgba(0, 0, 0, 0);
        cursor: pointer;
      }

      .active {
        color: var(--current-color);
        border-color: var(--current-color);
      }
    }
    .avatar-wrapper {
      display: flex;
      align-items: center;
      height: 40px;
      // gap: 3px;

      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .user-nickname {
        position: relative;
        font-size: 14px;
        font-weight: bold;
        margin-right: 3px;
      }
    }
  }
}
.contair {
  height: calc(100% - 380px);
  min-height: 613px;

  .content {
    width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: 100%;

    .main {
      gap: 15px;
      display: flex;
      flex: 1;

      .silder {
        width: 200px;
        flex-shrink: 0;
        background-color: #fff;
        overflow-y: auto;
        padding-top: 15px;

        .sidebar-container {
          position: relative !important;
          background-color: #fff !important;
          box-shadow: none !important;

          :deep(.el-menu) {
            background-color: #fff !important;

            svg {
              color: var(--current-color) !important;
            }
          }

          :deep(.el-menu-item) {
            color: #000000 !important;
            padding-left: 30px;

            &.is-active {
              background-color: rgb(231, 242, 254) !important;
              color: var(--current-color) !important;
              position: relative;
            }

            &.is-active::before {
              content: "";
              position: absolute;
              left: 0;
              top: 0;
              height: 100%;
              width: 4px;
              background-color: var(--current-color) !important;
            }
          }

          :deep(.el-sub-menu__title) {
            color: #000000 !important;
            padding-left: 30px;
          }
        }
      }

      .page {
        flex: 1;
        overflow-y: auto;
        background-color: #fff;
        padding: 10px;
      }
    }
    .upload-desc {
      padding: 10px 0 10px 215px;
      div {
        font-size: 12px;
        color: #666666;
      }
    }
  }
}
.footer {
  height: 320px;
  padding: 60px 0;
  background-color: black;
  flex-shrink: 0;
  color: #fff;

  .content {
    width: 1000px;
    margin: 0 auto;
    display: flex;

    .footer-column {
      width: 220px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .footer-column-title {
        font-size: 16px;
        margin-bottom: 10px;
      }

      .footer-column-line {
        background-color: #fff;
        width: 16px;
        height: 2px;
        margin-bottom: 5px;
      }
    }
  }
  .copy-right {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
