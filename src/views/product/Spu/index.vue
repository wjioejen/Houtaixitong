<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动定义事件 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里将来的三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示SPU列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加spu</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里按钮将来用hintBUtton替换 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加spu"
                @click="addSku(row)"
              ></hint-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看所有spu实例"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 跳转第几页页面 -->
        <!-- @size-change="handleSizeChange" -->
        <!-- 点击第几页就会跳转到第几页页面 -->
        <!-- @current-change="handleCurrentChange" -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager,next, jumper,-> ,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total"
        >
        </el-pagination>
      </div>

      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"
        >添加SPU|修改SPU</SpuForm
      >
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"
        >添加SKu</SkuForm
      >
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <!-- table展示sku列表 -->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from "./SpuForm/index.vue";
import SkuForm from "./SkuForm/";
export default {
  name: "Spu",
  data() {
    return {
      // 分别是分类的id
      category1Id: "",
      categoty2Id: "",
      category3Id: "",
      // 控制三级联动的可操作性
      // show: true,
      page: 1, //分页器当前第几页
      limit: 3, //每一页展示多少条数据
      records: [], //spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示SPU列表数据，1 添加SPU |修改SPU  2 添加SKU
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [], //存储的是SKU列表的数据
      loading:true
    };
  },
  methods: {
    // 点击分页器的第几页按钮的回调
    // handleCurrentChange(page){
    //   console.log(page)
    //   this.page=page
    //   this.getSPuList()
    // },

    // 三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId:获取到一、二、三级分类的id level:为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        // 消除2，3级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        // 清除三级id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 获取SPU列表数据进行展示
        this.getSpuList();
      }
    },
    // 获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      // 携带三个参数：page 第几页  limit 每一页需要展示多少条数据 三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      // console.log(result);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit;
      // 再发请求
      this.getSpuList();
    },
    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件SpuForm发请求--两个
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个SPU
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件SpuForm子组件的
      // console.log(this.$refs.spu)
      // 在父组件当中可以通过$ref、children获取子组件等等
      this.$refs.spu.initSpuData(row);
    },
    //自定义事件回调(SpuForm)
    changeScene({ scene, flag }) {
      // flaf这个形参是为了区分这个按钮式添加还是修改
      // console.log(scene)
      // 切换结构(场景)
      this.scene = scene;
      // 子组件通知父组件切换场景，需要再次获取SPU列表的数据进行展示
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除SPU的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(
          this.records.length > 1 ? this.page : this.page.length - 1
        );
      }
    },
    //添加SKU按钮的回调
    addSku(row) {
      // console.log(row)
      // 切换场景为2
      this.scene = 2;
      // 父组件调用子组件的方法，让子组件发请求----三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //skuForm通知父组件修改场景
    changeScenes(scenes) {
      this.scene = scenes;
    },
    // 产看sku按钮的回调
    async handler(spu) {
      // 点击按扭的时候，对话框可见的
      this.dialogTableVisible = true;
      // 保存spu的信息
      this.spu = spu;
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      console.log(result);
      if (result.code == 200) {
        this.skuList = result.data;
        // loading隐藏
        this.loading = false;
      }
    },
    // 关闭对话框的回调
    close(done) {
      // loading属性再次变为真
      this.loading = true;
      //  清除sku列表的数据
      this.skuList = [];
      // 关闭对话框
      done()
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>