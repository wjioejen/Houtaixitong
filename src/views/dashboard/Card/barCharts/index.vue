<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "barChart",
  //可以获取DOM
  mounted() {
    // 初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts);
    // 配置数据
    barCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        //均分
        type: "category",
        
      },
      yAxis: {
        // 隐藏y轴
        show: false,
      },
      // 系列
      series: [
        {
          // 图表的元素
          type: "bar",
          data: [10, 7, 33, 12, 88, 29, 26, 25, 76,33,8],
          color:'cyan'
        },
      ],
      // 布局模式
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip:{}
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>