const User = require('../models/User');

const createUser = (user) => {
    return User.create(user);
}

const getUser = (username) => {
    return new Promise((resolve, reject)=>{
        User.findOne({ username }, (err, doc)=>{
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    })
}

const login = async ( ctx ) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let doc = await getUser(username);

    if(!doc){
        ctx.status = 200;
        ctx.body = {
            errMsg: '用户名不存在!'
        }
    }else if(doc.password !== password){
        ctx.status = 200;
        ctx.body = {
            errMsg: '密码错误!'
        }
    }else{
        ctx.status = 200;
        ctx.body = { 
            successMsg: '登录成功!',
            username
        };
    }
}

const register = async ( ctx ) => {
    let user = {
        username: ctx.request.body.username,
        password: ctx.request.body.password
    };

    let doc = await getUser(user.username);
    if(doc){
        ctx.status = 200;
        ctx.body = {
            errMsg: '用户名已存在!'
        };
    }else{
        let result = await createUser(user);
        if(result){
            ctx.status = 200;
            ctx.body = {
                successMsg: '注册成功!',
                username: result.username
            }
        }else{
            ctx.status = 200;
            ctx.body = {
                errMsg: '注册失败!',
                err
            }
        }
    }
}

module.exports = {
    login,
    register
};

