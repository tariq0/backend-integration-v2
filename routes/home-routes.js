// home page routes
const express = require('express');
const router = express.Router();


class ResponseObject {
    constructor(cur_user_, data_){
        this.current_user = cur_user_;
        this.data = data_ 
    }
}

router.get('',(req, res, next)=>{
        
        //res.clearCookie('shit');
        //res.clearCookie('hiyouhere');
        //res.setHeader('Set-Cookie','hiyouhere=2020215; Max-Age=10');
        //res.cookie('shit','10');
        const data = 'Welcome Home Page!';
        const resObj = new ResponseObject(
            req.user, data
        );
        res.json(resObj);
    }
);





module.exports = router;