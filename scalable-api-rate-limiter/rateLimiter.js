const redis = require('redis');
const moment = require('moment');
const redisClient = redis.createClient();

module.exports = (req,res,next) => {    
    redisClient.exists(req.headers.user,(err,status) => {
        if(err){
            console.log("Something went wrong with redis");
            return res.status(500).json({
                status : 'fail',
                message : "Something went wrong"
            });
            //process.exit(1);
        }
        if(status === 1) {
            redisClient.get(req.headers.user,(err,redisResponse) => {
                let data = JSON.parse(redisResponse);
                let actualTime = moment().unix();
                let lessThanTimeAgo = moment().subtract(30,'seconds').unix(); // days, minute, month and years by referring to moment.js

                let actualRequestCount = data.filter((item) => {
                    return item.requestTime > lessThanTimeAgo;
                })
                let reqHoldCount = 0;
                actualRequestCount.forEach((item) => {
                    reqHoldCount = reqHoldCount + item.counter;
                })
                if(reqHoldCount >= 5){ // set total number of request ex.5 in 30 seconds
                    return res.status(429).json({
                        status : 'fail',
                        message : "Too Many Requests"
                    });
                }else{
                    let isFound = false;
                    data.forEach(element => {
                        if(element.requestTime) {
                            isFound = true;
                            element.counter++;
                        }
                    });
                    if(!isFound){
                        data.push({
                            requestTime : actualTime,
                            counter : 1
                        })
                    }                  
                    redisClient.set(req.headers.user,JSON.stringify(data));
                    next();
                }
            })
        }else{
            let data = [];
            let requestData = {
                'actualRequestTime' : moment().unix(),
                'counter' : 1
            }
            data.push(requestData);
            redisClient.set(req.headers.user,JSON.stringify(data));
            next();
        }
    })
}