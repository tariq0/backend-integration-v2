//
//

const db = require('mongoose');

const PhotoalbumSchema = new db.Schema({
    title_ar: String, 
    title_en: String, 
    description_ar: String, 
    description_en: String,
    department_id : 
        {
            type:db.Schema.Types.ObjectId, 
            ref:'Department'
        }        
    ,
    img:{type:String, required: true, unique: true}
});

const PhotoalbumModel = db.model(
    'Photoalbum', 
    PhotoalbumSchema
    );

module.exports = PhotoalbumModel;