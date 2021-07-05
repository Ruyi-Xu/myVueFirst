<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            type="success"
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            >二级</el-tag
          >
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" class="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" class="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类对话框表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            @change="parentCateChanged"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
              checkStrictly:true
            }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catesList: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isOk' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' },
      ],
      addCateDialogVisible: false,
      addCateForm: {},
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
        ],
      },
      //   选择的父级分类
      selectedKeys: [],
      // 添加商品分类的表单
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      parentCateList: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.catesList = res.data.result
      this.total = res.data.total
      //   console.log(this.catesList)
      console.log(this.catesList)
    },
    // 控制页面大小的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 翻页
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击按钮显示添加分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.parentCateList = res.data
      console.log(res.data)
    },
    parentCateChanged() {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories`,
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('提交商品分类失败')
        }
        this.$message.success('提交商品分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },

    // 监听添加分类对话框的关闭事件
    addCateDialogClosed() {
      console.log('ddd')
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>