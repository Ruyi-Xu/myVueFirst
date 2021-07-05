<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 顶部警告提示区 -->
      <el-alert
        title="注意：只允许为第三级分类设置参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 分类选择器 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 连级选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="showAddDialog"
            >添加参数</el-button
          >

          <el-table :data="manyTableData" style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item , i) in scope.row.attr_vals"
                  :key="item.attr_id"
                  closable
                  @close='handleClosed(i, scope.row)'
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.ManyInputVisible"
                  v-model="scope.row.ManyInputValue"
                  ref="ManyInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showManyInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 序号 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showRemoveDialog(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="showAddDialog"
            >添加属性</el-button
          >

          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="item in scope.row.attr_vals"
                  :key="item.attr_id"
                  closable
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.onlyInputVisible"
                  v-model="scope.row.onlyInputValue"
                  ref="onlyInputRef"
                  size="small"
                  @keyup.enter.native="handleOnlyInputConfirm(scope.row)"
                  @blur="handleOnlyInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showonlyInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 序号 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showRemoveDialog(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 验证表单 -->
      <el-form
        :model="AddForm"
        :rules="AddFormrules"
        ref="AddFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="AddForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改数据对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="AddFormrules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      //   通过练级选择器选择的商品分类数组
      selectedKeys: [],
      activeName: 'many',
      //   动态属性数据
      manyTableData: [],
      //   静态属性数据
      onlyTableData: [],
      addDialogVisible: false,
      AddForm: {},
      AddFormrules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false,
      editForm: {
        attr_name: '',
      },
      edit_Attr_Id: '',
      // ManyInputVisible: false,
      // ManyInputValue: '',
      // onlyInputVisible:false,
      // onlyInputValue: '',
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 3 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.cateList = res.data
      //   console.log(this.cateList)
    },
    handleChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData =[]
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(`获取参数列表失败`)
      }

      if (this.activeName === 'many') {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.ManyInputVisible = false
          item.ManyInputValue = ''
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.onlyInputVisible = false
          item.onlyInputValue = ''
        })
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    addDialogClosed() {
      this.$refs.AddFormRef.resetFields()
    },
    // 提交添加参数/属性表单
    addParams() {
      this.$refs.AddFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { attr_name: this.AddForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 显示修改参数对话框
    async showEditDialog(row) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm.attr_name = res.data.attr_name
      this.edit_Attr_Id = res.data.attr_id
      console.log(res.data)
      this.editDialogVisible = true
    },
    // 修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.edit_Attr_Id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    async showRemoveDialog(row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${row.attr_id}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    //点击按钮显示
    showManyInput(row) {
      row.ManyInputVisible = true
      // $nextTick的作用就是当页面上的元素被重新渲染后才会执行函数中的代码
      this.$nextTick((_) => {
        this.$refs.ManyInputRef.$refs.input.focus()
      })
    },
    async handleInputConfirm(row) {
      if (row.ManyInputValue.trim().length === 0) {
        row.ManyInputValue = ''
        row.ManyInputVisible = false
        return
      }
      row.attr_vals.push(row.ManyInputValue.trim())
      row.ManyInputValue = ''
      this.saveAttrVals(row)
    },
    showonlyInput(row){
      row.onlyInputVisible = true
      this.$nextTick((_) => {
        this.$refs.onlyInputRef.$refs.input.focus()
      })
    },
    async handleOnlyInputConfirm(row) {
      if (row.onlyInputValue.trim().length === 0) {
        row.onlyInputValue = ''
        row.onlyInputVisible = false
        return
      }
      row.attr_vals.push(row.onlyInputValue.trim())
      row.onlyInputValue = ''
      this.saveAttrVals(row)
    },
    async saveAttrVals(row){
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(','),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
      row.onlyInputVisible = false
    },
    handleClosed(i, row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    //   如果按钮需要被禁用返回true,反之返回false
    isBtnDisable() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 选中的三级分类的id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 15px;
}
.input-new-tag {
  width: 150px;
}
</style>