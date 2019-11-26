const express = require('express');
const redisRateLimiter = require('./rateLimiter');
const app = express();

app.use(redisRateLimiter);

app.get('/login',function (req,res){
    return res.status(200).json({
        status : 'sucess',
        message : 'Login successfully'
    });
});


app.listen(3000,() => {
    console.log('Server is running on port 3000');
});