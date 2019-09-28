// database
const mongoose = require('mongoose');

// db config
const server = '127.0.0.1:27017'; 
const database = 'backend-demo';
const connectionSuc = `database connected @ ${server}`;
const connectionFail = `database faild to connect ${server}`;

// db connection
class DataBase{
    constructor(){
        this._connect();
    }

    _connect(){
        mongoose.connect(`mongodb://${server}/${database}`, {useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}).
        then(()=>{
            console.log(connectionSuc);
        }).
        catch(()=>{
            console.log(connectionFail);
        })
    }
}

module.exports = new DataBase();