<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 头部搜索区和添加商品按钮区 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addPage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoodsDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品对话框 -->
    <!-- <el-dialog title="提示" :visible.sync="addGoodsDialogVisible" width="50%">
      <el-form
        :model="addGoodsForm"
        :rules="goodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input
            v-model="addGoodsForm.goods_weight"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input
            v-model="addGoodsForm.goods_number"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 编辑商品对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editGoodsDialogVisible"
      width="50%"
    >
      <!-- 修改商品表单区 -->
      <el-form
        :model="editGoodsForm"
        :rules="goodsFormRules"
        ref="editGoodsFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input
            v-model="editGoodsForm.goods_price"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input
            v-model="editGoodsForm.goods_weight"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input
            v-model="editGoodsForm.goods_number"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods"
          >确 定</el-button
        >
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
      goodsList: [],
      total: 0,
      addGoodsDialogVisible: false,
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
      },
      goodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      cateList: [],
      selectedKeys: [],
      editGoodsDialogVisible: false,
      editGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0, 
      },
      edit_goods_id:0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   获取商品分类列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      // console.log(this.goodsList)
      this.total = res.data.total
    },
    // 监听分页区pagesize的大小
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听分页区pagenum
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    // 点击添加商品按钮显示添加商品对话框
    // showAddGoodsDialog() {
    //   this.getCateList()
    //   this.addGoodsDialogVisible = true
    // },
    // 监听级联选择器的变化
    handleChange() {
      console.log(this.selectedKeys)
    },
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 点击确定按钮提交添加商品表单
    // addGoods() {
    //   this.$refs.addGoodsFormRef.validate(async (valid) => {
    //     if (!valid) return
    //     const { data: res } = await this.$http.post(`goods`, {
    //       goods_name: this.addGoodsForm.goods_name,
    //       goods_price: this.addGoodsForm.goods_price,
    //       goods_weight: this.addGoodsForm.goods_weight,
    //       goods_number: this.addGoodsForm.goods_number,
    //       goods_cat: this.selectedKeys.join(','),
    //     })
    //     if (res.meta.status !== 201) {
    //       return this.$message.error('添加商品失败')
    //     }
    //     this.$message.success('添加商品成功')
    //     this.getGoodsList()
    //     this.addGoodsDialogVisible = false
    //   })
    // },
    // 点击删除按钮删除商品
    async removeGoods(row) {
      const confirmResult = await this.$confirm(
        `此操作将永久删除${row.goods_name}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除操作已取消')
      }
      console.log(row)
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    // 通过id获取商品信息,并显示编辑商品信息对话框
    async showEditGoodsDialog(row) {
      this.editGoodsForm.goods_name = row.goods_name
      this.editGoodsForm.goods_weight = row.goods_weight
      this.editGoodsForm.goods_number = row.goods_number
      this.editGoodsForm.goods_price = row.goods_price
      this.edit_goods_id = row.goods_id
      this.editGoodsDialogVisible = true
      console.log(this.edit_goods_id)
      console.log(this.editGoodsForm)
    },
    // 点击确定按钮提交编辑好的商品信息
    async editGoods(){
      const {data:res} = await this.$http.put(`goods/${this.edit_goods_id}`, this.editGoodsForm)
      if(res.meta.status !== 200){
        return this.$message.error('接口出错')
      }
      this.$message.success('修改商品信息成功')
      this.getGoodsList()
      this.editGoodsDialogVisible = false
    },
    addPage(){
      this.$router.push('goods/add')
    }
  },
}
</script>

<style lang="less" scoped>
</style>