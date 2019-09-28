//
//

const db = require('mongoose');

const PublicationSchema = new db.Schema({

    title_ar:{type:String, required: true, unique: true}, // required
    title_en:{type:String, required: true, unique: true}, // required && unique
    description_short_ar:{type:String, required: true}, // required
    description_short_en:{type:String, required: true}, // required

    description_long_ar:{type:String, required: true}, // required
    description_long_en:{type:String, required: true}, // required
    date: Date,
    image : 
        {
            type:String
        }        
    ,
    files : [
        {
            type:String
        }        
    ],
    news_id:{
        type:db.Schema.Types.ObjectId, 
        ref:'News'
    }
    ,
    
    user_id : {
        type:db.Schema.Types.ObjectId, 
        ref:'User'
    }
});

const PublicationModel = db.model('Publication', PublicationSchema);

module.exports = PublicationModel;