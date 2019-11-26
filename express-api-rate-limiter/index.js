const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();

const router = express.Router();

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// app.set('trust proxy', 1);
 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // start blocking after 20 request
    handler: function handler(req, res) {
        return res.status(429).json({
            status : 'fail',
            message : "Too Many Requests"
        });
    },
});

router
    .route('/users')
    .get((req,res)=>{
        return res.status(200).json({
            status:'success',
            message:'Users not found'
        });
    });

app.use('/api/v1/',apiLimiter,router);

 
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 25, // start blocking after 25 requests
    handler: function handler(req, res) {
        return res.status(429).json({
            status : 'fail',
            message : "Too Many Requests"
        });
    },
});
app.get("/login", createAccountLimiter, function(req, res) {
  return res.status(200).json({
      status:'success',
      message:'Login successfully'
  });
});

app.listen(3000,() => {
    console.log('Server is running on port 3000');
});