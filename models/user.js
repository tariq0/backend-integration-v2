//

const db = require('mongoose');

const UserSchema = new db.Schema({
    first_name: {type:String, required: true},                   // required
    last_name: {type:String, required: true},                    // required
    password:{type:String, required: true},                      // required
    email: {type:String, required: true, index:{unique: true}},          // required & unique
    address: { 
        type:{
            county: String,
            city: String
        },
        required: true
    },
    role: String,
    permissions: [String],
    department_id :{type:db.Schema.Types.ObjectId}
    
});

const UserModel = db.model('user', UserSchema);
module.exports = UserModel;
