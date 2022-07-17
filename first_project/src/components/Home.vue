<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px' : '200px'">

        <div class="z-toggle-div" @click="toggleCollapse">|||</div>

        <!--侧面菜单栏区域-->
        <el-menu @open="handleOpen" @close="handleClose" background-color="#E5E5E5" text-color="#000000"
                 active-text-color="#148DC1" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false"
                 :router="true" :default-active="activePath">
          <!-- 一级菜单栏 -->
          <el-submenu :index="menu.id+''" v-for="menu in menuList" :key="menu.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单栏 -->
            <el-menu-item :index="'/'+item.path" v-for="item in menu.children" :key="item.id"
                          @click="savaNavStatus('/'+item.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data() {
    return {
      menuList: [], //菜单列表
      isCollapse: false, //菜单折叠
      activePath: '' //当前激活菜单名
    }
  },
  name: "Home",
  methods: {
    //退出登录
    logout() {
      //弹窗确定是否退出
      this.$confirm('是否确定退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //清除会话session
        window.sessionStorage.clear()
        this.$router.push('/login')
      })
    },

    //获取菜单
    getMenuList() {
      this.$http({methods: 'GET', url: '/menus'}).then(res => {
        //未获取列表信息
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.data.msg)
        }
        this.menuList = res.data.data;
        console.log(this.menuList)
      })
    },

    //打开、折叠菜单栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },

    //保留链接激活状态
    savaNavStatus(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }

  },

  created() {
    //加载菜单列表
    this.getMenuList();
    //加载选中激活的菜单栏高亮
    this.activePath = window.sessionStorage.getItem('activePath')
  },
}
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}

.el-header {
  background-color: #148DC1;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;
  }

  span {
    margin-left: 15px;
  }
}

.el-aside {
  background-color: #E5E5E5;

  .el-menu {
    border-right: none;
  }
}


.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.z-toggle-div {
  background-color: #7ab9d5;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>