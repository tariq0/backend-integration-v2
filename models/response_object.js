// format of response of our objects. 
// an object that represents data format send
// by server to front end.

class ResponseObject {
    constructor(cur_user_, data_){
        this.current_user = cur_user_;
        this.data = data_ 
    }
}

module.exports = ResponseObject;