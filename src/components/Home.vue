<template>
  <!-- 容器 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img src="../assets/logo.png" alt="" />
        <p>电商后台管理系统</p>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="transparent"
          text-color="#262626"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active='$route.path'
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' +subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <!-- 二级菜单模板区 -->
              <template slot="title">
                <i class="el-icon-caret-right"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-grid',
        101: 'el-icon-box',
        102: 'el-icon-postcard',
        145: 'el-icon-s-data',
      },
      isCollapse: false,
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 600px;
  .header-left {
    display: flex;
    width: 500px;
    img {
      height: 60px;
    }
  }
  p {
    font-size: 30px;
    font-weight: bold;
    color: rgb(87, 87, 87);
    height: 100%;
    line-height: 60px;
    margin: 0;
  }
  .el-button {
    height: 40px;
  }
}
.el-aside {
  background-color: #f4f4f4;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  width: 100%;
  background-color: #4a5064;
  left: 50%;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>