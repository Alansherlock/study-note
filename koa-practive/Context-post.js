const koa = require('koa');

const app =new koa();
app.use(async ctx => {
    let postdata = '';
    ctx.req.on('data',(data) => {
        postdata +=data;
    });
    ctx.req.on('end',()=>{
        console.log(postdata);
    })
})
app.listen(3000,()=>{
    console.log('server is running at http://localhost:3000');
});

// curl -d "param1=value1&param2=value2" http://localhost:3000/ 模拟POST请求

