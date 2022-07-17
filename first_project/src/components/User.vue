<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 搜索框 -->
            <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                      @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <el-button type="primary" plain @click="addDialogVisible = true">添加用户</el-button>
          </div>
        </el-col>
      </el-row>

      <!--数据table-->
      <el-table
          :data="userList"
          style="width: 100%" stripe border>
        <el-table-column type="index"/>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"
                       @click="deleteUser(scope.row.id,scope.row.username)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>

export default {
  name: "User",
  data() {
    // 验证邮箱的规则
    let checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    let checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      //用户信息列表
      userList: [],
      //获取用户列表参数对象
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //每页显示条数
        pagesize: 2
      },
      //总数据条数
      total: 0,
      //控制添加用户信息弹框
      addDialogVisible: false,
      //控制修改用户信息弹框
      editDialogVisible: false,
      //添加用户表单信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      //修改用户表单信息
      editForm: {
        email: '',
        mobile: ''
      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      }
    }

  },
  methods: {
    //获取用户数据列表
    getUserList() {
      this.$http({
        url: '/users',
        params: this.queryInfo,
        methods: 'GET'
      }).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取用户列表失败")
        }
        this.userList = res.data.data.users
        this.total = res.data.data.total
      })
    },
    //添加用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return
        }
        //发起添加用户的网络请求
        this.$http({url: '/users', method: 'POST', data: this.addForm}).then(res => {
          console.log(res);
          if (res.data.meta.status !== 201) {
            return this.$message.error("添加用户失败")
          }
          //隐藏添加对话框
          this.addDialogVisible = false
          this.getUserList()
          this.$message.success('添加用户成功')
        })
      })
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //修改用户
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return
        }
        let info = {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }
        //发起修改用户的网络请求
        this.$http({url: `/users/${this.editForm.id}`, method: 'PUT', data: info}).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("获取更新信息失败")
          }
          //隐藏修改对话框
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('更新用户成功')
        })
      })
    },
    //显示修改对话框，并加载数据到输入框
    showEditDialog(userId) {
      //根据id查找内容
      this.$http({url: `/users/${userId}`, method: 'GET'}).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取用户信息失败")
        }
        //将信息加载到修改对话框中
        this.editForm = res.data.data
      })
      this.editDialogVisible = true
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //删除提示
    deleteUser(userId, userName) {
      this.$confirm('此操作将永久用户:' + userName + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({url: `/users/${userId}`, method: 'DELETE'}).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("删除用户信息失败")
          }
          this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },


    //监听pagesize改变事件
    handleSizeChange(newSize) {
      console.log(`每页` + newSize + `条`);
      this.queryInfo.pagesize = newSize
      this.getUserList()

    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      console.log(`当前页: 5`)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //监听switch开关状态改变
    userStateChange(userInfo) {
      console.log(userInfo)
      this.$http({url: "users/" + userInfo.id + "/state/" + userInfo.mg_state, method: 'PUT'}).then(res => {
        if (res.data.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功！')
      })
    },

  },

  created() {
    this.getUserList();
  }
}
</script>

<style scoped>
</style>