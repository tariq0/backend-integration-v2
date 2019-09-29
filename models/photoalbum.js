//
//

const db = require('mongoose');

const PhotoalbumSchema = new db.Schema({
    title_ar: String, 
    title_en: String, 
    description_ar: String, 
    description_en: String,
    department_id : // it must be required to make relations.
        {
            type:db.Schema.Types.ObjectId, 
            ref:'Department'
        }        
    ,
    images:[
        {
            type:String, required: true
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const PhotoalbumModel = db.model(
    'Photoalbum', 
    PhotoalbumSchema
    );

module.exports = PhotoalbumModel;