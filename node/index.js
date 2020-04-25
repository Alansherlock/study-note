const fs = require('fs');
const game = require('./game1');
const koa = require('koa');
const mount = require('koa-mount');
const app = new koa();
let playerWinCount = 0;

let lastPlayerAction = null;
let sameCount = 0;
app.use(mount('/favicon.ico',function(ctx){
    ctx.status = 200;
}));
const gameKoa = new koa();
app.use(
    mount('/game', gameKoa)
)
gameKoa.use(
    async function(ctx,next){
    // 如果统计的玩家胜利次数超过3
    // 或者玩家出现过作弊的情况（sameCount=9代表玩家有过作弊行为）
    console.log(playerWinCount);
    if (playerWinCount >= 3 ) {
        ctx.status = 500;
        ctx.body = '我再也不和你玩了！';
        return
    }
    await next();
    if(ctx.playerWon) {
        playerWinCount++;
    }
});
gameKoa.use(
    async function (ctx, next) {
        const query = ctx.query;
        const playerAction = query.action;
        if (!playerAction) {
            ctx.status = 400;
            return;
        }
        if (sameCount == 9) {
            ctx.status = 500;
            ctx.body = '我不会再玩了！'
        }

        if (lastPlayerAction == playerAction) {
            sameCount++
            if (sameCount >= 3) {
                ctx.status = 400;
                ctx.body = '你作弊！我再也不玩了'
                sameCount = 9
                return;
            }

        } else {
            sameCount = 0;
        }
        lastPlayerAction = playerAction;
        ctx.playerAction = playerAction
        await next();
    }
)
gameKoa.use(
    async function (ctx, next) {
        const playerAction = ctx.playerAction;
        const result = game(playerAction);
        console.log(result,playerAction);
        // 对于一定需要在请求主流程里完成的操作，一定要使用await进行等待
        // 否则koa就会在当前事件循环就把http response返回出去了
        await new Promise(resolve => {
            setTimeout(() => {
                ctx.status = 200;
                if (result == 0) {
                    ctx.body = '平局'

                } else if (result == -1) {
                    ctx.body = '你输了'

                } else {
                    ctx.body = '你赢了'
                    ctx.playerWon = true;

                }
                resolve();
            }, 500)
        })
    }
)
app.use(mount('/',function(ctx){
    ctx.body = fs.readFileSync(__dirname + '/game1.html', 'utf-8');
}));
app.listen(3000)
