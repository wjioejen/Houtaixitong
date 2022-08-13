const { config } = require('@vue/test-utils')
const data =require('./data')
module.exports=[
    {
        url:'/home/list',
        type:'get',
        response:config=>{
            const items = data.items 
            return{
                code:20000,
                data
            }
        }
    }
]