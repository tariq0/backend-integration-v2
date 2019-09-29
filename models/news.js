//

const db = require('mongoose');

const NewsSchema = new db.Schema({
    title_ar:{type:String, required: true, unique: true}, // required
    title_en:{type:String, required: true, unique: true}, // required && unique
    description_short_ar:{type:String, required: true}, // required
    description_short_en:{type:String, required: true}, // required

    description_long_ar:{type:String, required: true}, // required
    description_long_en:{type:String, required: true}, // required
    date: {
        type: Date,
        default: Date.now
    },
    images : [
        {
            type:String
        }        
    ],
    files : [
        {
            type:String
        }        
    ],
    subdepartments_ids:[
        {
            type:String
        }
    ],
    genre :{type:String, required: true},
    user_id : {
        type:db.Schema.Types.ObjectId, 
        ref:'User'
    }
});

const NewsModel = db.model('News', NewsSchema);

module.exports = NewsModel;