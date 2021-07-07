<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 头部搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="editOrder(scope.row)"
            ></el-button>
            <el-button
              icon="el-icon-location"
              type="success"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 编辑地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editOrderDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="adress1">
          <el-input v-model="addressForm.adress1"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="addressForm.adress2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
    >
      <span>获取物流信息失败，服务器异常</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="progressVisible = false">取 消</el-button>
    <el-button type="primary" @click="progressVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1,
      },
      //   订单列表
      ordersList: [],
      //   订单总数
      total: 0,
      //   控制修改地址对话框的显示与隐藏
      editOrderDialogVisible: false,
      //   修改地址表单
      addressForm: {
        adress1: '',
        adress2: '',
      },
      //   修改地址表单的验证规则
      addressFormRules: {
        adress1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' },
        ],
        adress2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      progressVisible:false
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    //   获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.$message.success('获取订单列表成功')
      this.ordersList = res.data.goods
      this.total = res.data.total
      console.log(this.ordersList)
      console.log(this.total)
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrdersList()
    },
    //
    editOrder(row) {
      this.editOrderDialogVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    showProgress(){
        this.$message.error('获取物流进度失败')
        this.progressVisible = true
    }
  },
}
</script>

<style lang="less" scoped>
</style>