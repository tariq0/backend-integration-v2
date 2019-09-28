//
//

const db = require('mongoose');

const SubDepartmentSchema = new db.Schema({
    name_ar: {type:String, required: true, unique: true}, // required
    name_en: {type:String, required: true, unique: true}, // required && unique
    description_ar: String, 
    description_en: String,
    department_id : 
        {
            type:db.Schema.Types.ObjectId, 
            ref:'Department'
        }        
    ,
    sub_subdepartments:[
        {
            name_ar: String,
            name_en:String,
            id:Number
        }
    ]
});

const SubDepartmentModel = db.model(
    'SubDepartment', 
    SubDepartmentSchema
    );

module.exports = SubDepartmentModel;