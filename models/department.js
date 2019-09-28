//

const db = require('mongoose');

const DepartmentSchema = new db.Schema({
    name_ar:{type:String, required: true, unique: true}, // required
    name_en:{type:String, required: true, unique: true}, // required && unique
    description_ar:{type:String, required: true}, // required
    description_en:{type:String, required: true}, // required
    photos_ids : [
        {
            type:db.Schema.Types.ObjectId, 
            ref:'Photoalbum'
        }        
    ],
    subdepartments_ids:[
        {
            type:db.Schema.Types.ObjectId, 
            ref:'Subdepartment'
        }
    ]
});

const DepartmentModel = db.model('Department', DepartmentSchema);

module.exports = DepartmentModel;