// 这个模块主要获取的是品牌管理的数据模块
import request from '@/utils/request'
// 获取品牌列表接口  
//  /admin/product/baseTrademark/{page}/{limit}  get
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// 处理添加品牌
// 新增品牌  /admin/product/baseTrademark/save  post  携带两个参数：品牌名字、品牌logo
// 切记：对于新增的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成

// 修改品牌的  /admin/product/baseTrademark/update  put 携带三个参数 id，品牌名称、品牌logo
// 切记：对于修改的某一个品牌的操作，前端携带的参数需要带上 id ，你要告诉服务器修改的哪一个品牌
export const reqAddUpdateTradeMark=(tradeMark)=>{
    // 带给服务器数据携带ID---修改
    if(tradeMark.id){
        return request({url:'/admin/product/baseTrademark/update',method:"put",data:tradeMark})
    }else{
        // 新增品牌
        return request({url:'/admin/product/baseTrademark/save',method:"post",data:tradeMark})
    }
} 


// 删除品牌的接口 
// /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark=(id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
